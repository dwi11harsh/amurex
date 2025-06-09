import { ChangeEvent, KeyboardEvent } from "react";

//NoteEditorTile
export interface NoteEditorTileProps {
  onSave: (note: string) => void;
  onOpenFocusMode: () => void;
}

export type NoteChangeEvent = ChangeEvent<HTMLTextAreaElement>;
export type NoteKeyDownEvent = KeyboardEvent<HTMLTextAreaElement>;

// PinPopover
interface Pin {
  id: string;
  title: string;
  text?: string;
  tags?: string[];
}

export interface PinPopoverProps {
  pin: Pin;
  onClose: () => void;
}
