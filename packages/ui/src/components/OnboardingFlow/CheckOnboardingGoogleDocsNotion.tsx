"use client";

import { useShowOnboarding } from "@repo/ui/store";
import { useShallow } from "zustand/shallow";

export const ConnectDocsOrNotionPopup = () => {
  const { showOnboarding, hasGoogleDocs, hasNotion } = useShowOnboarding(
    useShallow((state) => ({
      showOnboarding: state.showOnboarding,
      hasGoogleDocs: state.hasGoogleDocs,
      hasNotion: state.hasNotion,
    })),
  );
  return (
    <>
      {!showOnboarding && !hasGoogleDocs && !hasNotion && (
        <div className="bg-[#1E1E24] rounded-lg border border-zinc-800 p-4 mb-4 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-3 mb-3 md:mb-0">
            <div className="bg-[#9334E9] rounded-full p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <p className="text-zinc-300">
              Connect your Google Docs or Notion to get the most out of Amurex
            </p>
          </div>
          <a
            href="/settings?tab=personalization"
            className="inline-flex items-center justify-center px-4 py-2 bg-[#9334E9] text-white rounded-lg hover:bg-[#7928CA] transition-colors"
          >
            Connect Accounts
          </a>
        </div>
      )}
    </>
  );
};
