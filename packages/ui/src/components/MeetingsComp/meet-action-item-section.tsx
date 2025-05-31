import React from "react";

interface ActionItemsSectionProps {
  actionItems: string;
  copyActionItemsText: string;
  handleActionItemClick: () => Promise<void>;
  setCopyActionItemsText: (text: string) => void;
}

export const MeetActionItemsSection = ({
  actionItems,
  copyActionItemsText,
  handleActionItemClick,
  setCopyActionItemsText,
}: ActionItemsSectionProps) => {
  return (
    <div onClick={handleActionItemClick}>
      <div className="flex items-center justify-between">
        <h2 className="text-[#6D28D9] font-normal mb-3 lg:text-xl text-md">
          Action Items
        </h2>
      </div>

      <div className="bg-black rounded-lg p-4 border border-zinc-800">
        <div
          className="text-zinc-300 lg:text-base text-sm"
          style={{ whiteSpace: "normal" }}
          dangerouslySetInnerHTML={{ __html: actionItems }}
        />
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          navigator.clipboard.writeText(actionItems);
          setCopyActionItemsText("Copied!");
          setTimeout(() => setCopyActionItemsText("Copy"), 3000);
        }}
        className="mt-4 px-4 py-2 rounded-lg flex items-center justify-center gap-2 text-xs font-medium border border-white/10 bg-zinc-900 text-white transition-all duration-200 hover:border-[#6D28D9]"
      >
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8 4V16C8 17.1046 8.89543 18 10 18H18C19.1046 18 20 17.1046 20 16V7.24853C20 6.77534 19.7893 6.32459 19.4142 6.00001L16.9983 3.75735C16.6232 3.43277 16.1725 3.22205 15.6993 3.22205H10C8.89543 3.22205 8 4.11748 8 5.22205"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
          <path
            d="M16 4V7H19"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
          <path
            d="M4 8V20C4 21.1046 4.89543 22 6 22H14C15.1046 22 16 21.1046 16 20"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
        </svg>
        <span className="text-sm">{copyActionItemsText}</span>
      </button>
    </div>
  );
};
