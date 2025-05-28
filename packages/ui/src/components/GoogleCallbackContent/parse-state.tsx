import { ParsedState, SourceType } from "./types";

// Helper function to parse state parameter
export const ParseState = (state: string | null): ParsedState => {
  const defaultState = {
    userId: "",
    source: "settings" as SourceType,
    clientId: "",
    clientType: "",
  };

  if (!state) return defaultState;

  const parts = state.split(":");
  return {
    userId: parts[0] || "",
    source: (parts[1] as SourceType) || "settings",
    clientId: parts[2] || "",
    clientType: parts[3] || "",
  };
};
