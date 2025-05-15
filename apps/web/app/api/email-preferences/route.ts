import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Environment variables validation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase environment variables not configured");
}

const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

interface EmailCategoryPreferences {
  to_respond: boolean;
  fyi: boolean;
  comment: boolean;
  notification: boolean;
  meeting_update: boolean;
  awaiting_reply: boolean;
  actioned: boolean;
}

interface EmailPreferences {
  categories: EmailCategoryPreferences;
  custom_properties: Record<string, boolean>;
}

interface PostRequestBody {
  userId: string;
  categories: EmailPreferences;
}

interface UserRow {
  email_categories: EmailPreferences | null;
}

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const { userId, categories } = (await req.json()) as PostRequestBody;

    if (!userId || !categories) {
      return NextResponse.json(
        { success: false, error: "User ID and categories are required" },
        { status: 400 },
      );
    }

    const { error } = await supabaseAdmin
      .from("users")
      .update({
        email_categories: categories,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (error) {
      console.error("Error updating email preferences:", error);
      return NextResponse.json(
        { success: false, error: "Failed to update email preferences" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Email preferences updated successfully",
    });
  } catch (error) {
    console.error("Error in email preferences update:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET(req: Request): Promise<NextResponse> {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 },
      );
    }

    const { data, error } = await supabaseAdmin
      .from("users")
      .select("email_categories")
      .eq("id", userId)
      .single<UserRow>();

    if (error) {
      console.error("Error fetching email preferences:", error);
      return NextResponse.json(
        { success: false, error: "Failed to fetch email preferences" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      categories: data?.email_categories || getDefaultCategories(),
    });
  } catch (error) {
    console.error("Error in email preferences fetch:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}

function getDefaultCategories(): EmailPreferences {
  return {
    categories: {
      to_respond: true,
      fyi: true,
      comment: true,
      notification: true,
      meeting_update: true,
      awaiting_reply: true,
      actioned: true,
    },
    custom_properties: {},
  };
}
