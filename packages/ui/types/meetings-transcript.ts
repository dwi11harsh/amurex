export interface Transcript {
  id: string;
  meeting_id: string;
  title: string;
  date: string;
  time: string;
  summary: string;
  content: string;
  actionItems: string;
  team_name?: string;
}

export interface TranscriptStore {
  session: any;
  memoryEnabled: boolean;
  loading: boolean;
  transcript: Transcript | null;
  fullTranscriptText: string;
  error: string | null;
  isModalOpen: boolean;
  isPreviewModalOpen: boolean;
  isChatOpen: boolean;
  chatMessages: { role: string; content: string }[];
  chatInput: string;
  isSending: boolean;
  copyButtonText: string;
  copyActionItemsText: string;
  copyMeetingSummaryText: string;
  emails: string[];
  emailInput: string;
  isMobile: boolean;
  sharedWith: string[];
  previewContent: string;
  isLoadingPreview: boolean;
  params: { id: string } | null;
  filter: string;
  userTeams: UserTeam[];
  searchTerm: string;

  init: (params: { id: string }) => void;
  setSession: (session: any) => void;
  setMemoryEnabled: (value: boolean) => void;
  setLoading: (value: boolean) => void;
  setTranscript: (transcript: Transcript | null) => void;
  setFullTranscriptText: (text: string) => void;
  setError: (error: string | null) => void;
  setIsModalOpen: (value: boolean) => void;
  setIsPreviewModalOpen: (value: boolean) => void;
  setIsChatOpen: (value: boolean) => void;
  setChatMessages: (messages: { role: string; content: string }[]) => void;
  setChatInput: (input: string) => void;
  setIsSending: (value: boolean) => void;
  setCopyButtonText: (text: string) => void;
  setCopyActionItemsText: (text: string) => void;
  setCopyMeetingSummaryText: (text: string) => void;
  setEmails: (emails: string[]) => void;
  setEmailInput: (input: string) => void;
  setIsMobile: (value: boolean) => void;
  setSharedWith: (emails: string[]) => void;
  setPreviewContent: (content: string) => void;
  setIsLoadingPreview: (value: boolean) => void;
  setFilter: (filter: string) => void;
  setSearchTerm: (term: string) => void;

  fetchSession: () => Promise<void>;
  logUserAction: (userId: string, eventType: string) => Promise<void>;
  fetchTranscript: () => Promise<void>;
  fetchMemoryStatus: () => Promise<void>;
  toggleModal: () => void;
  handleEmailInputKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  validateEmail: (email: string) => boolean;
  addEmail: () => void;
  removeEmail: (index: number) => void;
  sendEmails: () => Promise<void>;
  handleCopyLink: () => Promise<void>;
  handleDownload: () => Promise<void>;
  handleActualDownload: () => Promise<void>;
  handleActionItemClick: () => Promise<void>;
  handleSummaryClick: () => Promise<void>;
  handleChatSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

export interface UserTeam {
  team_id: string;
  teams: {
    id: string;
    team_name: string;
  } | null;
}

export interface TranscriptState {
  searchTerm: string;
  transcripts: Transcript[];
  loading: boolean;
  error: string | null;
  filter: string;
  userTeams: UserTeam[];
  emailNotificationsEnabled: boolean;

  setSearchTerm: (term: string) => void;
  setFilter: (filter: string) => void;
  setEmailNotificationsEnabled: (enabled: boolean) => void;
  filteredTranscripts: () => Transcript[];

  fetchTranscripts: () => Promise<void>;
  fetchUserTeams: () => Promise<void>;
  fetchUserSettings: () => Promise<void>;
  handleEmailNotificationsToggle: (checked: boolean) => Promise<void>;
}

export interface ChatMessage {
  role: string;
  content: string;
}
