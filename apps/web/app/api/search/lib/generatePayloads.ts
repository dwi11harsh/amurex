import { supabaseAdminClient as adminSupabase } from "@amurex/web/lib";

// 3. Send payload to Supabase table
export const sendPayload = async (
  content: any,
  user_id: string,
): Promise<void> => {
  await adminSupabase
    .from("message_history")
    .insert([
      {
        payload: content,
        user_id: user_id,
      },
    ])
    .select("id");
};
