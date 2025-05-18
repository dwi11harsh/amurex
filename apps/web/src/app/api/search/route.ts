import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import OpenAI from "openai";

// Database types
interface Document {
  id: string;
  url: string;
  title: string;
  meta: Record<string, unknown>;
  tags: string[];
  user_id: string;
  text: string;
}

interface PageSection {
  document_id: string;
  context: string;
}

interface SearchResult {
  id: string;
  url: string;
  title: string;
  tags: string[];
  relevantSections: {
    context: string;
  }[];
}

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

interface EmbeddingResponse {
  data: Array<{
    embedding: number[];
    index: number;
    object: string;
  }>;
  model: string;
  object: string;
  usage: {
    prompt_tokens: number;
    total_tokens: number;
  };
}

const supabase: SupabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
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
  } catch (error: unknown) {
    console.error("Error during search:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
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

  if (!embeddingResponse.ok) {
    throw new Error("Failed to get embeddings from Mistral AI");
  }

  const data: EmbeddingResponse = await embeddingResponse.json();
  return NextResponse.json({ embeddings: data });
}

async function patternSearch(
  query: string,
  userId: string,
): Promise<NextResponse> {
  // First search in documents
  const { data: documents, error: documentsError } = await supabase
    .from("documents")
    .select("id, url, title, meta, tags")
    .eq("user_id", userId)
    .textSearch("text", query)
    .limit(5);

  if (documentsError) throw documentsError;

  // Then search in page_sections
  const { data: sections, error: sectionsError } = await supabase
    .from("page_sections")
    .select("document_id, context")
    .textSearch("context", query)
    .limit(10);

  if (sectionsError) throw sectionsError;

  // Get additional documents from matching sections
  const sectionDocIds = sections.map((section) => section.document_id);
  const { data: additionalDocs, error: additionalError } = await supabase
    .from("documents")
    .select("id, url, title, meta, tags")
    .in("id", sectionDocIds)
    .not("id", "in", `(${documents.map((d) => d.id).join(",")})`);

  if (additionalError) throw additionalError;

  // Combine all results
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
