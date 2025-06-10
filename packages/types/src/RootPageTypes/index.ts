//NoteEditorTile
export interface NoteEditorTileProps {
  onSave: (note: string) => void;
  onOpenFocusMode: () => void;
}

export type Size = "small" | "medium" | "large";

// PinPopover
export interface Pin {
  id: string;
  title: string;
  text?: string;
  image: string;
  type: "note" | "notion" | "google" | "google_docs" | "other";
  size?: Size;
  tags: string[];
  url?: string;
  created_at?: string;
}

export interface PinPopoverProps {
  pin: Pin;
  onClose: () => void;
}
