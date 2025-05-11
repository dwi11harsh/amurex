import { create } from "zustand";

interface GoogleDocsEnabledState {
  googleDocsEnabled: boolean;
  setGoogleDocsEnabled: (googleDocsEnabled: boolean) => void;
}

export const useGoogleDocsEnabled = create<GoogleDocsEnabledState>()((set) => ({
  googleDocsEnabled: false,
  setGoogleDocsEnabled: (googleDocsEnabled: boolean) =>
    set({ googleDocsEnabled }),
}));
