import { google } from "googleapis";
import { GoogleClient, OAuthClientResult } from "../types";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase: SupabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

// Function to get OAuth client based on user's google_token_version
export const getOAuth2Client = async (
  userId?: string,
  { upgradeToFull = false }: { upgradeToFull?: boolean } = {},
): Promise<OAuthClientResult> => {
  try {
    // If no userId provided, get a default gmail_only client for new signups
    if (!userId) {
      const { data: defaultClient, error: defaultError } = await supabase
        .from("google_clients")
        .select("id, client_id, client_secret, type")
        .eq("type", "gmail_only")
        .limit(1)
        .single();

      if (defaultError) throw defaultError;
      if (!defaultClient) throw new Error("No default client found");

      return {
        oauth2Client: new google.auth.OAuth2(
          defaultClient.client_id,
          defaultClient.client_secret,
          process.env.GOOGLE_REDIRECT_URI_NEW,
        ),
        clientInfo: defaultClient,
      };
    }

    // Query Supabase for user's google_token_version
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("google_token_version")
      .eq("id", userId)
      .single();

    if (userError) throw userError;

    let clientData: GoogleClient | null;
    let clientError: Error | null = null;

    // For fresh users (no google_token_version yet), assign a default gmail_only client
    if (!userData?.google_token_version) {
      const result = await supabase
        .from("google_clients")
        .select("id, client_id, client_secret, type")
        .eq("type", "gmail_only")
        .lt("users_count", 100) // Try to find one with fewer users
        .order("users_count", { ascending: true })
        .limit(1)
        .single();

      clientData = result.data;
      clientError = result.error;
    }
    // If user's token version is 'old', fetch client with id = 2 (old client)
    else if (userData.google_token_version === "old") {
      const result = await supabase
        .from("google_clients")
        .select("id, client_id, client_secret, type")
        .eq("type", "gmail_only")
        .lt("users_count", 100) // Find clients with fewer than 100 users
        .order("users_count", { ascending: true }) // Get the one with fewest users
        .limit(1)
        .single();

      clientData = result.data;
      clientError = result.error;
    }
    // If user's token version is 'gmail_only' and they're trying to upgrade to 'full'
    else if (userData.google_token_version === "gmail_only" && upgradeToFull) {
      // Find the oldest full client with user_count < 100 for upgrade
      const result = await supabase
        .from("google_clients")
        .select("id, client_id, client_secret, type")
        .eq("type", "full")
        .lt("users_count", 100)
        .order("created_at", { ascending: true })
        .limit(1)
        .single();

      clientData = result.data;
      clientError = result.error;
    }
    // If user already has 'full' access, keep using their assigned client
    else if (userData.google_token_version === "full") {
      // Get the user's assigned google_cohort
      const { data: userCohort, error: cohortError } = await supabase
        .from("users")
        .select("google_cohort")
        .eq("id", userId)
        .single();

      if (cohortError) throw cohortError;
      if (!userCohort?.google_cohort) throw new Error("User cohort not found"); // TODO?: added this check to make sure the user has a cohort

      // Get the client associated with their cohort
      const result = await supabase
        .from("google_clients")
        .select("id, client_id, client_secret, type")
        .eq("id", userCohort.google_cohort)
        .single();

      clientData = result.data;
      clientError = result.error;
    }
    // Otherwise use a gmail_only client for regular users
    else {
      const result = await supabase
        .from("google_clients")
        .select("id, client_id, client_secret, type")
        .eq("type", "gmail_only")
        .lt("users_count", 100) // Find clients with fewer than 100 users
        .order("users_count", { ascending: true }) // Get the one with fewest users
        .limit(1)
        .single();

      clientData = result.data;
      clientError = result.error;
    }

    if (clientError) throw clientError;
    if (!clientData) throw new Error("No client data available");

    return {
      oauth2Client: new google.auth.OAuth2(
        clientData.client_id,
        clientData.client_secret,
        process.env.GOOGLE_REDIRECT_URI_NEW,
      ),
      clientInfo: clientData,
    };
  } catch (error) {
    console.error("Error fetching Google client credentials:", error);

    // As a last resort, try to get any available client
    try {
      const { data: anyClient, error: anyError } = await supabase
        .from("google_clients")
        .select("id, client_id, client_secret, type")
        .limit(1)
        .single();

      if (anyError) throw anyError;
      if (!anyClient) throw new Error("No fallback client found");

      return {
        oauth2Client: new google.auth.OAuth2(
          anyClient.client_id,
          anyClient.client_secret,
          process.env.GOOGLE_REDIRECT_URI_NEW,
        ),
        clientInfo: anyClient,
      };
    } catch (fallbackError) {
      console.error("Failed to get any Google client:", fallbackError);
      throw new Error("Unable to initialize Google OAuth client");
    }
  }
};
