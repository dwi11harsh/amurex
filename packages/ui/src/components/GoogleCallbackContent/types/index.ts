// Types for state parsing
export type SourceType = "settings" | "onboarding" | "search";
export type ParsedState = {
  userId: string;
  source: SourceType;
  clientId: string;
  clientType: string;
};
