import { create } from "zustand";
import { supabase } from "@amurex/ui/components";
import { BASE_URL_BACKEND } from "@amurex/ui/components";
import { TranscriptStore } from "types";

export const useTranscriptStore = create<TranscriptStore>((set, get) => ({
  session: null,
  memoryEnabled: false,
  loading: true,
  transcript: null,
  fullTranscriptText: "",
  error: null,
  isModalOpen: false,
  isPreviewModalOpen: false,
  isChatOpen: false,
  chatMessages: [] as Array<{ role: string; content: string }>,
  chatInput: "",
  isSending: false,
  copyButtonText: "Copy share link",
  copyActionItemsText: "Copy",
  copyMeetingSummaryText: "Copy",
  emails: [],
  emailInput: "",
  isMobile: false,
  sharedWith: [],
  previewContent: "",
  isLoadingPreview: false,
  params: null,

  init: (params) => {
    set({ params });
    get().fetchSession();
    get().fetchMemoryStatus();
    get().fetchTranscript();

    // Check if the device is mobile
    const checkMobile = () => {
      set({ isMobile: window.innerWidth <= 768 });
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  },

  setSession: (session) => set({ session }),
  setMemoryEnabled: (value) => set({ memoryEnabled: value }),
  setLoading: (value) => set({ loading: value }),
  setTranscript: (transcript) => set({ transcript }),
  setFullTranscriptText: (text) => set({ fullTranscriptText: text }),
  setError: (error) => set({ error }),
  setIsModalOpen: (value) => set({ isModalOpen: value }),
  setIsPreviewModalOpen: (value) => set({ isPreviewModalOpen: value }),
  setIsChatOpen: (value) => set({ isChatOpen: value }),
  setChatMessages: (messages: Array<{ role: string; content: string }>) =>
    set({ chatMessages: messages }),
  setChatInput: (input) => set({ chatInput: input }),
  setIsSending: (value) => set({ isSending: value }),
  setCopyButtonText: (text) => set({ copyButtonText: text }),
  setCopyActionItemsText: (text) => set({ copyActionItemsText: text }),
  setCopyMeetingSummaryText: (text) => set({ copyMeetingSummaryText: text }),
  setEmails: (emails) => set({ emails }),
  setEmailInput: (input) => set({ emailInput: input }),
  setIsMobile: (value) => set({ isMobile: value }),
  setSharedWith: (emails) => set({ sharedWith: emails }),
  setPreviewContent: (content) => set({ previewContent: content }),
  setIsLoadingPreview: (value) => set({ isLoadingPreview: value }),

  fetchSession: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      window.location.href = "/web_app/signin";
      return;
    }
    set({ session });
  },

  logUserAction: async (userId, eventType) => {
    const { params } = get();
    fetch(`${BASE_URL_BACKEND}/track`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        uuid: userId,
        event_type: eventType,
        meeting_id: params?.id,
      }),
    }).catch((error) => {
      console.error("Error tracking:", error);
    });
  },

  fetchTranscript: async () => {
    try {
      const { session, params } = get();
      if (!session) {
        window.location.href = "/web_app/signin";
        return;
      }

      const { data, error } = await supabase
        .from("late_meeting")
        .select(
          `
          id,
          meeting_id,
          user_ids,
          created_at,
          meeting_title,
          summary,
          transcript,
          action_items,
          shared_with
        `,
        )
        .eq("id", params?.id)
        .contains("user_ids", [session.user.id])
        .single();

      if (error) throw error;

      const transcriptData = {
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
      };

      set({ transcript: transcriptData });

      // Fetch full transcript text
      if (data.transcript) {
        const transcriptResponse = await fetch(data.transcript);
        const transcriptText = await transcriptResponse.text();
        set({ fullTranscriptText: transcriptText });
      }

      set({ sharedWith: data.shared_with || [] });
    } catch (err: any) {
      console.error("Error fetching transcript:", err);
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  fetchMemoryStatus: async () => {
    try {
      const { session } = get();
      if (!session) {
        window.location.href = "/web_app/signin";
        return;
      }

      const { data, error } = await supabase
        .from("users")
        .select("memory_enabled")
        .eq("id", session.user.id)
        .single();

      if (error) throw error;
      set({ memoryEnabled: data?.memory_enabled || false });
    } catch (error) {
      console.error("Error fetching memory status:", error);
    } finally {
      set({ loading: false });
    }
  },

  toggleModal: () => set((state) => ({ isModalOpen: !state.isModalOpen })),

  handleEmailInputKeyDown: (e) => {
    if (e.key === "Enter" && get().emailInput.trim()) {
      if (get().validateEmail(get().emailInput.trim())) {
        get().addEmail();
      }
    }
  },

  validateEmail: (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  },

  addEmail: () => {
    const { emailInput, emails } = get();
    if (emailInput.trim()) {
      set({ emails: [...emails, emailInput.trim()], emailInput: "" });
    }
  },

  removeEmail: (index) => {
    set({ emails: get().emails.filter((_, i) => i !== index) });
  },

  sendEmails: async () => {
    const { params, emails, session, fetchTranscript } = get();
    const shareUrl = `${window.location.host}/shared/${params?.id}`;
    let owner_email = "";

    try {
      if (!session) {
        window.location.href = "/web_app/signin";
        return;
      }

      // Fetch the owner's email
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("email")
        .eq("id", session.user.id)
        .single();

      if (userError) throw userError;
      owner_email = userData.email;

      // Send each email to the external API
      for (const email of emails) {
        const response = await fetch(`${BASE_URL_BACKEND}/send_user_email`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "meeting_share",
            owner_email: owner_email,
            email: email,
            share_url: shareUrl,
            meeting_id: params?.id,
          }),
        });

        await get().logUserAction(session.user.id, "web_share_notes_via_email");

        if (!response.ok) {
          throw new Error(`Failed to send email to ${email}`);
        }
      }

      // Refresh the sharedWith list
      await fetchTranscript();

      // Clear the new emails list
      set({ emails: [] });
    } catch (error) {
      console.error("Error sending emails:", error);
    }
  },

  handleCopyLink: async () => {
    try {
      const { session, params } = get();
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("email")
        .eq("id", session?.user.id)
        .single();

      if (userError) throw userError;

      const baseLink = `${window.location.host.includes("localhost") ? "http://" : "https://"}${window.location.host}/shared/${params?.id}`;
      const shareText = baseLink;

      navigator.clipboard
        .writeText(shareText)
        .then(async () => {
          set({ copyButtonText: "Copied!" });
          setTimeout(() => set({ copyButtonText: "Copy share link" }), 3000);
          await get().logUserAction(session?.user.id, "web_share_url_copied");
        })
        .catch((err) => {
          console.error("Failed to copy the URL: ", err);
        });
    } catch (error) {
      console.error("Error getting user email:", error);
    }
  },

  handleDownload: async () => {
    const {
      transcript,
      setPreviewContent,
      setIsLoadingPreview,
      setIsPreviewModalOpen,
    } = get();
    if (transcript?.content) {
      try {
        setIsLoadingPreview(true);
        setIsPreviewModalOpen(true);

        const response = await fetch(transcript.content);
        if (!response.ok) throw new Error("Network response was not ok");

        const text = await response.text();
        setPreviewContent(text);
        setIsLoadingPreview(false);
      } catch (error) {
        console.error("Error loading preview:", error);
        setIsLoadingPreview(false);
      }
    }
  },

  handleActualDownload: async () => {
    const { transcript, session } = get();
    if (transcript?.content) {
      try {
        const response = await fetch(transcript.content);
        if (!response.ok) throw new Error("Network response was not ok");

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        // Preprocess the meeting title for the file name
        const fileName = transcript.title
          .toLowerCase()
          .replace(/\s+/g, "_")
          .replace(/[^\w_]/g, "");

        const link = document.createElement("a");
        link.href = url;
        link.download = `${fileName}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        await get().logUserAction(session?.user.id, "web_download_transcript");
        get().setIsPreviewModalOpen(false);
      } catch (error) {
        console.error("Error downloading the file:", error);
      }
    }
  },

  handleActionItemClick: async () => {
    const { session } = get();
    await get().logUserAction(session?.user.id, "web_action_items_clicked");
  },

  handleSummaryClick: async () => {
    const { session } = get();
    await get().logUserAction(session?.user.id, "web_summary_clicked");
  },

  handleChatSubmit: async (e) => {
    e.preventDefault();
    const {
      chatInput,
      isSending,
      chatMessages,
      transcript,
      fullTranscriptText,
      setChatMessages,
      setChatInput,
      setIsSending,
    } = get();

    if (!chatInput.trim() || isSending) return;

    const newMessage = {
      role: "user",
      content: chatInput.trim(),
    };

    setChatMessages([...chatMessages, newMessage]);
    setChatInput("");
    setIsSending(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...chatMessages, newMessage],
          transcript: {
            summary: transcript?.summary,
            actionItems: transcript?.actionItems,
            fullTranscript: fullTranscriptText,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      // Create a temporary message for streaming
      const tempMessage = {
        role: "assistant",
        content: "",
      };
      setChatMessages([...chatMessages, tempMessage]);

      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let accumulatedContent = "";

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        accumulatedContent += chunk;

        // Update the last message with accumulated content
        setChatMessages([
          ...chatMessages,
          {
            role: "assistant",
            content: accumulatedContent,
          },
        ]);
      }
    } catch (error) {
      console.error("Error in chat:", error);
      const errorMessage = {
        role: "assistant",
        content:
          "Sorry, I encountered an error while processing your request. Please try again.",
      };
      setChatMessages([...chatMessages, errorMessage]);
    } finally {
      setIsSending(false);
    }
  },
}));
