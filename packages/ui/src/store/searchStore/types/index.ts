export interface MessageHistoryItem {
  id: number;
  user_id: string;
  payload: MessagePayload;
  created_at: string;
  updated_at?: string;
}

export interface SearchResultType {
  query: string;
  sources: string[];
  vectorResults: any[];
  answer: string;
  title?: string;
  url?: string;
  text_rank?: null | any;
  hybrid_score?: null | any;
  type?: string | null;
}

// The payload can contain different types of messages
export type MessagePayload = {
  type: "GPT" | "USER" | string;
  content?: string;
  text?: string;
  [key: string]: any; // Allow for additional flexible properties
};

export type DeletionConfirmation = {
  deletingThread: {
    title: string;
  };
  isWaiting: boolean;
  error: string | null;
};

export interface Session {
  user_id: string;
  [key: string]: any;
}

export type ThreadItem = {
  id?: string; // Present when fetched from database
  thread_id?: string;
  created_at?: string;
  query: string;
  reply?: string;
  sources: {
    source: string;
    id: number;
    title: string;
    content: string;
    url: string;
    similarity: number;
    text_rank: number | null;
    hybrid_score: number | null;
    type: string;
    from?: string; // Optional for email sources
  }[];
  vectorResults?: any[];
  answer?: string;
  completionTime?: number;
};

export interface SearchStoreType {
  inputValue: string;
  setInputValue: (value: string) => void;

  messageHistory: MessageHistoryItem[];
  setMessageHistory: (message: string) => void;

  session: Session | null;
  setSession: (session: Session | null) => void;

  searchResults: SearchResultType[] | SearchResultType;
  setSearchResults: (results: SearchResultType[] | SearchResultType) => void;

  isSearching: boolean;
  setIsSearching: (value: boolean) => void;

  isSearchInitiated: boolean;
  setIsSearchInitiated: (value: boolean) => void;

  suggestedPrompts: MessagePayload[];
  setSuggestedPrompts: (prompts: MessagePayload[]) => void;

  showOnboarding: boolean;
  setShowOnboarding: (value: boolean) => void;

  hasSeenOnboarding: boolean;
  setHasSeenOnboarding: (value: boolean) => void;

  searchStartTime: number | null;
  setSearchStartTime: (value: number) => void;

  sourcesTime: number | null;
  setSourcesTime: (value: number | null) => void;

  completionTime: string | null;
  setCompletionTime: (value: string | null) => void;

  isSidebarOpened: boolean;
  setIsSidebarOpened: (value: boolean) => void;

  sidebarSessions: Session[];
  setSidebarSessions: (value: Session[]) => void;

  groupedSidebarSessions: {
    [key: string]: Session[];
  };
  setGroupedSidebarSessions: (value: { [key: string]: Session[] }) => void;

  collapsedDays: {
    [key: string]: boolean;
  };
  setCollapsedDays: (value: { [key: string]: boolean }) => void;

  isWaitingSessions: boolean;
  setIsWaitingSessions: (value: boolean) => void;

  currentThread: ThreadItem[];
  setCurrentThread: (value: ThreadItem[]) => void;

  currentThreadId: string;
  setCurrentThreadId: (value: string) => void;

  isDeletionConfirmationPopupOpened: boolean;
  setIsDeletionConfirmationPopupOpened: (value: boolean) => void;

  deletionConfirmation: DeletionConfirmation;
  setDeletionConfirmation: (value: DeletionConfirmation) => void;

  showSpotlight: boolean;
  setShowSpotlight: (value: boolean) => void;

  showGoogleDocs: boolean;
  setShowGoogleDocs: (value: boolean) => void;

  showNotion: boolean;
  setShowNotion: (value: boolean) => void;

  showMeetings: boolean;
  setShowMeetings: (value: boolean) => void;

  showObsidian: boolean;
  setShowObsidian: (value: boolean) => void;

  showGmail: boolean;
  setShowGmail: (value: boolean) => void;

  hasGoogleDocs: boolean;
  setHasGoogleDocs: (value: boolean) => void;

  hasMeetings: boolean;
  setHasMeetings: (value: boolean) => void;

  hasNotion: boolean;
  setHasNotion: (value: boolean) => void;

  hasObsidian: boolean;
  setHasObsidian: (value: boolean) => void;

  hasGmail: boolean;
  setHasGmail: (value: boolean) => void;

  googleTokenVersion: string | null;
  setGoogleTokenVersion: (value: string) => void;

  showGoogleDocsModal: boolean;
  setShowGoogleDocsModal: (value: boolean) => void;

  showGmailModal: boolean;
  setShowGmailModal: (value: boolean) => void;

  showBroaderAccessModal: boolean;
  setShowBroaderAccessModal: (value: boolean) => void;

  isGoogleAuthInProgress: boolean;
  setIsGoogleAuthInProgress: (value: boolean) => void;

  userName: string;
  setUserName: (value: string) => void;

  randomPrompt: string;
  setRandomPrompt: (value: string) => void;

  gmailProfiles: string[];
  setGmailProfiles: (value: string[]) => void;

  isGmailDropDownVisible: boolean;
  setIsGmailDropDownVisible: (value: boolean) => void;

  personalizedPrompts: string[];

  handleHotKey: (e: KeyboardEvent) => void;

  handleSpotlightSearch: (query: string) => void;

  handleNewSearch: () => void;

  sendMessage: (messageToSend: string, isNewSearch: boolean) => void;

  openThread: (threadId: string) => void;

  deleteThread: (threadId: string) => void;

  initiageGoogleAuth: () => void;

  initiateGmailAuth: () => void;

  handleGoogleDocsClick: () => void;

  handleGmailClick: () => void;

  handleNotionClick: () => void;

  handleObsidianClick: () => void;

  handleMeetingsClick: () => void;

  filteredSources: () => void;

  fetchSession: () => Promise<Session | null>;

  logUserAction: (userId: string, eventType: string) => void;
}
