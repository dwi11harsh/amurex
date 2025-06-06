import { create } from "zustand";
import { supabase } from "@amurex/ui/components";
import type {
  SharedTranscript,
  SharedTranscriptApiResponse,
} from "@amurex/ui/types";

interface SharedTranscriptStore {
  isLoggedIn: boolean;
  transcript: SharedTranscript | null;
  error: string | null;
  loading: boolean;
  setIsLoggedIn: (status: boolean) => void;
  setTranscript: (transcript: SharedTranscript | null) => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  checkLoginStatus: () => Promise<void>;
  fetchTranscript: (id: string) => Promise<void>;
  handleDownload: () => Promise<void>;
  getProcessedFileName: () => string;
  handleTryClick: () => void;
  handleSignInClick: () => void;
}

export const useSharedTranscriptStore = create<SharedTranscriptStore>(
  (set, get) => ({
    isLoggedIn: false,
    transcript: null,
    error: null,
    loading: true,

    setIsLoggedIn: (status: boolean) => set({ isLoggedIn: status }),
    setTranscript: (transcript: SharedTranscript | null) => set({ transcript }),
    setError: (error: string | null) => set({ error }),
    setLoading: (loading: boolean) => set({ loading }),

    getProcessedFileName: () => {
      const { transcript } = get();
      if (!transcript) return "transcript";

      // Preprocess the meeting title for the file name
      return transcript.title
        .toLowerCase()
        .replace(/\s+/g, "_") // Replace spaces with underscores
        .replace(/[^\w_]/g, ""); // Remove special characters
    },

    checkLoginStatus: async () => {
      try {
        // Check if the user is logged in
        const {
          data: { session },
        } = await supabase.auth.getSession();
        set({ isLoggedIn: !!session });
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : "Login check failed",
        });
      }
    },

    fetchTranscript: async (id: string) => {
      try {
        const response = await fetch(`/api/meetings/${id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch meeting");
        }

        const data: SharedTranscriptApiResponse = await response.json();

        set({
          transcript: {
            id: data.id,
            meeting_id: data.meeting_id,
            title: data.meeting_title || "Untitled Meeting",
            date: new Date(data.created_at).toLocaleDateString(),
            time: new Date(data.created_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            summary: data.summary,
            content: data.transcript || "",
            actionItems: data.action_items || "",
          },
        });
      } catch (err) {
        console.error("Error fetching meeting:", err);
        set({
          error: err instanceof Error ? err.message : "Failed to fetch meeting",
        });
      } finally {
        set({ loading: false });
      }
    },

    handleDownload: async () => {
      const { transcript, getProcessedFileName } = get();
      if (transcript && transcript.content) {
        try {
          const response = await fetch(transcript.content);
          if (!response.ok) throw new Error("Network response was not ok");

          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);

          const fileName = getProcessedFileName();

          const link = document.createElement("a");
          link.href = url;
          link.download = `${fileName}.txt`; // Use the processed title as the file name
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        } catch (error) {
          console.error("Error downloading the file:", error);
        }
      }
    },

    handleTryClick: () => {
      // track("download_button_clicked");
      // Create link to download zip
      const link = document.createElement("a");
      link.target = "_blank";
      link.href =
        "https://chromewebstore.google.com/detail/amurex/dckidmhhpnfhachdpobgfbjnhfnmddmc"; // Place your zip file in the public/downloads folder
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },

    handleSignInClick: () => {
      const { isLoggedIn } = get();
      const link = document.createElement("a");
      link.target = "_blank";
      link.href = isLoggedIn ? "/search" : "/web_app/signin";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
  }),
);
