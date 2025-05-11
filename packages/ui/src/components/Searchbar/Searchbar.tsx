"use client";

import { useCallback, useState } from "react";
import { Input, Button } from "@repo/ui/components";
import type { MouseEventHandler, KeyboardEvent, ChangeEvent } from "react";

interface Pin {
  id: string;
  title: string;
  image: string;
  type: "notion" | "google" | "other";
  tags: string[];
}

interface SearchResponse {
  results?: Array<{
    id: string;
    title: string;
    url: string;
    tags: string[];
  }>;
}

// TODO: Uncomment the following logic

export const Searchbar = (): JSX.Element => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [session, setSession] = useState<unknown | null>(null);
  const [isAiSearching, setIsAiSearching] = useState<boolean>(false);
  const [pins, setPins] = useState<Pin[]>([]);

  const handleAiSearch = useCallback<() => Promise<void>>(async () => {
    if (!searchTerm.trim()) return;
    setIsAiSearching(true);

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: searchTerm,
          searchType: "ai" as const,
          session,
        }),
      });

      const data: SearchResponse = await response.json();

      // if (data.results) {
      //   setPins(
      //     data.results.map((doc) => ({
      //       id: doc.id,
      //       title: doc.title,
      //       image: /* existing image logic */ "",
      //       type: /* existing type logic */ "other",
      //       tags: doc.tags,
      //     }))
      //   );
      // }
    } catch (error) {
      console.error("Error during AI search:", error);
    } finally {
      setIsAiSearching(false);
    }
  }, [searchTerm, session]);

  const handleInputChange = useCallback<
    (e: ChangeEvent<HTMLInputElement>) => void
  >((e) => setSearchTerm(e.target.value), []);

  const handleKeyDown = useCallback<
    (e: KeyboardEvent<HTMLInputElement>) => void
  >(
    (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        handleAiSearch();
      }
    },
    [handleAiSearch],
  );

  const handleClearSearch: MouseEventHandler<HTMLButtonElement> =
    useCallback(() => {
      setSearchTerm("");
    }, []);

  return (
    <>
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
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />
      {searchTerm && (
        <Button
          variant="ghost"
          onClick={handleClearSearch}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
        />
      )}
    </>
  );
};
