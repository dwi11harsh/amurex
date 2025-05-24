// 1. Import Dependencies
// import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
// import { MemoryVectorStore } from "langchain/vectorstores/memory";
// import { BraveSearch } from "@langchain/community/tools/brave_search";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";
import fetch from "node-fetch";

// Type definitions
interface Source {
  source: string;
  title: string;
  content: string;
  url?: string;
  type?: string;
}

interface Prompt {
  type: "prompt" | "email";
  text: string;
}

interface PromptResult {
  prompts: Prompt[];
}

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

// 2. Initialize admin Supabase client with service role key
const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string,
);

// Use OpenAI client for Groq
const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY as string,
  baseURL: "https://api.groq.com/openai/v1",
});

// 3. Send payload to Supabase table
async function sendPayload(content: any, user_id: string): Promise<void> {
  await adminSupabase
    .from("message_history")
    .insert([
      {
        payload: content,
        user_id: user_id,
      },
    ])
    .select("id");
}

// Function to check which model to use and make the appropriate API call
async function generateCompletion(
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
  modelName: string,
): Promise<any> {
  if (modelName === "llama3.3") {
    const response = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3.3-70b",
        messages: messages,
        stream: false,
      }),
    });

    const data = (await response.json()) as { message: { content: string } };
    return {
      choices: [
        {
          message: {
            content: data.message.content,
          },
        },
      ],
    };
  } else {
    return await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: messages,
    });
  }
}

// Add this new function near the other helper functions
async function generatePrompts(documents: any[]): Promise<PromptResult> {
  const modelName = process.env.MODEL_NAME as string;
  const messages: ChatMessage[] = [
    {
      role: "system",
      content:
        "You are a prompt generator. Keep the prompts super short and concise. Given document titles and content, generate 2 interesting questions and 1 email action. Make the prompts engaging and focused on extracting key insights from the documents. Return a JSON object with a 'prompts' array containing exactly 3 objects. Example format: { 'prompts': [{'type': 'prompt', 'text': 'What are the key findings...?'}, {'type': 'prompt', 'text': 'How does this compare...?'}, {'type': 'email', 'text': 'Draft an email to summarize...'}] }",
    },
    {
      role: "user",
      content: `Generate 3 prompts based on these documents: ${JSON.stringify(documents)}`,
    },
  ];

  if (modelName === "llama3.3") {
    const response = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3.3-70b",
        messages: messages,
        stream: false,
      }),
    });

    const data = (await response.json()) as { message: { content: string } };
    return JSON.parse(data.message.content);
  } else {
    const gptResponse = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: messages,
      response_format: { type: "json_object" },
    });
    return JSON.parse(gptResponse.choices[0]?.message?.content ?? "{}");
  }
}

