// GoogleCalendarCallbackPage.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "~/lib/supabaseClient";
import { CallbackStatusView } from "@amurex/ui/components";

interface GoogleCallbackResponse {
  success: boolean;
  access_token?: string;
  refresh_token?: string;
  error?: string;
}

interface UpdateResponse {
  success: boolean;
  error?: string;
}

export default function GoogleCalendarCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleGoogleCalendarCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");
      const state = urlParams.get("state");
      const {
        data: { session },
      } = await supabase.auth.getSession();
      // Handle missing session
      if (!session) {
        console.error("No active session found");
        router.push("/login");
        return;
      }
      const userId = session!.user.id;

      if (!code) return;

      try {
        const response = await fetch(
          `/api/google/calendar/callback?code=${code}&state=${state}`,
        );
        const data: GoogleCallbackResponse = await response.json();

        if (!data.success) {
          console.error("Error connecting Google Calendar:", data.error);
          return;
        }

        const { access_token, refresh_token } = data;
        const updateResponse = await fetch("/api/google/calendar/callback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ access_token, refresh_token, state, userId }),
        });

        const updateData: UpdateResponse = await updateResponse.json();
        if (!updateData.success) {
          console.error("Error updating user:", updateData.error);
          return;
        }

        console.log("Google Calendar connected successfully");
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname,
        );
        router.push("/settings");
      } catch (error) {
        console.error("Error handling Google Calendar callback:", error);
      }
    };

    handleGoogleCalendarCallback();
  }, [router]);

  return <CallbackStatusView />;
}
