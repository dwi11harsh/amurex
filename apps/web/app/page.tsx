"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  ChangeEvent,
  KeyboardEvent,
} from "react";
import { useRouter } from "next/navigation";
import localFont from "next/font/local";
import { Session, supabase } from "@amurex/supabase";
import { useDebounce } from "@amurex/web/hooks/useDebounce";
import {
  Button,
  FocusedEditor,
  Input,
  Loader,
  Navbar,
  NoteEditorTile,
  PinTile,
} from "@amurex/ui/components";
import { Pin, Size } from "@amurex/types";
/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

/** Row coming back from `documents` table – extend / adjust as required. */
interface DocumentRow {
  id: string;
  user_id: string;
  title: string;
  url: string;
  tags: string[];
  created_at: string;
}

/* -------------------------------------------------------------------------- */
/*                                Local fonts                                 */
/* -------------------------------------------------------------------------- */

const louizeFont = localFont({
  src: "../fonts/Louize.ttf",
  variable: "--font-louize",
});

/* -------------------------------------------------------------------------- */
/*                               Main component                               */
/* -------------------------------------------------------------------------- */

const HomePage = (): JSX.Element => {
  /* ------------------------------- State ---------------------------------- */

  const [session, setSession] = useState<Session | null>(null);
  const [pins, setPins] = useState<Pin[]>([]);
  const [isFocusMode, setIsFocusMode] = useState<boolean>(false);
  const [focusNoteContent, setFocusNoteContent] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearchTerm = useDebounce<string>(searchTerm, 300);
  const [isAiSearching, setIsAiSearching] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showIntegrationsPopup, setShowIntegrationsPopup] =
    useState<boolean>(false);

  const router = useRouter();

  /* ------------------------------ Lifecycle -------------------------------- */

  /* Redirect on mount */
  useEffect(() => {
    router.push("/search");
  }, [router]);

  /* Initial auth + listener */
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: _session } }) => {
      setSession(_session);
      if (_session) fetchDocuments();
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, _session) => {
      setSession(_session);
      if (_session) fetchDocuments();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  /* Search debounce */
  useEffect(() => {
    if (debouncedSearchTerm) {
      searchPins(debouncedSearchTerm);
    } else {
      fetchDocuments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm]);

  /* Guard route if not logged in */
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session: _session },
      } = await supabase.auth.getSession();
      if (!_session) router.push("/web_app/signin");
    };
    checkSession();
  }, [router]);

  /* Check connected integrations */
  useEffect(() => {
    const checkConnections = async () => {
      const {
        data: { session: _session },
      } = await supabase.auth.getSession();

      if (_session) {
        const { data: user } = await supabase
          .from("users")
          .select("notion_connected, google_docs_connected")
          .eq("id", _session.user.id)
          .single();

        if (user && !user.notion_connected && !user.google_docs_connected) {
          setShowIntegrationsPopup(true);
        }
      }
    };

    checkConnections();
  }, []);

  /* ------------------------------------------------------------------------ */
  /*                               Data access                                */
  /* ------------------------------------------------------------------------ */

  const fetchDocuments = async (): Promise<void> => {
    try {
      const {
        data: { session: _session },
      } = await supabase.auth.getSession();

      if (!_session) {
        console.error("No active session");
        return;
      }

      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("user_id", _session.user.id);

      if (error) throw error;

      if (data) {
        setPins(
          data.map(
            (d: DocumentRow): Pin => ({
              id: d.id,
              title: d.title,
              image: "/placeholder.svg?height=300&width=200",
              type: "note",
              tags: d.tags ?? [],
              url: d.url,
              created_at: d.created_at,
            }),
          ),
        );
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Error fetching documents:", err);
    } finally {
      setIsLoading(false);
    }
  };

  /* ------------------------------------------------------------------------ */
  /*                               UI actions                                 */
  /* ------------------------------------------------------------------------ */

  const searchPins = useCallback(
    (term: string): void => {
      const lowered = term.toLowerCase();
      const filtered = pins.filter(
        (pin) =>
          pin.title.toLowerCase().includes(lowered) ||
          pin.tags.some((t) => t.toLowerCase().includes(lowered)),
      );
      setPins(filtered);
    },
    [pins],
  );

  const handleSaveNote = useCallback(
    async (noteText: string): Promise<void> => {
      try {
        const filename = `note_${Date.now()}.txt`;

        /* Split note into title & body */
        const [firstLine, ...rest] = noteText.split("\n");
        const title = firstLine || "Untitled Note";
        const content = rest.join("\n").trim();

        /* Upload raw note */
        const { error: uploadError } = await supabase.storage
          .from("notes")
          .upload(filename, noteText);

        if (uploadError) throw uploadError;

        /* Get public URL */
        let publicUrl: string;
        try {
          const { data } = supabase.storage
            .from("notes")
            .getPublicUrl(filename);
          publicUrl = data.publicUrl;
        } catch (err: unknown) {
          console.error("Error getting public URL:", err);
          throw new Error("Failed to get public URL for the note");
        }

        /* Persist document metadata via own API  */
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url: publicUrl,
            title,
            text: content || title,
            created_at: new Date().toISOString(),
            session,
          }),
        });

        const json: { success: boolean; documentId?: string; error?: string } =
          await res.json();

        if (json.success && json.documentId) {
          const newPin: Pin = {
            id: json.documentId,
            title,
            image: "/placeholder.svg?height=300&width=200",
            type: "note",
            size: ["small", "medium", "large"][
              Math.floor(Math.random() * 3)
            ] as Size,
            tags: [],
            url: publicUrl,
            created_at: new Date().toISOString(),
          };
          setPins((prev) => [newPin, ...prev]);
        } else {
          // eslint-disable-next-line no-console
          console.error("Error saving note:", json.error);
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Error saving note:", err);
      }
    },
    [session],
  );

  const handleOpenFocusMode = useCallback(() => setIsFocusMode(true), []);
  const handleCloseFocusMode = useCallback(() => {
    setIsFocusMode(false);
    setFocusNoteContent("");
  }, []);

  const handleSaveFocusNote = useCallback(
    async (noteText: string) => {
      await handleSaveNote(noteText);
      handleCloseFocusMode();
    },
    [handleSaveNote, handleCloseFocusMode],
  );

  const handleAiSearch = useCallback(async () => {
    if (!searchTerm.trim()) return;

    setIsAiSearching(true);
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchTerm, searchType: "ai", session }),
      });

      const data: { results?: DocumentRow[] } = await res.json();

      if (data.results) {
        setPins(
          data.results.map(
            (doc): Pin => ({
              id: doc.id,
              title: doc.title,
              image:
                doc.url.includes("notion.so") || doc.url.includes("notion.site")
                  ? "https://upload.wikimedia.org/wikipedia/commons/e/e9/Notion-logo.svg"
                  : doc.url.includes("docs.google.com")
                    ? "https://www.google.com/images/about/docs-icon.svg"
                    : "/placeholder.svg?height=300&width=200",
              type:
                doc.url.includes("notion.so") || doc.url.includes("notion.site")
                  ? "notion"
                  : doc.url.includes("docs.google.com")
                    ? "google"
                    : "other",
              tags: doc.tags ?? [],
              url: doc.url,
              created_at: doc.created_at,
            }),
          ),
        );
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Error during AI search:", err);
    } finally {
      setIsAiSearching(false);
    }
  }, [searchTerm, session]);

  /* ------------------------------------------------------------------------ */
  /*                            External integrations                         */
  /* ------------------------------------------------------------------------ */

  const handleNotionConnect = (): void => router.push("/api/notion/auth");
  const handleGoogleDocsConnect = (): void => router.push("/api/google/auth");

  /* ------------------------------------------------------------------------ */
  /*                                   JSX                                    */
  /* ------------------------------------------------------------------------ */

  // Temporary early-return in original file
  const nope = "nope";
  if (nope === "nope") {
    return <Navbar />;
  }

  return (
    <>
      <Navbar />
      {/* Hidden root (to follow original file structure) */}
      <div className="hidden bg-black">
        <div
          className={`${louizeFont.variable} flex flex-col h-screen ml-16`}
          style={{ backgroundColor: "var(--surface-color-2)" }}
        >
          {/* ------------- search bar ------------- */}
          <div
            className="sticky top-0 z-40 w-full bg-opacity-90 backdrop-blur-sm"
            style={{ backgroundColor: "var(--surface-color-2)" }}
          >
            <div className="w-full py-4 px-8 flex justify-between items-center">
              <div className="relative w-full flex items-center">
                <Input
                  type="search"
                  placeholder="Search..."
                  className="w-full text-6xl py-4 px-2 font-serif bg-transparent border-0 border-b-2 rounded-none focus:ring-0 transition-colors"
                  style={{
                    fontFamily: "var(--font-louize), serif",
                    borderColor: "var(--line-color)",
                    color: "var(--color)",
                  }}
                  value={searchTerm}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setSearchTerm(e.target.value)
                  }
                  onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                      e.preventDefault();
                      handleAiSearch();
                    }
                  }}
                />
                {searchTerm && (
                  <Button
                    variant="ghost"
                    onClick={() => setSearchTerm("")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                  />
                )}
              </div>
            </div>
          </div>

          {/* ------------- pin grid ------------- */}
          <div className="flex-grow overflow-hidden">
            <div className="h-full overflow-y-auto p-8">
              {isLoading ? (
                <Loader />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 min-h-full">
                  <NoteEditorTile
                    onSave={handleSaveNote}
                    onOpenFocusMode={handleOpenFocusMode}
                  />
                  {pins.map((pin) => (
                    <PinTile key={pin.id} pin={pin} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ------------- focus mode ------------- */}
          {isFocusMode && (
            <div className="fixed inset-0 bg-white z-50 flex flex-col p-8">
              <FocusedEditor
                onSave={handleSaveFocusNote}
                onClose={handleCloseFocusMode}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default HomePage;
