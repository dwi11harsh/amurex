import {
  createClient,
  SupabaseClient,
  PostgrestError,
} from "@supabase/supabase-js";
import { google, Auth } from "googleapis";

interface UserData {
  google_cohort: number;
}

interface GoogleClientData {
  client_id: string;
  client_secret: string;
}

export const getOAuth2Client = async (
  userId: string,
): Promise<Auth.OAuth2Client> => {
  // Create admin Supabase client with non-null assertions for environment variables
  const adminSupabase: SupabaseClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  try {
    console.log("Getting OAuth credentials for user:", userId);

    // Fetch user's google_cohort
    const {
      data: userData,
      error: userError,
    }: { data: UserData | null; error: PostgrestError | null } =
      await adminSupabase
        .from("users")
        .select("google_cohort")
        .eq("id", userId)
        .single();

    if (userError) throw userError;
    if (!userData) throw new Error("User not found");

    console.log("User cohort:", userData.google_cohort);

    // Fetch client credentials
    const {
      data: clientData,
      error: clientError,
    }: { data: GoogleClientData | null; error: PostgrestError | null } =
      await adminSupabase
        .from("google_clients")
        .select("client_id, client_secret")
        .eq("id", userData.google_cohort)
        .single();

    if (clientError) throw clientError;
    if (!clientData) throw new Error("Client credentials not found");

    // Create OAuth2 client with validated credentials
    return new google.auth.OAuth2(
      clientData.client_id,
      clientData.client_secret,
      process.env.GOOGLE_REDIRECT_URI!,
    );
  } catch (error: unknown) {
    console.error("Error getting OAuth credentials:", error);

    // Fallback with proper environment variable validation
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      throw new Error("Missing fallback Google OAuth credentials");
    }

    return new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI!,
    );
  }
};
