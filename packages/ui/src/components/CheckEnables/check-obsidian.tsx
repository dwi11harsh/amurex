"use client";

import { useConnectionsStore } from "@amurex/ui/store";
import { useShallow } from "zustand/shallow";

export const CheckHasObsidianEnabled = () => {
  const { hasObsidian, obsidianEnabled, setObsidianEnabled } =
    useConnectionsStore(
      useShallow((state) => ({
        hasObsidian: state.hasObsidian,
        obsidianEnabled: state.hasObsidianEnabled,
        setObsidianEnabled: state.setHasObsidianEnabled,
      })),
    );
  return (
    <>
      {!hasObsidian ? (
        <a
          href="/settings?tab=personalization"
          target="_blank"
          className="px-4 py-2 inline-flex items-center justify-center gap-2 rounded-[8px] text-md font-medium border border-white/10 cursor-pointer text-[#FAFAFA] opacity-80 hover:bg-[#3c1671] transition-all duration-200 whitespace-nowrap relative group"
        >
          <img
            src="https://obsidian.md/images/obsidian-logo-gradient.svg"
            alt="Obsidian"
            className="w-4 h-4"
          />
          Obsidian
          <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white text-black px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            Upload Obsidian Files
          </span>
        </a>
      ) : (
        <button
          onClick={() => setObsidianEnabled(!obsidianEnabled)}
          className={`px-2 md:px-4 py-2 inline-flex items-center justify-center gap-1 md:gap-2 rounded-[8px] text-xs md:text-md font-medium border border-white/10 ${
            obsidianEnabled ? "bg-[#9334E9] text-[#FAFAFA]" : "text-[#FAFAFA]"
          } transition-all duration-200 whitespace-nowrap hover:border-[#6D28D9]`}
        >
          <img
            src="https://obsidian.md/images/obsidian-logo-gradient.svg"
            alt="Obsidian"
            className="w-3 h-3 md:w-4 md:h-4"
          />
          Obsidian
          {obsidianEnabled && (
            <svg
              className="w-3 h-3 md:w-4 md:h-4 ml-1"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20 6L9 17L4 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
      )}
    </>
  );
};
