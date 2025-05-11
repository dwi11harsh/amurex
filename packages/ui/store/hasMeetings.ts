import { create } from "zustand";

interface HasMeetingsState {
  hasMeetings: boolean;
  setHasMeetings: (hasMeetings: boolean) => void;
}

export const useHasMeetings = create<HasMeetingsState>()((set) => ({
  hasMeetings: false,
  setHasMeetings: (hasMeetings: boolean) => set({ hasMeetings }),
}));
