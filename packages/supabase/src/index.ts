import { Session, SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@supabase/supabase-js";

export * from "./SupabaseClient";

export type { Session, SupabaseClient };
export { createClient };
