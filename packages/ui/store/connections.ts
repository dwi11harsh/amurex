import { create } from "zustand";

interface ConnectionsState {
  googleDocsEnabled: boolean;
  hasNotion: boolean;
  hasNotionEnabled: boolean;
  hasObsidian: boolean;
  hasObsidianEnabled: boolean;
  hasGmail: boolean;
  gmailEnabled: boolean;
  memorySearchEnabled: boolean;
  hasMeetings: boolean;

  setGoogleDocsEnabled: (value: boolean) => void;
  setHasNotion: (value: boolean) => void;
  setHasNotionEnabled: (value: boolean) => void;
  setHasObsidian: (value: boolean) => void;
  setHasObsidianEnabled: (value: boolean) => void;
  setHasGmail: (value: boolean) => void;
  setGmailEnabled: (value: boolean) => void;
  setMemorySearchEnabled: (value: boolean) => void;
  setHasMeetings: (value: boolean) => void;
}

export const useConnectionsStore = create<ConnectionsState>((set) => ({
  googleDocsEnabled: false,
  hasNotion: false,
  hasNotionEnabled: false,
  hasObsidian: false,
  hasObsidianEnabled: false,
  hasGmail: false,
  gmailEnabled: false,
  memorySearchEnabled: false,
  hasMeetings: false,

  setGoogleDocsEnabled: (value: boolean) => set({ googleDocsEnabled: value }),
  setHasNotion: (value: boolean) => set({ hasNotion: value }),
  setHasNotionEnabled: (value: boolean) => set({ hasNotionEnabled: value }),
  setHasObsidian: (value: boolean) => set({ hasObsidian: value }),
  setHasObsidianEnabled: (value: boolean) => set({ hasObsidianEnabled: value }),
  setHasGmail: (value: boolean) => set({ hasGmail: value }),
  setGmailEnabled: (value: boolean) => set({ gmailEnabled: value }),
  setMemorySearchEnabled: (value: boolean) =>
    set({ memorySearchEnabled: value }),
  setHasMeetings: (value: boolean) => set({ hasMeetings: value }),
}));
