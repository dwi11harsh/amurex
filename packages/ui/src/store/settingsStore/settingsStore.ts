import { create } from "zustand";
import { SettingsStoreType } from "./types";

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

  // Methods
  importGoogleDocs: async () => {
    // Implementation will be added based on page logic
  },
  importNotionDocuments: async () => {
    // Implementation will be added based on page logic
  },
  processGmailLabels: async () => {
    // Implementation will be added based on page logic
  },
  checkSession: async () => {
    // Implementation will be added based on page logic
  },
  checkIntegration: async () => {
    // Implementation will be added based on page logic
  },
  initiateLogOut: () => {
    set({ showSignOutConfirm: true });
  },
  handleLogOut: async () => {
    // Implementation will be added based on page logic
  },
  connectNotion: async () => {
    // Implementation will be added based on page logic
  },
  connectOmi: async () => {
    // Implementation will be added based on page logic
  },
  handleMemoryToggle: async () => {
    // Implementation will be added based on page logic
  },
  handleEmailNotificationsToggle: async () => {
    // Implementation will be added based on page logic
  },
  handleGoogleCallback: async () => {
    // Implementation will be added based on page logic
  },
  logUserAction: async (userId: string, eventType: string) => {
    // Implementation will be added based on page logic
  },
  hadleSave: async (field: string) => {
    // Implementation will be added based on page logic
  },
  getInitials: (fullName: string, email: string) => {
    // Implementation will be added based on page logic
    return "";
  },
  handleRoleUpdate: async (memberId: string) => {
    // Implementation will be added based on page logic
  },
  fetchTeamDetails: async () => {
    // Implementation will be added based on page logic
  },
  handleEmailInputChange: (e: React.ChangeEvent<HTMLInputElement>) => {
    set({ emailInput: e.target.value });
  },
  handleEmailInputKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Implementation will be added based on page logic
  },
  addEmail: () => {
    const { emailInput, emails } = get();
    if (emailInput && !emails.includes(emailInput)) {
      set({ emails: [...emails, emailInput], emailInput: "" });
    }
  },
  removeEmail: (index: number) => {
    const { emails } = get();
    set({ emails: emails.filter((_, i) => i !== index) });
  },
  handleCopyInviteLink: async () => {
    // Implementation will be added based on page logic
  },
  sendInvites: async () => {
    // Implementation will be added based on page logic
  },
  fetchTeamInviteCode: async () => {
    // Implementation will be added based on page logic
  },
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => {
    // Implementation will be added based on page logic
  },
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  },
  handleDragLeave: (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  },
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    // Implementation will be added based on page logic
  },
  handleObsidianUplaod: async () => {
    // Implementation will be added based on page logic
  },
  handleTabChange: (tab: string) => {
    set({ activeTab: tab });
  },
  handleEmailLabelToggle: async (checked: boolean) => {
    // Implementation will be added based on page logic
  },
  fetchUserId: async () => {
    // Implementation will be added based on page logic
  },
  handleGoogleDocsConnect: async () => {
    // Implementation will be added based on page logic
  },
}));

export default useSettingsStore;
