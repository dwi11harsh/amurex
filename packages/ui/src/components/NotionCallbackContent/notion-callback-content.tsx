// NotionCallbackContent.tsx
"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@amurex/ui/lib/supabaseClient";
import { NotionLoadingSpinner } from "./notion-loading-spinner";

interface NotionCallbackResponse {
  success: boolean;
  error?: string;
  access_token?: string;
  workspace_id?: string;
  bot_id?: string;
}

interface UpdateUserResponse {
  success: boolean;
  error?: string;
}

export const NotionCallbackContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleNotionCallback = async () => {
      const code = searchParams.get("code");
      const state = searchParams.get("state");

      if (!code) return;

      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) throw new Error("No active session");

        const userId = session.user.id;
        const response = await fetch(
          `/api/notion/callback?code=${code}&state=${state}`,
        );
        const data: NotionCallbackResponse = await response.json();

        if (!data.success) {
          router.push(
            `/settings?error=${encodeURIComponent(data.error || "Unknown error")}`,
          );
          return;
        }

        const { access_token, workspace_id, bot_id } = data;
        const updateResponse = await fetch("/api/notion/callback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            access_token,
            workspace_id,
            bot_id,
            state,
            userId,
          }),
        });

        const updateData: UpdateUserResponse = await updateResponse.json();
        if (!updateData.success) {
          router.push(
            `/settings?error=${encodeURIComponent(updateData.error || "Update failed")}`,
          );
          return;
        }

        window.history.replaceState(
          {},
          document.title,
          window.location.pathname,
        );
        const source = state || "settings";

        fetch("/api/notion/import", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-user-email": session.user.email || "", // Add fallback empty string
          },
          body: JSON.stringify({ session, runInBackground: true }),
        })
          .then((response) => response.json())
          .catch(console.error);

        router.push(
          source === "onboarding"
            ? "/onboarding?connection=success"
            : "/settings?connection=success",
        );
      } catch (error) {
        router.push("/settings?error=Failed to connect Notion");
      }
    };

    handleNotionCallback();
  }, [router, searchParams]);

  return <NotionLoadingSpinner text="Connecting Notion" />;
};
