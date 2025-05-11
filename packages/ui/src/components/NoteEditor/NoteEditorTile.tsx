"use client";

import React, { useState, useCallback } from "react";
import { Button } from "@repo/ui/components";
import { Plus, Maximize2 } from "lucide-react";

interface NoteEditorTileProps {
  onSave: (note: string) => void;
  onOpenFocusMode: () => void;
}

export const NoteEditorTile: React.FC<NoteEditorTileProps> = ({
  onSave,
  onOpenFocusMode,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [note, setNote] = useState<string>("");

  const handleSave = useCallback(() => {
    onSave(note);
    setNote("");
    setIsEditing(false);
  }, [note, onSave]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        handleSave();
      }
    },
    [handleSave],
  );

  if (!isEditing) {
    return (
      <div
        className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out h-[300px] flex items-center justify-center cursor-pointer"
        onClick={() => setIsEditing(true)}
        role="button"
        tabIndex={0}
      >
        <Plus className="h-12 w-12 text-gray-400" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 h-[300px] flex flex-col relative">
      <textarea
        className="flex-grow resize-none border-none focus:ring-0 text-sm"
        value={note}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          setNote(e.target.value)
        }
        onKeyDown={handleKeyDown}
        placeholder="Start typing your note..."
        autoFocus
      />
      <div className="flex justify-between mt-2">
        <Button
          onClick={onOpenFocusMode}
          variant="ghost"
          className="absolute top-2 right-2"
          aria-label="Focus mode"
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
        <div>
          <Button
            onClick={() => setIsEditing(false)}
            variant="ghost"
            className="mr-2"
          >
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </div>
    </div>
  );
};
