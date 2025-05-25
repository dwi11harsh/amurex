import { fetchGoogleDocsText } from "./fetch-google-docs-text";
import { fetchNotionText } from "./fetch-notion-text";

export const fetchDocuemtText = async (url: string) => {
  if (url.includes("notion.so")) {
    return await fetchNotionText(url);
  } else if (url.includes("docs.google.com")) {
    return await fetchGoogleDocsText(url);
  } else {
    throw new Error("Unsupported document type");
  }
};
