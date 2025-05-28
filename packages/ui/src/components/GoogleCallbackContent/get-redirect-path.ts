import { SourceType } from "./types";

// Helper function to get redirect path
export const getRedirectPath = (
  source: SourceType,
  isError: boolean,
  message?: string,
): string => {
  let path: string;

  switch (source) {
    case "onboarding":
      path = "/onboarding";
      break;
    case "search":
      path = "/search";
      break;
    default:
      path = "/settings";
  }

  if (isError && message) {
    return `${path}?error=${encodeURIComponent(message)}`;
  }

  return path;
};
