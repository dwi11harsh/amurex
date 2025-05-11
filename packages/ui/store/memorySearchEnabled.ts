import { create } from "zustand";

interface MemorySearchEnabledState {
  memorySearchEnabled: boolean;
  setMemorySearchEnabled: (memorySearchEnabled: boolean) => void;
}

export const useMemorySearchEnabled = create<MemorySearchEnabledState>()(
  (set) => ({
    memorySearchEnabled: false,
    setMemorySearchEnabled: (memorySearchEnabled: boolean) =>
      set({ memorySearchEnabled }),
  }),
);
