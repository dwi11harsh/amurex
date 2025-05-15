import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Supabase environment variables are not configured properly");
}

// Create a Supabase client with the service role key
const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

interface GoogleClientCredentials {
  client_id: string;
  client_secret: string;
}

interface UserTokenVersion {
  google_token_version?: string;
}

/**
 * Get the appropriate Google client credentials based on user's token version
 * @param userId - The user's ID (optional)
 * @returns Google client credentials
 */
export async function getGoogleClientCredentials(
  userId?: string,
): Promise<{ clientId: string; clientSecret: string }> {
  try {
    let clientId = 2;

    if (userId) {
      try {
        const { data: userData, error: userError } = await supabaseAdmin
          .from("users")
          .select("google_token_version")
          .eq("id", userId)
          .single<UserTokenVersion>();

        if (!userError && userData?.google_token_version === "gmail_only") {
          clientId = 3;
        }
      } catch (userFetchError) {
        console.error("Error in user data fetch:", userFetchError);
      }
    }

    const { data: clientData, error: clientError } = await supabaseAdmin
      .from("google_clients")
      .select("client_id, client_secret")
      .eq("id", clientId)
      .single<GoogleClientCredentials>();

    if (clientError || !clientData) {
      console.error("Error fetching Google client data:", clientError);
      throw new Error("Failed to fetch Google client credentials");
    }

    return {
      clientId: clientData.client_id,
      clientSecret: clientData.client_secret,
    };
  } catch (error) {
    console.error("Error in getGoogleClientCredentials:", error);
    throw error;
  }
}
