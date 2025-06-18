// Add Chrome extension API type declaration
declare global {
  interface Window {
    chrome?: {
      runtime?: {
        id?: string;
      };
    };
  }
}

import { create } from "zustand";
import { SettingsStoreType } from "./types";
import toast from "react-hot-toast";
import { supabase } from "@amurex/supabase";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import { BASE_URL_BACKEND } from "@amurex/ui/lib";

const useSettingsStore = create<SettingsStoreType>((set, get) => ({
  // State and Setters
  activeTab: "general",
  setActiveTab: (tab) => set({ activeTab: tab }),

  loading: false,
  setLoading: (loading) => set({ loading }),

  userEmail: "",
  setUserEmail: (email) => set({ userEmail: email }),

  userId: null,
  setUserId: (id) => set({ userId: id }),

  notionConnected: false,
  setNotionConnected: (connected) => set({ notionConnected: connected }),

  omiConnected: false,
  setOmiConnected: (connected) => set({ omiConnected: connected }),

  googleDocsConnected: false,
  setGoogleDocsConnected: (connected) =>
    set({ googleDocsConnected: connected }),

  calendarConnected: false,
  setCalendarConnected: (connected) => set({ calendarConnected: connected }),

  notionDocuments: [],
  setNotionDocuments: (documents) => set({ notionDocuments: documents }),

  isImporting: false,
  setIsImporting: (importing) => set({ isImporting: importing }),

  importSource: "",
  setImportSource: (source) => set({ importSource: source }),

  importProgress: 0,
  setImportProgress: (progress) => set({ importProgress: progress }),

  memoryEnabled: false,
  setMemoryEnabled: (enabled) => set({ memoryEnabled: enabled }),

  createdAt: "",
  setCreatedAt: (createdAt) => set({ createdAt }),

  emailNotificationsEnabled: false,
  setEmailNotificationsEnabled: (value) =>
    set({ emailNotificationsEnabled: value }),

  showSignOutConfirm: false,
  setShowSignOutConfirm: (value) => set({ showSignOutConfirm: value }),

  isProessingEmails: false,
  setIsProcessingEmails: (value) => set({ isProessingEmails: value }),

  emailLabelEnabled: false,
  setEmailLabelEnabled: (value) => set({ emailLabelEnabled: value }),

  processedEmailCount: 0,
  setProcessedEmailCount: (count) => set({ processedEmailCount: count }),

  teamName: "",
  setTeamName: (name) => set({ teamName: name }),

  teamLocation: "",
  setTeamLocation: (location) => set({ teamLocation: location }),

  editingField: null,
  setEditingField: (field) => set({ editingField: field }),

  editedName: "",
  setEditedName: (name) => set({ editedName: name }),

  editedLocation: "",
  setEditedLocation: (location) => set({ editedLocation: location }),

  teamCreatedAt: "",
  setTeamCreatedAt: (createdAt) => set({ teamCreatedAt: createdAt }),

  teamMembers: [],
  setTeamMembers: (members) => set({ teamMembers: members }),

  membersLoading: false,
  setMembersLoading: (loading) => set({ membersLoading: loading }),

  currentUserRole: null,
  setCurrentUserRole: (role) => set({ currentUserRole: role }),

  editingMemberId: null,
  setEditingMemberId: (id) => set({ editingMemberId: id }),

  editedRole: "",
  setEditedRole: (role) => set({ editedRole: role }),

  isInvitedModalOpen: false,
  setIsInvitedModalOpen: (open) => set({ isInvitedModalOpen: open }),

  emailInput: "",
  setEmailInput: (email) => set({ emailInput: email }),

  emails: [],
  setEmails: (emails) => set({ emails }),

  teamInvideCode: "",
  setTeamInvideCode: (code) => set({ teamInvideCode: code }),

  copyButtonText: "Copy URL",
  setCopyButtonText: (text) => set({ copyButtonText: text }),

  isMobile: false,
  setIsMobile: (value) => set({ isMobile: value }),

  isObsidianModalOpen: false,
  setIsObsidianModalOpen: (open) => set({ isObsidianModalOpen: open }),

  selectedFiles: [],
  setSelectedFiles: (files) => set({ selectedFiles: files }),

  uploadProgress: 0,
  setUploadProgress: (progress) => set({ uploadProgress: progress }),

  isUploading: false,
  setIsUploading: (uploading) => set({ isUploading: uploading }),

  session: null,
  setSession: (session) => set({ session }),

  gmailPermissionError: false,
  setGmailPermissionError: (error) => set({ gmailPermissionError: error }),

  showBroaderAcdessModal: false,
  setShowBroaderAcdessModal: (value) => set({ showBroaderAcdessModal: value }),

  googleTokenVersion: "full",
  setGoogleTokenVersion: (version) => set({ googleTokenVersion: "full" }),

  gmailConnected: false,
  setGmailConnected: (connected) => set({ gmailConnected: connected }),

  showWarningModal: false,
  setShowWarningModal: (value) => set({ showWarningModal: value }),

  emailLabelingEnabled: false,
  setEmailLabelingEnabled: (value) => set({ emailLabelingEnabled: value }),

  // Methods
  importGoogleDocs: async () => {
    const {
      googleTokenVersion,
      setIsImporting,
      setImportSource,
      setImportProgress,
    } = get();

    // Only proceed if we have full access
    if (googleTokenVersion !== "full") {
      console.log("Skipping Google Docs import - no full access");
      toast.error("Google Docs import requires full access permissions");
    }

    console.log("Starting Google Docs import process...");
    setIsImporting(true);
    setImportSource("Google Docs");

    const {
      data: { session },
    } = await supabase.auth.getSession();
    const accessToken = session?.access_token;

    try {
      const response = await fetch("/api/google/import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          userId: session?.user.id,
          accessToken: accessToken,
        }),
      });

      const data = await response.json();

      if (data.success) {
        console.log("Google Docs import initiated:", data);
        toast.success("Import complete! Check email for details.");
      } else {
        console.error("Error importing Google docs:", data.error);
        toast.error("Import failed. Please try again.");
      }
    } catch (error) {
      console.error("Error importing Google docs:", error);
      toast.error("Import failed. Please try again.");
    } finally {
      console.log("Import process completed");
      setIsImporting(false);
      setImportSource("");
      setImportProgress(0);
    }
  },

  importNotionDocuments: async () => {
    if (get().notionConnected) {
      const {
        setIsImporting,
        setImportSource,
        setNotionDocuments,
        setImportProgress,
      } = get();

      setIsImporting(true);
      setImportSource("Notion");

      const {
        data: { session },
      } = await supabase.auth.getSession();

      try {
        const response = await fetch("/api/notion/import", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ session: session }),
        });

        const data = await response.json();

        if (data.success) {
          setNotionDocuments(data.documents);
        } else {
          console.log("Data:", data);
          console.error("Error importing Notion documents:", data.error);
        }
      } catch (error) {
        console.log("Error:", error);
        console.error("Error importing Notion documents:", error);
      } finally {
        setTimeout(() => {
          setIsImporting(false);
          setImportSource("");
          setImportProgress(0);
        }, 1000);
      }
    }
  },

  processGmailLabels: async () => {
    const {
      setIsProcessingEmails,
      setProcessedEmailCount,
      setGmailPermissionError,
    } = get();

    try {
      setIsProcessingEmails(true);
      setProcessedEmailCount(0);
      setGmailPermissionError(false);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        toast.error("You must be logged in to process emails");
        setIsProcessingEmails(false);
        return;
      }

      const response = await fetch("/api/gmail/process-labels", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session.user.id,
          maxEmails: 20,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setProcessedEmailCount(data.processed || 0);
        toast.success(`Successfully processed ${data.processed} emails`);
      } else {
        if (data.errorType === "insufficient_permissions") {
          setGmailPermissionError(true);
          toast.error(
            "Insufficient Gmail permissions. Please reconnect your Google account.",
          );
        } else {
          toast.error(data.error || "Failed to process emails");
        }
      }
    } catch (error) {
      console.error("Error processing Gmail labels:", error);
      toast.error("Failed to process emails");
    } finally {
      setIsProcessingEmails(false);
    }
  },

  checkSession: async () => {
    const { setSession } = get();
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setSession(session);

      if (session) {
        const { setUserId, checkIntegrations } = get();

        setUserId(session.user.id);
        // Fetch user data and integrations
        await checkIntegrations();

        // Fetch Google token version
        const { data, error: tokenError } = await supabase
          .from("users")
          .select("google_token_version")
          .eq("id", session.user.id)
          .single();

        if (!tokenError && data) {
          const {
            setGoogleTokenVersion,
            setGoogleDocsConnected,
            setGmailConnected,
          } = get();
          setGoogleTokenVersion(data.google_token_version);
          setGoogleDocsConnected(data.google_token_version === "full");
          setGmailConnected(
            data.google_token_version === "full" ||
              data.google_token_version === "gmail_only",
          );
        }
      } else {
        const router = useRouter();
        // Redirect if no session
        const currentPath = window.location.pathname + window.location.search;
        const encodedRedirect = encodeURIComponent(currentPath);
        router.push(`/web_app/signin?redirect=${encodedRedirect}`);
      }
    } catch (error) {
      console.error("Error checking session:", error);
    }
  },

  checkIntegrations: async () => {
    const { session } = get();
    try {
      console.log("Checking integrations...");
      const { data: user, error } = await supabase
        .from("users")
        .select(
          "notion_connected, google_docs_connected, omi_connected, calendar_connected, memory_enabled, email, created_at, email_tagging_enabled, emails_enabled",
        )
        .eq("id", session?.user.id)
        .single();

      if (user) {
        const {
          setUserEmail,
          setCreatedAt,
          setNotionConnected,
          setOmiConnected,
          setGoogleDocsConnected,
          setCalendarConnected,
          setMemoryEnabled,
          setEmailLabelingEnabled,
          setEmailNotificationsEnabled,
        } = get();

        setUserEmail(user.email);
        setCreatedAt(
          new Date(user.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        );
        setNotionConnected(user.notion_connected);
        setOmiConnected(user.omi_connected);
        setGoogleDocsConnected(user.google_docs_connected);
        console.log(
          "Setting googleDocsConnected to:",
          user.google_docs_connected,
        );
        setCalendarConnected(user.calendar_connected);
        setMemoryEnabled(user.memory_enabled);
        setEmailLabelingEnabled(user.email_tagging_enabled || false);
        setEmailNotificationsEnabled(user.emails_enabled || false);
      }

      return true;
    } catch (error) {
      console.log("Error checking integration:", error);
      return false;
    }
  },

  initiateLogOut: () => {
    const { setShowSignOutConfirm } = get();
    setShowSignOutConfirm(true);
  },

  handleLogOut: async () => {
    const { setShowSignOutConfirm, setLoading } = get();
    setShowSignOutConfirm(false);
    setLoading(true);

    // Clear local storage and cookies
    console.log("Clearing cookies");
    localStorage.removeItem("amurex_session");
    Cookies.remove("amurex_session", {
      path: "/",
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    // If in extension environment, send message to clear extension storage
    if (window.chrome && window.chrome.runtime && window.chrome.runtime.id) {
      try {
        window.postMessage(
          {
            type: "AMUREX_LOGOUT",
          },
          "*",
        );
      } catch (err) {
        console.error("Error sending logout message to extension:", err);
      }
    }

    // Sign out from Supabase
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error);
    } else {
      const router = useRouter();
      const currentPath = window.location.pathname + window.location.search;
      const encodedRedirect = encodeURIComponent(currentPath);
      router.push(`/web_app/signin?redirect=${encodedRedirect}`);
    }

    setLoading(false);
  },

  connectNotion: async () => {
    try {
      const response = await fetch("/api/notion/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ source: "settings" }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "Failed to get Notion authorization URL");
      }
    } catch (error) {
      console.log("Error connecting to Notion:", error);
      toast.error("Failed to connect to Notion");
    }
  },

  connectOmi: async () => {
    try {
      // Your app ID from OMI platform registration
      const APP_ID = "01JWF84YVZ6SYKE486KWARA2CK";

      // Generate a random state string to prevent CSRF attacks
      const state = Math.random().toString(36).substring(7);

      // Store state in localStorage to verify on callback
      localStorage.setItem("omiOAuthState", state);

      // Construct the authorization URL
      const authUrl = new URL("https://api.omi.me/v1/oauth/authorize");
      // we should potentially store this in the database as well.
      authUrl.searchParams.append("app_id", APP_ID);
      authUrl.searchParams.append("state", state);

      // Redirect user to OMI authorization page
      window.location.href = authUrl.toString();
    } catch (error) {
      console.error("Error initiating OMI OAuth flow:", error);
      toast.error("Failed to connect to OMI");
    }
  },

  handleMemoryToggle: async (checked) => {
    const { setMemoryEnabled } = get();

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        const { error } = await supabase
          .from("users")
          .update({ memory_enabled: checked })
          .eq("id", session.user.id);

        if (error) throw error;
        setMemoryEnabled(checked);
      }
    } catch (error) {
      console.error("Error updating memory settings:", error);
    }
  },

  handleEmailNotificationsToggle: async (checked) => {
    const { setEmailNotificationsEnabled } = get();
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        const { error } = await supabase
          .from("users")
          .update({ emails_enabled: checked })
          .eq("id", session.user.id);

        if (error) throw error;
        setEmailNotificationsEnabled(checked);
        toast.success(
          checked
            ? "Email notifications enabled"
            : "Email notifications disabled",
        );
      }
    } catch (error) {
      console.error("Error updating email notification settings:", error);
      toast.error("Failed to update email settings");
    }
  },

  handleGoogleCallback: async () => {
    const searchParams = useSearchParams();

    const { importGoogleDocs, checkIntegrations } = get();

    console.log("Handling Google callback");
    const code = searchParams.get("code");
    const error = searchParams.get("error");
    const state = searchParams.get("state");

    if (code) {
      try {
        // Get current session
        const {
          data: { session },
        } = await supabase.auth.getSession();

        // Exchange code for tokens
        const response = await fetch("/api/google/callback", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code,
            state,
            userId: session?.user?.id,
          }),
        });

        const data = await response.json();

        if (data.success) {
          await checkIntegrations(); // Refresh integration status
          toast.success("Google Docs connected successfully!");

          // Trigger import if there's a pending import flag
          const pendingImport = localStorage.getItem("pendingGoogleDocsImport");
          if (pendingImport === "true") {
            console.log("Starting import after successful connection...");
            localStorage.removeItem("pendingGoogleDocsImport");
            await importGoogleDocs();
          }
        } else {
          console.error("Connection failed:", data.error);
          toast.error("Failed to connect Google Docs");
        }
      } catch (err) {
        console.error("Error in Google callback:", err);
        toast.error("Failed to connect Google Docs");
      }
    }

    if (error) {
      toast.error(`Connection failed: ${error}`);
    }
  },

  logUserAction: async (userId, eventType) => {
    try {
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
    } catch (error) {
      console.error("Error tracking:", error);
    }
  },

  hadleSave: async (field) => {
    const { editedLocation, editedName } = get();
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) return;

      // Get team_id from team_members
      const { data: teamMember, error: memberError } = await supabase
        .from("team_members")
        .select("team_id")
        .eq("user_id", session.user.id)
        .single();

      if (memberError) throw memberError;

      const updateData: {
        team_name?: string;
        location?: string;
      } = {};

      if (field === "name") {
        updateData.team_name = editedName;
      } else if (field === "location") {
        updateData.location = editedLocation;
      }

      const { error } = await supabase
        .from("teams")
        .update(updateData)
        .eq("id", teamMember.team_id);

      if (error) throw new Error(error.message);

      const { setTeamName, setTeamLocation, setEditingField } = get();

      if (field === "name") setTeamName(editedName);
      if (field === "location") setTeamLocation(editedLocation);
      setEditingField(null);
      toast.success("Team updated successfully");
    } catch (error) {
      console.error("Error updating team:", error);
      toast.error("Failed to updated team");
    }
  },

  getInitials: (fullName, email) => {
    if (fullName) {
      const trimmed = fullName.trim();
      const names = trimmed.split(" ");
      if (names.length >= 2 && names[0] && names[names.length - 1]) {
        const first = names[0]?.[0] || "";
        const last = names[names.length - 1]?.[0] || "";
        return `${first}${last}`.toUpperCase();
      } else if (names.length === 1 && names[0]) {
        return (names[0]?.[0] || "").toUpperCase();
      }
    }
    return email?.[0]?.toUpperCase() || "";
  },

  handleRoleUpdate: async (memberId) => {},

  fetchTeamDetails: async () => {},

  handleEmailInputChange: (e) => {
    set({ emailInput: e.target.value });
  },

  handleEmailInputKeyDown: (e) => {},

  addEmail: () => {
    const { emailInput, emails } = get();
    if (emailInput && !emails.includes(emailInput)) {
      set({ emails: [...emails, emailInput], emailInput: "" });
    }
  },

  removeEmail: (index) => {
    const { emails } = get();
    set({ emails: emails.filter((_, i) => i !== index) });
  },

  handleCopyInviteLink: async () => {},

  sendInvites: async () => {},

  fetchTeamInviteCode: async () => {},

  handleFileSelect: (e) => {},

  handleDragOver: (e) => {
    e.preventDefault();
  },

  handleDragLeave: (e) => {
    e.preventDefault();
  },

  handleDrop: (e) => {
    e.preventDefault();
  },

  handleObsidianUplaod: async () => {},

  handleTabChange: (tab) => {
    set({ activeTab: tab });
  },

  handleEmailLabelToggle: async (checked) => {},

  fetchUserId: async () => {},

  handleGoogleDocsConnect: async () => {},
}));

export default useSettingsStore;
