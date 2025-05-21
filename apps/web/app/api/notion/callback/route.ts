import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

interface NotionOAuthSuccess {
  access_token: string;
  workspace_id: string;
  bot_id: string;
  owner?: {
    user: {
      id: string;
    };
  };
}

interface NotionOAuthError {
  error: string;
  error_description?: string;
}

type NotionOAuthResponse = NotionOAuthSuccess | NotionOAuthError;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  if (!code) {
    return NextResponse.json(
      { success: false, error: "No code provided" },
      { status: 400 },
    );
  }

  try {
    const response = await fetch("https://api.notion.com/v1/oauth/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${process.env.NOTION_CLIENT_ID!}:${process.env.NOTION_CLIENT_SECRET!}`,
        ).toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: process.env.NOTION_REDIRECT_URI!,
      }),
    });

    const data = (await response.json()) as NotionOAuthResponse;

    if ("error" in data) {
      console.error("Notion API error:", data);
      return NextResponse.json(
        {
          success: false,
          error: data.error_description || data.error,
        },
        { status: 400 },
      );
    }

    if (data.access_token) {
      return NextResponse.json({
        success: true,
        access_token: data.access_token,
        workspace_id: data.workspace_id,
        bot_id: data.bot_id,
        state: state,
      });
    }

    return NextResponse.json(
      { success: false, error: "Failed to connect to Notion" },
      { status: 400 },
    );
  } catch (error: unknown) {
    console.error("Error in Notion callback:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 },
    );
  }
}
