export interface CategoriesState {
  categories: {
    to_respond: boolean;
    fyi: boolean;
    comment: boolean;
    notification: boolean;
    meeting_update: boolean;
    awaiting_reply: boolean;
    actioned: boolean;
  };
  custom_properties: Record<string, any>;
}

export interface SampleEmail {
  id: number;
  sender: string;
  subject: string;
  category: keyof CategoriesState["categories"];
  time: string;
}

export interface CategoryToggleProps {
  category: keyof CategoriesState["categories"];
  checked: boolean;
  onToggle: (
    category: keyof CategoriesState["categories"],
    checked: boolean,
  ) => void;
  categoryName: string;
  description: string;
  color: string;
  textColor?: string;
}

export interface EmailPreviewProps {
  emails: SampleEmail[];
  categories: CategoriesState;
  onEmailClick: (sender: string) => void;
}

export interface EmailTaggingCardProps {
  emailTaggingEnabled: boolean;
  isProcessingEmails: boolean;
  processingComplete: boolean;
  onToggle: (checked: boolean) => void;
  onProcess: () => void;
  showPreview: boolean;
  onTogglePreview: () => void;
}

export interface CategoriesSettingsProps {
  categories: CategoriesState;
  onToggle: (
    category: keyof CategoriesState["categories"],
    checked: boolean,
  ) => void;
}
