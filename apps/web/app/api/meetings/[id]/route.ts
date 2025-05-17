import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

interface LateMeeting {
  id: string;
  meeting_id: string;
  meeting_title: string;
  created_at: string;
  summary: string;
  transcript: string;
  action_items: any[]; // TODO: replace 'any' with proper type if action items structure is known
}

// Initialize Supabase client with environment variables
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // Use service role key for server operations
);

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  try {
    const { id } = params;

    const { data, error } = await supabase
      .from("late_meeting")
      .select(
        `
        id,
        meeting_id,
        meeting_title,
        created_at,
        summary,
        transcript,
        action_items
      `,
      )
      .eq("id", id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data!);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
