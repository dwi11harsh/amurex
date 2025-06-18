import { Session } from "@amurex/supabase";

export interface SettingsStoreType {
  activeTab: string;
  setActiveTab: (tab: string) => void;

  loading: boolean;
  setLoading: (loading: boolean) => void;

  userEmail: string;
  setUserEmail: (email: string) => void;

  userId: string | null;
  setUserId: (id: string) => void;

  notionConnected: boolean;
  setNotionConnected: (connected: boolean) => void;

  omiConnected: boolean;
  setOmiConnected: (connected: boolean) => void;

  googleDocsConnected: boolean;
  setGoogleDocsConnected: (connected: boolean) => void;

  calendarConnected: boolean;
  setCalendarConnected: (connected: boolean) => void;

  notionDocuments: any[];
  setNotionDocuments: (documents: any[]) => void;

  isImporting: boolean;
  setIsImporting: (importing: boolean) => void;

  importSource: string;
  setImportSource: (source: string) => void;

  importProgress: number;
  setImportProgress: (progress: number) => void;

  memoryEnabled: boolean;
  setMemoryEnabled: (enabled: boolean) => void;

  createdAt: string;
  setCreatedAt: (createdAt: string) => void;

  emailNotificationsEnabled: boolean;
  setEmailNotificationsEnabled: (value: boolean) => void;

  showSignOutConfirm: boolean;
  setShowSignOutConfirm: (value: boolean) => void;

  isProessingEmails: boolean;
  setIsProcessingEmails: (value: boolean) => void;

  emailLabelEnabled: boolean;
  setEmailLabelEnabled: (value: boolean) => void;

  processedEmailCount: number;
  setProcessedEmailCount: (count: number) => void;

  teamName: string;
  setTeamName: (name: string) => void;

  teamLocation: string;
  setTeamLocation: (location: string) => void;

  editingField: string | null;
  setEditingField: (field: string | null) => void;

  editedName: string;
  setEditedName: (name: string) => void;

  editedLocation: string;
  setEditedLocation: (location: string) => void;

  teamCreatedAt: string;
  setTeamCreatedAt: (createdAt: string) => void;

  teamMembers: string[];
  setTeamMembers: (members: string[]) => void;

  membersLoading: boolean;
  setMembersLoading: (loading: boolean) => void;

  currentUserRole: string | null;
  setCurrentUserRole: (role: string | null) => void;

  editingMemberId: string | null;
  setEditingMemberId: (id: string | null) => void;

  editedRole: string;
  setEditedRole: (role: string) => void;

  isInvitedModalOpen: boolean;
  setIsInvitedModalOpen: (open: boolean) => void;

  emailInput: string;
  setEmailInput: (email: string) => void;

  emails: string[];
  setEmails: (emails: string[]) => void;

  teamInvideCode: string;
  setTeamInvideCode: (code: string) => void;

  copyButtonText: "Copy URL" | "Copied!";
  setCopyButtonText: (text: "Copy URL" | "Copied!") => void;

  isMobile: boolean;
  setIsMobile: (value: boolean) => void;

  isObsidianModalOpen: boolean;
  setIsObsidianModalOpen: (open: boolean) => void;

  selectedFiles: string[];
  setSelectedFiles: (files: string[]) => void;

  uploadProgress: number;
  setUploadProgress: (progress: number) => void;

  isUploading: boolean;
  setIsUploading: (uploading: boolean) => void;

  session: Session | null;
  setSession: (session: Session | null) => void;

  gmailPermissionError: boolean;
  setGmailPermissionError: (error: boolean) => void;

  showBroaderAcdessModal: boolean;
  setShowBroaderAcdessModal: (value: boolean) => void;

  googleTokenVersion: "full";
  setGoogleTokenVersion: (version: number) => void;

  gmailConnected: boolean;
  setGmailConnected: (connected: boolean) => void;

  showWarningModal: boolean;
  setShowWarningModal: (value: boolean) => void;

  emailLabelingEnabled: boolean;
  setEmailLabelingEnabled: (enabled: boolean) => void;

  importGoogleDocs: () => void;

  importNotionDocuments: () => void;

  processGmailLabels: () => void;

  checkSession: () => void;

  checkIntegrations: () => Promise<boolean>;

  initiateLogOut: () => void;

  handleLogOut: () => void;

  connectNotion: () => void;

  connectOmi: () => void;

  handleMemoryToggle: (checked: boolean) => void;

  handleEmailNotificationsToggle: (checked: boolean) => void;

  handleGoogleCallback: () => void;

  logUserAction: (userId: string, eventType: string) => void;

  hadleSave: (field: string) => void;

  getInitials: (fullName: string, email: string) => string;

  handleRoleUpdate: (memberId: string) => void;

  fetchTeamDetails: () => void;

  handleEmailInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

  handleEmailInputKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;

  addEmail: () => void;

  removeEmail: (index: number) => void;

  handleCopyInviteLink: () => void;

  sendInvites: () => void;

  fetchTeamInviteCode: () => void;

  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;

  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;

  handleDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;

  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;

  handleObsidianUplaod: () => void;

  handleTabChange: (tab: string) => void;

  handleEmailLabelToggle: (checked: boolean) => void;

  fetchUserId: () => void;

  handleGoogleDocsConnect: () => void;
}
