import { createClient, SupabaseClient } from "@supabase/supabase-js";
import OpenAI from "openai";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_SUPABASE_URL: string;
      SUPABASE_SERVICE_ROLE_KEY: string;
      GROQ_API_KEY: string;
      MISTRAL_API_KEY: string;
    }
  }
}

// Create admin Supabase client globally
export const adminSupabase: SupabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

// Initialize Groq Client using OpenAI SDK
export const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY!,
  baseURL: "https://api.groq.com/openai/v1",
});

// Initialize Mistral Client using OpenAI SDK
export const mistral = new OpenAI({
  apiKey: process.env.MISTRAL_API_KEY!,
  baseURL: "https://api.mistral.ai/v1",
});
