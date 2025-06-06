"use client";

import { useEffect } from "react";
import { useSharedTranscriptStore } from "@amurex/ui/store";

interface ClientInitializerProps {
  transcriptId: string;
}

export const ClientInitializer = ({ transcriptId }: ClientInitializerProps) => {
  const { checkLoginStatus, fetchTranscript } = useSharedTranscriptStore();

  useEffect(() => {
    // Check if the user is logged in
    checkLoginStatus();
  }, [checkLoginStatus]);

  useEffect(() => {
    fetchTranscript(transcriptId);
  }, [transcriptId, fetchTranscript]);

  return null;
};
