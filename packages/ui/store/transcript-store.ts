import { create } from "zustand";

import { TranscriptState } from "@amurex/ui/types";
import { supabase } from "@amurex/ui/lib/supabaseClient";

export const useTranscriptStore = create<TranscriptState>((set, get) => ({
  searchTerm: "",
  transcripts: [],
  loading: true,
  error: null,
  filter: "personal",
  userTeams: [],
  emailNotificationsEnabled: false,

  setSearchTerm: (term) => set({ searchTerm: term }),
  setFilter: (filter) => set({ filter }),
  setEmailNotificationsEnabled: (enabled) =>
    set({ emailNotificationsEnabled: enabled }),

  fetchTranscripts: async () => {
    set({ loading: true, error: null });
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        set({ error: "Unauthenticated" });
        return;
      }

      const { filter, userTeams } = get();
      let data: {
        id: string;
        meeting_id: string;
        user_ids: string[];
        created_at: string;
        meeting_title: string;
        summary: string;
        transcript: string;
        action_items: string[];
        team_name?: string;
      }[] = [];

      if (filter !== "personal") {
        const { data: teamMeetings, error: meetingsError } = await supabase
          .from("meetings_teams")
          .select(`meeting_id, team_id`)
          .eq("team_id", filter);

        if (meetingsError) throw meetingsError;
        if (!teamMeetings?.length) {
          set({ transcripts: [] });
          return;
        }

        const { data: meetings, error } = await supabase
          .from("late_meeting")
          .select(
            `id, meeting_id, user_ids, created_at, meeting_title, summary, transcript, action_items`,
          )
          .in(
            "id",
            teamMeetings.map((m) => m.meeting_id),
          )
          .order("created_at", { ascending: false })
          .not("transcript", "is", null);

        if (error) throw error;

        data = meetings.map((meeting) => {
          const teamMeeting = teamMeetings.find(
            (tm) => tm.meeting_id === meeting.id,
          );
          const teamInfo = userTeams.find(
            (ut) => ut.team_id === teamMeeting?.team_id,
          );
          return {
            ...meeting,
            team_name: teamInfo?.teams?.team_name || "Unknown Team",
          };
        });
      } else {
        const { data: meetings, error } = await supabase
          .from("late_meeting")
          .select(
            `id, meeting_id, user_ids, created_at, meeting_title, summary, transcript, action_items`,
          )
          .contains("user_ids", [session.user.id])
          .order("created_at", { ascending: false })
          .not("transcript", "is", null);

        if (error) throw error;
        data = meetings;
      }

      const formatted = data.map((meeting) => ({
        id: meeting.id,
        meeting_id: meeting.meeting_id,
        title: meeting.meeting_title || "Untitled Meeting",
        date: new Date(meeting.created_at).toLocaleDateString(),
        time: new Date(meeting.created_at).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        summary: meeting.summary,
        transcript: meeting.transcript,
        action_items: meeting.action_items,
        team_name: meeting.team_name,
      }));

      set({ transcripts: formatted });
    } catch (err: any) {
      set({ error: err.message || "Error fetching transcripts" });
    } finally {
      set({ loading: false });
    }
  },

  fetchUserTeams: async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from("team_members")
        .select(`team_id, teams (id, team_name)`)
        .eq("user_id", session.user.id);

      if (error) throw error;
      set({
        userTeams: (data || []).map((item) => ({
          team_id: item.team_id,
          teams: {
            id: item.teams[0].id,
            team_name: item.teams[0].team_name,
          },
        })),
      });
    } catch (err: any) {
      set({ error: err.message || "Error fetching teams" });
    }
  },

  fetchUserSettings: async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      const { data: user, error } = await supabase
        .from("users")
        .select("emails_enabled")
        .eq("id", session.user.id)
        .single();

      if (error) throw error;
      if (user) {
        set({ emailNotificationsEnabled: user.emails_enabled || false });
      }
    } catch (err: any) {
      set({ error: err.message || "Error fetching user settings" });
    }
  },

  handleEmailNotificationsToggle: async (checked) => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      const { error } = await supabase
        .from("users")
        .update({ emails_enabled: checked })
        .eq("id", session.user.id);

      if (error) throw error;
      set({ emailNotificationsEnabled: checked });
    } catch (error: any) {
      set({ error: error.message || "Failed to update email settings" });
    }
  },
}));
