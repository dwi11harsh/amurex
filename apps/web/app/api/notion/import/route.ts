import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";

// Initialize Groq client using OpenAI SDK
const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

// Create admin Supabase client with service role key
const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

export const maxDuration = 300;
