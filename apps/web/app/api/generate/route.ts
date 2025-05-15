import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import type { NextRequest } from "next/server";

// Define types for the request body and potential error response
interface GenerateRequest {
  prompt: string;
}

interface ErrorResponse {
  error: string;
}

// Create a typed OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export const runtime = "edge";

export async function POST(req: NextRequest): Promise<Response> {
  if (!process.env.OPENAI_API_KEY) {
    return new Response(
      "Missing OPENAI_API_KEY – make sure to add it to your .env file.",
      {
        status: 400,
        headers: { "Content-Type": "text/plain" },
      },
    );
  }

  try {
    // validate and extract prompt from request body
    const { prompt } = (await req.json()) as GenerateRequest;

    if (!prompt || typeof prompt !== "string") {
      return new Response(
        JSON.stringify({
          error: "Invalid request body",
        } satisfies ErrorResponse),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: [
            "You are an AI writing assistant that continues existing text based on context from prior text.",
            "Give more weight/priority to the later characters than the beginning ones.",
            "Limit your response to no more than 200 characters, but make sure to construct complete sentences.",
            "Do not generate empty responses.",
          ].join(" "),
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      stream: true,
      n: 1,
    });

    // handle stream with proper error checking
    const stream = OpenAIStream(response as any, {
      onCompletion: (completion: string) => {
        if (!completion.trim()) {
          throw new Error("Empty response generated");
        }
      },
    });

    return new StreamingTextResponse(stream);
  } catch (error) {
    // handle errors with proper type checking
    console.error("Error in generate API:", error);

    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";

    return new Response(
      JSON.stringify({ error: errorMessage } satisfies ErrorResponse),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
