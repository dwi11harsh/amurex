import { Client } from "@notionhq/client";
import { google } from "googleapis";
import OpenAI from "openai";

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const auth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  scopes: ["https://www.googleapis.com/auth/documents.readonly"],
});
