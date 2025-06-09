import { ChangeEvent, KeyboardEvent } from "react";

export interface NoteEditorTileProps {
  onSave: (note: string) => void;
  onOpenFocusMode: () => void;
}

export type NoteChangeEvent = ChangeEvent<HTMLTextAreaElement>;
export type NoteKeyDownEvent = KeyboardEvent<HTMLTextAreaElement>;