export async function POST(req: Request): Promise<Response> {
  const startTime = performance.now();
  console.log("POST request started at:", new Date().toISOString());

  const body = await req.json();
  console.log(`[${performance.now() - startTime}ms] Request parsed`);

  if (body.type === "prompts") {
    try {
      const promptsStartTime = performance.now();
      const prompts = await generatePrompts(body.documents);
      console.log(
        `[${performance.now() - promptsStartTime}ms] Prompts generated`,
      );
      return Response.json({ apiPrompts: prompts });
    } catch (error) {
      console.error("Error generating prompts:", error);
      return Response.json(
        { error: "Failed to generate prompts" },
        { status: 500 },
      );
    }
  }

  const {
    message,
    context,
    user_id,
  }: { message: string; context: ChatMessage[]; user_id: string } = body;

  if (!user_id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const searchStartTime = performance.now();
    console.log("Starting search at:", new Date().toISOString());

    const response = await fetch("https://brain.amurex.ai/search_unified", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.BRAIN_API_KEY as string}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: user_id,
        query: [...context, { role: "user", content: message }],
        ai_enabled: false,
        limit: 3,
      }),
    });

    if (!response.ok) {
      throw new Error(`Search failed with status: ${response.status}`);
    }

    const data: { results?: Source[]; ai_response?: string } =
      (await response.json()) as { results?: Source[]; ai_response?: string };
    console.log(`[${performance.now() - searchStartTime}ms] Search completed`);

    const sources = data.results || [];
    console.log("sources", sources);

    const streamSetupStartTime = performance.now();
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();
    const encoder = new TextEncoder();
    console.log(
      `[${performance.now() - streamSetupStartTime}ms] Stream setup completed`,
    );

    (async () => {
      try {
        let fullResponse = "";

        const sourcesWriteStartTime = performance.now();
        const sourcesPayload = JSON.stringify({
          success: true,
          sources: sources,
          chunk: "",
        });
        await writer.write(encoder.encode(sourcesPayload + "\n"));
        console.log(
          `[${performance.now() - sourcesWriteStartTime}ms] Sources written to stream`,
        );

        const cleanedSources = sources.map((source) => {
          if (source.content) {
            return {
              source: source.source,
              title: source.title,
              content: source.content
                .replace(/[\r\n\x0B\x0C\u2028\u2029]{3,}/g, "\n\n")
                .replace(/[\r\n\x0B\x0C\u2028\u2029]{2}/g, "\n\n")
                .replace(/[\r\n\x0B\x0C\u2028\u2029]/g, "\n")
                .replace(/\s+\n/g, "\n")
                .replace(/\n\s+/g, "\n")
                .trim(),
              url: source.url,
              type: source.type,
            };
          }
          return {
            source: source.source,
            title: source.title,
            content: source.content,
            url: source.url,
            type: source.type,
          };
        });

        const aiResponse = data.ai_response;

        if (
          aiResponse &&
          typeof aiResponse === "string" &&
          aiResponse.trim().length > 0
        ) {
          console.log("Using AI response from API");
          fullResponse = aiResponse;

          const payload = JSON.stringify({
            success: true,
            chunk: aiResponse,
          });
          await writer.write(encoder.encode(payload + "\n"));
        } else {
          console.log("No AI response from API, using Groq");

          const groqStartTime = performance.now();
          const groqStream = await groq.chat.completions.create({
            messages: [
              {
                role: "system",
                content: `You are Amurex...`, // (truncated to save space, keep original content)
              },
              ...context,
              {
                role: "user",
                content: `Query: ${message}
                
                Retrieved documents: ${JSON.stringify(cleanedSources)}`,
              },
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.5,
            max_tokens: 1024,
            top_p: 1,
            stream: true,
          });
          console.log(
            `[${performance.now() - groqStartTime}ms] Groq stream created`,
          );

          const streamProcessStartTime = performance.now();
          let chunkCount = 0;
          for await (const chunk of groqStream) {
            chunkCount++;
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
              fullResponse += content;
              const payload = JSON.stringify({
                success: true,
                chunk: content,
              });
              await writer.write(encoder.encode(payload + "\n"));
            }
          }
          console.log(
            `[${performance.now() - streamProcessStartTime}ms] Stream processed (${chunkCount} chunks)`,
          );
        }

        const dbStartTime = performance.now();
        const { data: user, error } = await adminSupabase
          .from("users")
          .select("memory_enabled")
          .eq("id", user_id)
          .single();

        if (user?.memory_enabled) {
          const sessionInsertStartTime = performance.now();
          await adminSupabase.from("sessions").insert({
            user_id: user_id,
            query: message,
            response: fullResponse,
            sources: cleanedSources || sources,
          });
          console.log(
            `[${performance.now() - sessionInsertStartTime}ms] Session inserted into database`,
          );
        } else {
          console.log("Memory is not enabled for this user");
        }
        console.log(
          `[${performance.now() - dbStartTime}ms] Database operations completed`,
        );

        const finalWriteStartTime = performance.now();
        const finalPayload = JSON.stringify({
          success: true,
          done: true,
        });
        await writer.write(encoder.encode(finalPayload + "\n"));
        console.log(
          `[${performance.now() - finalWriteStartTime}ms] Final message written to stream`,
        );
      } catch (error) {
        console.error("Error in processing stream:", error);
        const errorPayload = JSON.stringify({
          success: false,
          error: (error as Error).message,
        });
        await writer.write(encoder.encode(errorPayload + "\n"));
      } finally {
        await writer.close();
        console.log(
          `[${performance.now() - startTime}ms] Total request processing time`,
        );
        console.log("POST request completed at:", new Date().toISOString());
      }
    })();

    return new Response(stream.readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error(`Error processing query:`, error);
    console.log(
      `[${performance.now() - startTime}ms] Request failed with error`,
    );
    return Response.json(
      {
        success: false,
        error: (error as Error).message,
      },
      { status: 500 },
    );
  }
}
