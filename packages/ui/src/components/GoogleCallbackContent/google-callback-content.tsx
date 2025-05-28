"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { supabase } from "@amurex/ui/lib/supabaseClient";
import { GoogleCallbackLoader } from "./google-callback-loader";
import { getRedirectPath } from "./get-redirect-path";
import { ParseState } from "./parse-state";

// Main callback logic component
export const GoogleCallbackContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      console.log("callback page hit");
      const code = searchParams.get("code");
      const error = searchParams.get("error");
      const state = searchParams.get("state");

      const { source } = ParseState(state);

      if (code) {
        try {
          const {
            data: { session },
          } = await supabase.auth.getSession();

          if (!session) {
            throw new Error("No session found");
          }

          window.location.href = `/api/google/callback?code=${encodeURIComponent(code)}&state=${encodeURIComponent(state || "")}`;
          return;
        } catch (err) {
          const errorMessage =
            err instanceof Error
              ? err.message
              : "Failed to process Google connection";
          console.error("Error in Google callback:", errorMessage);
          toast.error(errorMessage);

          router.push(getRedirectPath(source, true, errorMessage));
        }
      } else if (error) {
        toast.error(`Connection failed: ${error}`);
        router.push(getRedirectPath(source, true, error));
      } else {
        router.push(getRedirectPath(source, false));
      }
    };

    handleCallback();
  }, [router, searchParams]);

  return <GoogleCallbackLoader />;
};
