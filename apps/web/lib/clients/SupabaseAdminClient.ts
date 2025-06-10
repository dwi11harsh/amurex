import { createClient, SupabaseClient } from "@amurex/supabase";

export const supabaseAdminClient: SupabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);
