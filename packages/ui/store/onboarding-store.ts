import toast from "react-hot-toast";
import { create } from "zustand";
import { supabase } from "@amurex/ui/lib/supabaseClient";
import { OnboardingState } from "@amurex/ui/types";

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  // Initial state
  currentStep: 1,
  totalSteps: 2,
  selectedTools: [],
  smartCategorizationEnabled: true,
  selectedCategories: ["important", "work", "personal"],
  isConnecting: false,
  isProcessingEmails: false,
  processingProgress: 0,
  processingStep: 0,
  emailStats: { processed: 0, stored: 0, total: 0 },
  showEmailStats: false,
  selectedFiles: [],
  isUploading: false,
  uploadProgress: 0,
  isNotionConnecting: false,
  isGoogleConnected: false,
  notionConnected: false,
  googleDocsConnected: false,
  activeSlide: 1,
  slideProgress: 0,
  authCompleted: false,
  gifKey: 0,

  // State setters
  setCurrentStep: (step) => set({ currentStep: step }),
  setSelectedTools: (tools) => set({ selectedTools: tools }),
  setSmartCategorizationEnabled: (enabled) =>
    set({ smartCategorizationEnabled: enabled }),
  setSelectedFiles: (files) => set({ selectedFiles: files }),
  setSlideProgress: (progress) => set({ slideProgress: progress }),
  setActiveSlide: (slide) => set({ activeSlide: slide }),
  setIsGoogleConnected: (connected) => set({ isGoogleConnected: connected }),

  // Tool and category handlers
  toggleTool: (tool) => {
    if (tool === "meetings") {
      window.open(
        "https://chromewebstore.google.com/detail/amurex-early-preview/dckidmhhpnfhachdpobgfbjnhfnmddmc",
        "_blank",
      );
      return;
    }

    const { selectedTools } = get();
    set({
      selectedTools: selectedTools.includes(tool)
        ? selectedTools.filter((t) => t !== tool)
        : [...selectedTools, tool],
    });
  },

  toggleCategory: (category) => {
    const { selectedCategories } = get();
    set({
      selectedCategories: selectedCategories.includes(category)
        ? selectedCategories.filter((c) => c !== category)
        : [...selectedCategories, category],
    });
  },

  // Connection handlers
  handleConnectGmail: async (router) => {
    set({ isConnecting: true });
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        const response = await fetch("/api/google/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: session.user.id,
            source: "onboarding",
          }),
        });

        const data = await response.json();
        if (data.url) {
          localStorage.setItem("pendingGmailConnect", "true");
          router.push(data.url);
        } else {
          console.error("Error starting Gmail OAuth flow:", data.error);
          toast.error("Failed to connect Gmail. Please try again.");
        }
      } else {
        toast.error("You must be logged in to connect Gmail");
      }
    } catch (error) {
      console.error("Error connecting to Google:", error);
      toast.error("Failed to connect to Google");
    } finally {
      set({ isConnecting: false });
    }
  },

  handleConnectGoogleDocs: async (router) => {
    set({ isProcessingEmails: true });
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        const response = await fetch("/api/google/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: session.user.id,
            source: "onboarding",
          }),
        });

        const data = await response.json();
        if (data.url) {
          localStorage.setItem("pendingGoogleDocsImport", "true");
          router.push(data.url);
        } else {
          console.error("Error starting Google OAuth flow:", data.error);
          toast.error("Failed to connect Google Docs. Please try again.");
        }
      } else {
        toast.error("You must be logged in to connect Google Docs");
      }
    } catch (error) {
      console.error("Error connecting Google Docs:", error);
      toast.error("Failed to connect Google Docs. Please try again.");
    } finally {
      set({ isProcessingEmails: false });
    }
  },

  handleConnectNotion: async () => {
    set({ isNotionConnecting: true });
    try {
      const response = await fetch("/api/notion/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: "onboarding" }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "Failed to get Notion authorization URL");
      }
    } catch (error) {
      console.error("Error connecting to Notion:", error);
      toast.error("Failed to connect to Notion");
      set({ isNotionConnecting: false });
    }
  },

  // File handlers
  handleFileSelect: (e) => {
    const inputFiles = (e.target as HTMLInputElement)?.files;
    const dragFiles = (e as unknown as React.DragEvent<HTMLDivElement>)
      .dataTransfer?.files;
    const files = Array.from(inputFiles || dragFiles || []).filter(
      (file): file is File => file instanceof File && file.name.endsWith(".md"),
    );
    set({ selectedFiles: files });
  },

  handleDragOver: (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add("border-[#9334E9]");
  },

  handleDragLeave: (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove("border-[#9334E9]");
  },

  handleDrop: (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove("border-[#9334E9]");
    get().handleFileSelect(e);
  },

  handleObsidianUpload: async () => {
    const { selectedFiles, isGoogleConnected } = get();
    if (selectedFiles.length === 0) {
      toast.error("Please select at least one Markdown file");
      return;
    }

    set({ isUploading: true, uploadProgress: 0 });

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) throw new Error("No session found");

      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i] as File;
        const content = await file.text();

        const response = await fetch("/api/obsidian/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: file.name,
            content: content,
            userId: session.user.id,
          }),
        });

        if (!response.ok) throw new Error("Upload failed");
        set({ uploadProgress: ((i + 1) / selectedFiles.length) * 100 });
      }

      toast.success("Markdown files uploaded successfully!");
      set({ selectedFiles: [], currentStep: isGoogleConnected ? 3 : 2 });
    } catch (error) {
      console.error("Error uploading files:", error);
      toast.error("Failed to upload files");
    } finally {
      set({ isUploading: false, uploadProgress: 0 });
    }
  },

  // Processing functions
  triggerFakeAnimation: () => {
    set({ isProcessingEmails: true, processingStep: 1 });

    setTimeout(() => {
      set({ processingStep: 2 });

      let progress = 0;
      const progressInterval = setInterval(() => {
        progress += 2;
        set({ processingProgress: progress });

        if (progress >= 100) {
          clearInterval(progressInterval);
          set({ processingStep: 3, authCompleted: true });
        }
      }, 100);
    }, 1500);
  },

  startCompleteImportProcess: (router) => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const scope = params.get("scope");

    if (code && scope) {
      set({ isProcessingEmails: true });

      let progress = 0;
      const progressInterval = setInterval(() => {
        progress += 5;
        set({
          processingProgress: progress,
          emailStats: {
            processed: Math.floor((progress / 100) * 1250),
            stored: Math.floor((progress / 100) * 850),
            total: 1250,
          },
        });

        if (progress >= 100) {
          clearInterval(progressInterval);
          set({
            showEmailStats: true,
            authCompleted: true,
            isProcessingEmails: false,
          });
        }
      }, 250);
    }
  },

  enableEmailTagging: async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) throw new Error("No session found");

      const { error } = await supabase
        .from("users")
        .update({ email_tagging_enabled: true })
        .eq("id", session.user.id);

      if (error) {
        console.error("Error enabling email tagging:", error);
      } else {
        console.log("Email tagging enabled successfully");
      }
    } catch (error) {
      console.error("Error enabling email tagging:", error);
    }
  },

  // Navigation
  handleContinue: (router) => {
    const { currentStep, selectedTools, selectedFiles } = get();

    if (currentStep === 2) {
      if (selectedTools.includes("notion")) {
        get().handleConnectNotion();
      } else if (
        selectedTools.includes("obsidian") &&
        selectedFiles.length > 0
      ) {
        get().handleObsidianUpload();
      } else {
        router.push("/search");
      }
    } else {
      set({ currentStep: currentStep + 1 });
    }
  },

  handleCompleteSetup: (router) => {
    const { selectedTools, smartCategorizationEnabled } = get();

    if (selectedTools.includes("google-docs")) {
      get().handleConnectGoogleDocs(router);
    } else if (smartCategorizationEnabled) {
      get().startCompleteImportProcess(router);
    } else {
      router.push("/search");
    }
  },

  handleSkip: (router) => {
    router.push("/search");
  },

  // Connection checks
  checkGoogleConnection: async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      const { data: userData, error } = await supabase
        .from("users")
        .select("google_connected")
        .eq("id", session.user.id)
        .single();

      if (error) throw error;
      if (userData?.google_connected) set({ isGoogleConnected: true });
    } catch (error) {
      console.error("Error checking Google connection:", error);
    }
  },

  checkNotionConnection: async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      const { data: userData, error } = await supabase
        .from("users")
        .select("notion_connected")
        .eq("id", session.user.id)
        .single();

      if (error) throw error;
      if (userData?.notion_connected) {
        set({ notionConnected: true });
        get().setSelectedTools([...get().selectedTools, "notion"]);
      }
    } catch (error) {
      console.error("Error checking Notion connection:", error);
    }
  },

  checkGoogleDocsConnection: async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      const { data: userData, error } = await supabase
        .from("users")
        .select("google_docs_connected")
        .eq("id", session.user.id)
        .single();

      if (error) throw error;
      if (userData?.google_docs_connected) {
        set({ googleDocsConnected: true });
        get().setSelectedTools([...get().selectedTools, "google-docs"]);
      }
    } catch (error) {
      console.error("Error checking Google Docs connection:", error);
    }
  },
}));
