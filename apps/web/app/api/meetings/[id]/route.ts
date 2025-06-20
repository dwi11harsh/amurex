import { supabaseAdminClient as supabase } from "@amurex/web/lib";
import { NextResponse } from "next/server";

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
