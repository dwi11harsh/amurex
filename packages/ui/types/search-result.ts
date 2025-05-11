export interface SearchResult {
  query: string;
  sources: any[]; // TODO: replace any
  vectorResults: any[]; // TODO: replace any
  answer: string;
  done?: boolean;
}
