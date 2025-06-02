import { useRouter } from "next/navigation";

// Types
export type Tool = "notion" | "obsidian" | "google-docs" | "meetings";
export type Category = "important" | "work" | "personal" | string;

export interface EmailStats {
  processed: number;
  stored: number;
  total: number;
}

export interface OnboardingState {
  // State variables
  currentStep: number;
  totalSteps: number;
  selectedTools: Tool[];
  smartCategorizationEnabled: boolean;
  selectedCategories: Category[];
  isConnecting: boolean;
  isProcessingEmails: boolean;
  processingProgress: number;
  processingStep: number;
  emailStats: EmailStats;
  showEmailStats: boolean;
  selectedFiles: File[];
  isUploading: boolean;
  uploadProgress: number;
  isNotionConnecting: boolean;
  isGoogleConnected: boolean;
  notionConnected: boolean;
  googleDocsConnected: boolean;
  activeSlide: number;
  slideProgress: number;
  authCompleted: boolean;
  gifKey: number;

  // Actions
  setCurrentStep: (step: number) => void;
  setSelectedTools: (tools: Tool[]) => void;
  toggleTool: (tool: Tool) => void;
  toggleCategory: (category: Category) => void;
  setSmartCategorizationEnabled: (enabled: boolean) => void;
  setSelectedFiles: (files: File[]) => void;
  setSlideProgress: (progress: number) => void;
  setActiveSlide: (slide: number) => void;
  setIsGoogleConnected: (connected: boolean) => void;

  // Connection handlers
  handleConnectGmail: (router: ReturnType<typeof useRouter>) => Promise<void>;
  handleConnectGoogleDocs: (
    router: ReturnType<typeof useRouter>,
  ) => Promise<void>;
  handleConnectNotion: () => Promise<void>;

  // File operations
  handleFileSelect: (
    e: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>,
  ) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  handleObsidianUpload: () => Promise<void>;

  // Processing
  triggerFakeAnimation: () => void;
  startCompleteImportProcess: (router: ReturnType<typeof useRouter>) => void;
  enableEmailTagging: () => Promise<void>;

  // Navigation
  handleContinue: (router: ReturnType<typeof useRouter>) => void;
  handleCompleteSetup: (router: ReturnType<typeof useRouter>) => void;
  handleSkip: (router: ReturnType<typeof useRouter>) => void;

  // Connection checks
  checkGoogleConnection: () => Promise<void>;
  checkNotionConnection: () => Promise<void>;
  checkGoogleDocsConnection: () => Promise<void>;
}

// Event handler types
export type FileHandler = (
  e: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>,
) => void;

export type DragHandler = (e: React.DragEvent<HTMLDivElement>) => void;

export type ToolHandler = (tool: Tool) => void;
export type CategoryHandler = (category: Category) => void;

// API response type
export interface AuthResponse {
  url?: string;
  error?: string;
}
