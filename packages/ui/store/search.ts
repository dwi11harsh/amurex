import { create } from "zustand";
import type { SearchResult } from "@amurex/ui/types";

interface SearchState {
  inputValue: string;
  isSearching: boolean;
  isSearchInitiated: boolean;
  searchStartTime: number | null;
  sourceTime: number | null;
  completionTime: number | null;
  searchResult: SearchResult | null;
  setInputValue: (value: string) => void;
  setIsSearching: (value: boolean) => void;
  setSearchStartTime: (value: number | null) => void;
  setIsSearchInitiated: (value: boolean) => void;
  setSourceTime: (value: number | null) => void;
  setCompletionTime: (value: number | null) => void;
  setSearchResult: (value: SearchResult | null | any) => void; // TODO: remove any from here
}

export const useSearchStore = create<SearchState>((set) => ({
  inputValue: "",
  isSearching: false,
  isSearchInitiated: false,
  searchStartTime: null,
  sourceTime: null,
  completionTime: null,
  searchResult: null,
  setInputValue: (value: string) => set({ inputValue: value }),
  setIsSearching: (value: boolean) => set({ isSearching: value }),
  setSearchStartTime: (value: number | null) => set({ searchStartTime: value }),
  setIsSearchInitiated: (value: boolean) => set({ isSearchInitiated: value }),
  setSourceTime: (value: number | null) => set({ sourceTime: value }),
  setCompletionTime: (value: number | null) => set({ completionTime: value }),
  setSearchResult: (value: SearchResult | null) => set({ searchResult: value }),
}));
