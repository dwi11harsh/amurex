"use client";

import { useCallback, useState } from "react";
import { NoteEditorTile, Loader } from "@repo/ui/components";

interface Pin {
  id: string;
  title: string;
  image: string;
  type: string;
  size: "small" | "medium" | "large";
  tags: string[];
  url: string;
  created_at: string;
}

interface Session {
  // Replace with actual session properties based on your authentication implementation
  user?: {
    id: string;
    email?: string;
  };
  // ... other potential session properties
}

export const NoteEditor = (): JSX.Element => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFocusMode, setIsFocusMode] = useState<boolean>(false);
  const [session, setSession] = useState<Session | null>(null);
  const [pins, setPins] = useState<Pin[]>([]);

  const handleOpenFocusMode = useCallback((): void => {
    setIsFocusMode(true);
  }, []);

  const handleSaveNote = useCallback(
    async (noteText: string): Promise<void> => {
      try {
        const filename = `note_${Date.now()}.txt`;
        const lines: string[] = noteText.split("\n");
        const title: string = lines[0] || "Untitled Note";
        const content: string = lines.slice(1).join("\n").trim();

        console.log("Saving note:", noteText);

        // ... rest of the commented implementation
      } catch (error) {
        console.error("Error saving note:", error);
      }
    },
    [session],
  );

  return (
    <div className="h-full overflow-y-auto p-8">
      {isLoading ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 min-h-full">
          <NoteEditorTile
            onSave={handleSaveNote}
            onOpenFocusMode={handleOpenFocusMode}
          />
          {/* {pins.map((pin: Pin) => (
            <PinTile key={pin.id} pin={pin} />
          ))} */}
        </div>
      )}
    </div>
  );
};
