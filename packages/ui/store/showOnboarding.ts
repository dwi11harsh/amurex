import { create } from "zustand";

interface ShowOnboardingState {
  showOnboarding: boolean;
  hasGoogleDocs: boolean;
  hasNotion: boolean;
  setShowOnboarding: (showOnboarding: boolean) => void;
}

export const useShowOnboarding = create<ShowOnboardingState>()((set) => ({
  showOnboarding: false,
  hasGoogleDocs: false,
  hasNotion: false,
  setShowOnboarding: (showOnboarding: boolean) => set({ showOnboarding }),
}));
