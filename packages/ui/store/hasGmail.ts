import { create } from "zustand";

interface HasGmailState {
  hasGmail: boolean;
  gmailEnabled: boolean;
  setHasGmail: (hasGmail: boolean) => void;
  setGmailEnabled: (gmailEnabled: boolean) => void;
}

export const useHasGmail = create<HasGmailState>()((set) => ({
  hasGmail: false,
  gmailEnabled: false,
  setHasGmail: (hasGmail: boolean) => set({ hasGmail }),
  setGmailEnabled: (gmailEnabled: boolean) => set({ gmailEnabled }),
}));
