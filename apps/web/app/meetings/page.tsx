"use client";

import {
  Card,
  CardContent,
  EmailNotificationToggle,
  MeetingsSearchBar,
  MeetPreview,
  TeamFilterTabs,
  TranscriptCard,
} from "@amurex/ui/components";
import { useTranscriptStore } from "@amurex/ui/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function TranscriptList() {
  const {
    loading,
    error,
    filter,
    transcripts,
    searchTerm,
    fetchTranscripts,
    fetchUserTeams,
    fetchUserSettings,
  } = useTranscriptStore();

  const filteredTranscripts = useTranscriptStore((state) =>
    state.filteredTranscripts(),
  );
  const router = useRouter();

  // Initialize data fetching
  useEffect(() => {
    fetchTranscripts();
    fetchUserTeams();
    fetchUserSettings();
  }, [filter, fetchTranscripts, fetchUserTeams, fetchUserSettings]);

  // Handle authentication redirect
  useEffect(() => {
    if (error === "Unauthenticated") {
      router.push("/web_app/signin");
    }
  }, [error, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <div className="p-8 mx-auto">
          <h1 className="text-2xl font-medium mb-6 text-white">Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="p-8 mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-medium text-white">Meetings</h2>
          <EmailNotificationToggle />
        </div>

        <TeamFilterTabs />
        <MeetingsSearchBar />

        <a href="/search" rel="noopener noreferrer">
          <div className="hidden my-2 bg-zinc-800/80 rounded-xl flex items-center px-3 py-2 cursor-text hover:bg-zinc-700 transition-colors border border-white/10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-zinc-400 mr-2"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <div className="text-zinc-400 text-md">Search in meetings...</div>
          </div>
        </a>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredTranscripts.map((transcript: any) => (
            <TranscriptCard
              key={transcript.id}
              transcript={transcript}
              filter={filter}
            />
          ))}
        </div>

        {transcripts.length === 0 && (
          <>
            <div className="mt-8 mx-auto max-w-4xl">
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#9334E9] to-[#9334E9] rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-gradient-x"></div>
                <Card className="bg-black border-zinc-500 relative overflow-hidden w-full">
                  <div className="absolute inset-0 bg-[#9334E9]/20 animate-pulse"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#9334E9]/30 via-[#9334E9]/20 to-[#9334E9]/30"></div>
                  <CardContent className="p-4 relative text-center">
                    <div className="flex items-center gap-4 justify-center">
                      <div>
                        <h3 className="font-medium text-white text-lg">
                          Try Amurex for Online Meetings
                        </h3>
                        <p className="text-sm text-zinc-400">
                          Get AI-powered summaries for your meetings
                        </p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <a
                        href="https://chromewebstore.google.com/detail/amurex-early-preview/dckidmhhpnfhachdpobgfbjnhfnmddmc"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium border border-white/10 bg-[#9334E9] text-[#FAFAFA] hover:bg-[#3c1671] hover:border-[#6D28D9] transition-colors duration-200"
                      >
                        Get Chrome Extension
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="mt-8 mx-auto max-w-4xl">
              <MeetPreview />
            </div>
          </>
        )}

        {filteredTranscripts.length === 0 && transcripts.length > 0 && (
          <div className="mt-8 mx-auto text-center">
            <h3 className="font-medium text-white text-2xl">
              No meetings found for <b>{searchTerm}</b>
            </h3>
            <p className="text-lg text-zinc-400">
              Please try a different search query, or
            </p>
            <div className="relative w-[50%] mx-auto mt-6">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#9334E9] to-[#9334E9] rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-gradient-x"></div>
              <Card className="bg-black border-zinc-500 relative overflow-hidden">
                <div className="absolute inset-0 bg-[#9334E9]/20 animate-pulse"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-[#9334E9]/30 via-[#9334E9]/20 to-[#9334E9]/30"></div>
                <CardContent className="p-4 relative text-center">
                  <div className="flex items-center gap-4 justify-center">
                    <div className="w-[80%]">
                      <h3 className="font-medium text-white text-2xl mb-2">
                        Try a smarter search
                      </h3>
                      <p className="text-md font-light text-white">
                        Knowledge Search - our new feature that allows you to{" "}
                        <br></br>
                        <span className="italic">
                          search your meetings, emails, and documents
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <a
                      href="/search"
                      className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium border border-white/10 bg-[#9334E9] text-[#FAFAFA] hover:bg-[#3c1671] hover:border-[#6D28D9] transition-colors duration-200"
                    >
                      Try Knowledge Search
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
