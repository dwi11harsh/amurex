export interface SharedTranscript {
  id: string;
  meeting_id: string;
  title: string;
  date: string;
  time: string;
  summary: string;
  content: string;
  actionItems: string;
}

export interface SharedTranscriptParams {
  id: string;
}

export interface SharedTranscriptPageProps {
  params: SharedTranscriptParams;
}

export interface SharedTranscriptApiResponse {
  id: string;
  meeting_id: string;
  meeting_title?: string;
  created_at: string;
  summary: string;
  transcript?: string;
  action_items?: string;
}
