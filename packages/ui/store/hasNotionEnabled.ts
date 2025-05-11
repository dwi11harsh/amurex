import { create } from "zustand";

interface HasNotionEnabledState {
  hasNotion: boolean;
  hasNotionEnabled: boolean;
  setHasNotionEnabled: (hasNotionEnabled: boolean) => void;
  setHasNotion: (hasNotion: boolean) => void;
}

export const useHasNotionEnabled = create<HasNotionEnabledState>()((set) => ({
  hasNotion: false,
  hasNotionEnabled: false,
  setHasNotionEnabled: (hasNotionEnabled: boolean) => set({ hasNotionEnabled }),
  setHasNotion: (hasNotion: boolean) => set({ hasNotion }),
}));
