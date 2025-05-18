import { NextResponse } from "next/server";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import OpenAI from "openai";

// Define interfaces for our data structures
interface Session {
  user: {
    id: string;
  };
}

interface SearchRequest {
  query: string;
  searchType: "ai" | "pattern";
  session: Session;
}

interface Document {
  id: string;
  url: string;
  title: string;
  meta: Record<string, any>;
  tags: string[];
  text?: string;
}

interface PageSection {
  document_id: string;
  context: string;
  similarity?: number;
}

interface SearchResult {
  id: string;
  url: string;
  title: string;
  content?: string;
  tags: string[];
  relevantSections: {
    context: string;
    similarity?: number;
  }[];
}

interface EmbeddingResponse {
  data: {
    embedding: number[];
  }[];
}

const supabase: SupabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request): Promise<NextResponse> {
  const { query, searchType, session }: SearchRequest = await req.json();

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    if (searchType === "ai") {
      const result = await aiSearch(query, session.user.id);
      return result;
    } else if (searchType === "pattern") {
      return await patternSearch(query, session.user.id);
    } else {
      return NextResponse.json(
        { error: "Invalid search type" },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("Error during search:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}

async function aiSearch(query: string, userId: string): Promise<NextResponse> {
  console.log("embeddings mistral lesgo");
  const embeddingResponse = await fetch(
    "https://api.mistral.ai/v1/embeddings",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
      },
      body: JSON.stringify({
        input: query,
        model: "mistral-embed",
        encoding_format: "float",
      }),
    },
  );

  const embedData: EmbeddingResponse = await embeddingResponse.json();
  const queryEmbedding = embedData.data[0]?.embedding;

  const { data: sections, error: sectionsError } = await supabase.rpc(
    "match_page_sections",
    {
      query_embedding: queryEmbedding,
      similarity_threshold: 0.3,
      match_count: 5,
      user_id: userId,
    },
  );

  console.log("sections", sections);
  console.log("sectionsError", sectionsError);

  if (sectionsError) throw sectionsError;

  // TODO: remove any
  const documentIds = [
    ...new Set(sections.map((section: any) => section.document_id)),
  ];

  const { data: documents, error: documentsError } = await supabase
    .from("documents")
    .select("id, url, title, meta, tags, text")
    .in("id", documentIds)
    .eq("user_id", userId);

  if (documentsError) throw documentsError;

  const results: SearchResult[] = documents.map((doc) => ({
    id: doc.id,
    url: doc.url,
    title: doc.title,
    content: doc.text,
    tags: doc.tags,
    relevantSections: sections
      .filter((section: any) => section.document_id === doc.id)
      .map((section: any) => ({
        context: section.context,
        similarity: section.similarity,
      })),
  }));

  console.log(results);

  return NextResponse.json({ results });
}

async function patternSearch(
  query: string,
  userId: string,
): Promise<NextResponse> {
  const { data: documents, error: documentsError } = await supabase
    .from("documents")
    .select("id, url, title, meta, tags")
    .eq("user_id", userId)
    .textSearch("text", query)
    .limit(5);

  if (documentsError) throw documentsError;

  const { data: sections, error: sectionsError } = await supabase
    .from("page_sections")
    .select("document_id, context")
    .textSearch("context", query)
    .limit(10);

  if (sectionsError) throw sectionsError;

  const sectionDocIds = sections.map((section) => section.document_id);
  const { data: additionalDocs, error: additionalError } = await supabase
    .from("documents")
    .select("id, url, title, meta, tags")
    .in("id", sectionDocIds)
    .not("id", "in", `(${documents.map((d) => d.id).join(",")})`);

  if (additionalError) throw additionalError;

  const allResults: SearchResult[] = [...documents, ...additionalDocs].map(
    (doc) => ({
      id: doc.id,
      url: doc.url,
      title: doc.title,
      tags: doc.tags,
      relevantSections: sections
        .filter((section) => section.document_id === doc.id)
        .map((section) => ({
          context: section.context,
        })),
    }),
  );

  return NextResponse.json({ results: allResults });
}
