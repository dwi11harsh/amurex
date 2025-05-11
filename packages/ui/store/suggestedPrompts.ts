import { create } from "zustand";

type PromptType = "prompt" | "email";

interface SuggestedPromptType {
  type: PromptType;
  text: string;
}

interface SuggestedPromptStore {
  suggestedPrompts: SuggestedPromptType[];
  setSuggestedPrompts: (prompts: SuggestedPromptType[]) => void;
  clearSuggestedPrompts: () => void;
}

export const useSuggestedPromptsStore = create<SuggestedPromptStore>((set) => ({
  suggestedPrompts: [],
  setSuggestedPrompts: (prompts) => set({ suggestedPrompts: prompts }),
  clearSuggestedPrompts: () => set({ suggestedPrompts: [] }),
}));
