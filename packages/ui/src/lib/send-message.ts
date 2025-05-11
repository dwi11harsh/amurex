import {
  useConnectionsStore,
  useSearchStore,
  useSessionStore,
} from "@repo/ui/store";
import { useShallow } from "zustand/shallow";

export const sendMessage = (messageToSend?: string): void => {
  const session = useSessionStore((state) => state.session);
  const {
    inputValue,
    setInputValue,
    setIsSearching,
    setIsSearchInitiated,
    setSearchStartTime,
    setSourcesTime,
    setCompletionTime,
    setSearchResults,
  } = useSearchStore(
    useShallow((state) => ({
      inputValue: state.inputValue,
      setInputValue: state.setInputValue,
      setIsSearching: state.setIsSearching,
      setIsSearchInitiated: state.setIsSearchInitiated,
      setSearchStartTime: state.setSearchStartTime,
      setSourcesTime: state.setSourceTime,
      setCompletionTime: state.setCompletionTime,
      setSearchResults: state.setSearchResult,
    })),
  );

  const {
    googleDocsEnabled,
    notionEnabled,
    memorySearchEnabled,
    obsidianEnabled,
    gmailEnabled,
  } = useConnectionsStore(
    useShallow((state) => ({
      googleDocsEnabled: state.googleDocsEnabled,
      notionEnabled: state.hasNotionEnabled,
      memorySearchEnabled: state.memorySearchEnabled,
      obsidianEnabled: state.hasObsidianEnabled,
      gmailEnabled: state.gmailEnabled,
    })),
  );

  if (!session?.user?.id) return;

  const message: string = messageToSend || inputValue;
  setInputValue("");
  setIsSearching(true);
  setIsSearchInitiated(true);

  // Reset all timing metrics
  const startTime: number = performance.now();
  setSearchStartTime(startTime);
  setSourcesTime(null);
  setCompletionTime(null);

  setSearchResults({
    query: message,
    sources: [],
    vectorResults: [],
    answer: "",
  });

  fetch("/api/chat", {
    method: "POST",
    body: JSON.stringify({
      message,
      googleDocsEnabled,
      notionEnabled,
      memorySearchEnabled,
      obsidianEnabled,
      gmailEnabled,
      user_id: session.user.id,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response: Response) => {
      if (!response.ok || !response.body)
        throw new Error("Network response was not ok");

      const reader: ReadableStreamDefaultReader<Uint8Array> =
        response.body.getReader();
      const decoder: TextDecoder = new TextDecoder();
      let buffer: string = "";
      let sourcesReceived: boolean = false;
      let firstChunkReceived: boolean = false;

      const readStream = (): void => {
        reader
          .read()
          .then(({ done, value }: ReadableStreamReadResult<Uint8Array>) => {
            if (done) {
              // Record final completion time when stream ends
              const endTime: number = performance.now();
              setCompletionTime((endTime - startTime) / 1000);
              setIsSearching(false);
              return;
            }

            buffer += decoder.decode(value, { stream: true });

            try {
              // Split by newlines and filter out empty lines
              const lines: string[] = buffer
                .split("\n")
                .filter((line: string) => line.trim());

              // Process each complete line
              for (let i: number = 0; i < lines.length; i++) {
                try {
                  const line = lines[i];
                  if (!line) continue;
                  const data: any = JSON.parse(line); // TODO: remove any from here

                  // Update search results
                  if (data.success) {
                    // Track when sources first arrive
                    if (
                      data.sources &&
                      data.sources.length > 0 &&
                      !sourcesReceived
                    ) {
                      sourcesReceived = true;
                      const currentTime: number = performance.now();
                      setSourcesTime((currentTime - startTime) / 1000);
                    }

                    // Track when first text chunk arrives
                    if (data.chunk && !firstChunkReceived) {
                      firstChunkReceived = true;
                    }

                    setSearchResults(({ prev }: { prev: any }) => ({
                      ...prev,
                      sources: data.sources || prev.sources,
                      answer: prev.answer + (data.chunk || ""),
                      done: data.done || false,
                    }));
                  }
                } catch (e: unknown) {
                  console.error("Error parsing JSON:", e, "Line:", lines[i]);
                }
              }

              // Keep only the incomplete line in the buffer
              const lastNewlineIndex: number = buffer.lastIndexOf("\n");
              if (lastNewlineIndex !== -1) {
                buffer = buffer.substring(lastNewlineIndex + 1);
              }
            } catch (e: unknown) {
              console.error("Error processing buffer:", e);
            }

            readStream();
          })
          .catch((err: unknown) => {
            console.error("Stream reading error:", err);
            setIsSearching(false);
          });
      };

      readStream();
    })
    .catch((err: unknown) => {
      console.error("Error:", err);
      setIsSearching(false);
    });
};
