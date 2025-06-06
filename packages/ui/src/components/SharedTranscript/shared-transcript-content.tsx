"use client";

import { ArrowLeft, FileText, Calendar, Clock } from "lucide-react";
import Link from "next/link";
import styles from "./TranscriptDetail.module.css";
import dynamic from "next/dynamic";
import { useTranscriptStore } from "@amurex/ui/store";
import { ActionButtons } from "./action-button";
import { DownloadButton } from "./download-button";
const ReactMarkdown = dynamic(() => import("react-markdown"), {
  ssr: false,
});

export const SharedTranscriptContent = () => {
  const { transcript, error, loading } = useTranscriptStore();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090B]">
        <div className="p-6 max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-white">Loading...</h1>
        </div>
      </div>
    );
  }

  if (error || !transcript) {
    return (
      <div className="min-h-screen bg-[#09090B]">
        <div className="p-6 max-w-7xl mx-auto">
          <div className="bg-[#1C1C1E] rounded-lg p-6">
            <h1 className="text-red-500 text-xl mb-4">
              {error || "Meeting not found"}
            </h1>
            <Link
              href="https://amurex.ai"
              className="text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Try Amurex - The AI Meeting Copilot
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="bg-opacity-40 backdrop-blur-sm bg-[#9334E9] lg:bg-transparent px-4 py-2 inline-flex items-center justify-center gap-2 rounded-[8px] text-md font-medium border border-white/10 text-[#FAFAFA] cursor-pointer transition-all duration-200 whitespace-nowrap hover:bg-[#3c1671] hover:border-[#6D28D9] lg:static fixed bottom-4 left-4">
            <a
              href="https://chromewebstore.google.com/detail/amurex-early-preview/dckidmhhpnfhachdpobgfbjnhfnmddmc"
              target="_blank"
              title="Amurex homepage"
              className="flex items-center gap-2"
            >
              <img
                src="/amurex.png"
                alt="Amurex logo"
                className="w-8 h-8 md:w-10 md:h-10 border-2 border-white rounded-full"
              />
              <div className="flex flex-col">
                <span className="font-semibold text-sm lg:text-sm text-white">
                  Amurex
                </span>
                <span className="font-medium text-sm lg:text-sm text-white">
                  The AI Meeting Copilot
                </span>
              </div>
            </a>
          </div>

          <div className="flex items-center gap-2 ml-4 text-sm">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 text-gray-400">
                <Calendar className="h-4 w-4" />
                {transcript.date}
              </span>
              <span className="flex items-center gap-1 text-gray-400">
                <Clock className="h-4 w-4" />
                {transcript.time}
              </span>
            </div>
          </div>

          <ActionButtons />
        </div>

        <div className="bg-[#09090A] rounded-lg border border-zinc-800">
          <div className="p-6 border-b border-zinc-800 hidden lg:block">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-[#9334E9]">
                  <FileText className="h-5 w-5" />
                </div>
                <h1 className="text-2xl font-medium text-white">
                  {transcript.title}
                </h1>
              </div>
              <DownloadButton className="px-4 py-2 inline-flex items-center justify-center gap-2 rounded-md text-md font-medium border border-white/10 bg-[#9334E9] text-[#FAFAFA] cursor-pointer transition-all duration-200 whitespace-nowrap hover:bg-[#3c1671] hover:border-[#6D28D9]">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21 15V16C21 18.2091 19.2091 20 17 20H7C4.79086 20 3 18.2091 3 16V15M12 3V16M12 16L16 11M12 16L8 11"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>Download transcript</span>
              </DownloadButton>
            </div>
          </div>

          {/* Mobile layout */}
          <div className="p-6 border-b border-zinc-800 lg:hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-[#9334E9]">
                  <FileText className="h-5 w-5" />
                </div>
                <h1 className="text-md font-medium text-white">
                  {transcript.title}
                </h1>
              </div>
            </div>
            <div className="flex gap-2 mt-2">
              <DownloadButton className="px-2 py-2 inline-flex items-center justify-center gap-2 rounded-[8px] text-sm font-medium border border-white/10 text-[#FAFAFA] cursor-pointer transition-all duration-200 whitespace-nowrap hover:bg-[#3c1671] hover:border-[#6D28D9]">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21 15V16C21 18.2091 19.2091 20 17 20H7C4.79086 20 3 18.2091 3 16V15M12 3V16M12 16L16 11M12 16L8 11"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>Download transcript</span>
              </DownloadButton>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {transcript.actionItems && (
              <div>
                <h2 className="text-[#9334E9] font-medium mb-3 lg:text-xl text-md">
                  Action Items
                </h2>
                <div className="bg-black rounded-lg p-4 border border-zinc-800">
                  <div
                    className={`text-zinc-300 lg:text-base text-sm ${styles.notesContent}`}
                    style={{ whiteSpace: "normal" }}
                    dangerouslySetInnerHTML={{ __html: transcript.actionItems }}
                  />
                </div>
              </div>
            )}

            {transcript.summary && (
              <div>
                <h2 className="text-[#9334E9] font-medium mb-3 lg:text-xl text-md">
                  Meeting Summary
                </h2>
                <div className="bg-black rounded-lg p-4 border border-zinc-800">
                  <div className="prose text-zinc-300 lg:text-base text-sm bg-default markdown-body">
                    {transcript.summary ? (
                      <ReactMarkdown
                        components={{
                          h3: ({ node, ...props }) => (
                            <h3 className="mb-1 text-lg font-bold" {...props} />
                          ),
                          p: ({ node, ...props }) => (
                            <p className="mb-2" {...props} />
                          ),
                          ul: ({ node, ...props }) => (
                            <ul className="list-disc pl-5 mb-2" {...props} />
                          ),
                          li: ({ node, ...props }) => (
                            <li className="mb-1 ml-4" {...props} />
                          ),
                          strong: ({ node, ...props }) => (
                            <strong className="font-bold" {...props} />
                          ),
                        }}
                      >
                        {transcript.summary}
                      </ReactMarkdown>
                    ) : (
                      "No meeting notes available."
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
