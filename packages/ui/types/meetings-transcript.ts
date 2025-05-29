export interface UserTeam {
  team_id: string;
  teams: {
    id: string;
    team_name: string;
  } | null;
}

export interface Transcript {
  id: string;
  meeting_id: string;
  title: string;
  date: string;
  time: string;
  summary: string;
  transcript: string;
  action_items: any;
  team_name?: string;
}

export interface TranscriptState {
  searchTerm: string;
  transcripts: Transcript[];
  loading: boolean;
  error: string | null;
  filter: string;
  userTeams: UserTeam[];
  emailNotificationsEnabled: boolean;

  setSearchTerm: (term: string) => void;
  setFilter: (filter: string) => void;
  setEmailNotificationsEnabled: (enabled: boolean) => void;

  fetchTranscripts: () => Promise<void>;
  fetchUserTeams: () => Promise<void>;
  fetchUserSettings: () => Promise<void>;
  handleEmailNotificationsToggle: (checked: boolean) => Promise<void>;
}
