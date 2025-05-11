import { BASE_URL_BACKEND } from "@amurex/ui/components";
import { supabase } from "./supabaseClient";

export const logUserAction = async (
  userId: string,
  eventType: string,
): Promise<void> => {
  try {
    // First check if memory_enabled is true for this user
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("memory_enabled")
      .eq("id", userId)
      .single();

    if (userError) {
      console.error("Error fetching user data:", userError);
      return;
    }

    console.log("userData", userData);

    // Only track if memory_enabled is true
    if (userData?.memory_enabled) {
      await fetch(`${BASE_URL_BACKEND}/track`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          uuid: userId,
          event_type: eventType,
        }),
      });
    }
  } catch (error) {
    console.error("Error tracking:", error);
  }
};
