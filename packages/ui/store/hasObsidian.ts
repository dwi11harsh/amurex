import { create } from "zustand";

interface HasObsidianState {
  hasObsidian: boolean;
  hasObsidianEnabled: boolean;
  setHasObsidian: (hasObsidian: boolean) => void;
  setHasObsidianEnabled: (hasObsidianEnabled: boolean) => void;
}

export const useHasObsidian = create<HasObsidianState>()((set) => ({
  hasObsidian: false,
  hasObsidianEnabled: false,
  setHasObsidian: (hasObsidian: boolean) => set({ hasObsidian }),
  setHasObsidianEnabled: (hasObsidianEnabled: boolean) =>
    set({ hasObsidianEnabled }),
}));
