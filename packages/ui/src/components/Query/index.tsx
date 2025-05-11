"use client";

import { useSearchStore } from "@repo/ui/store";

export const Query = ({ content = "" }) => {
  const sourcesTime = useSearchStore((state) => state.sourceTime);
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between">
      <div className="text-xl md:text-3xl font-medium text-white">
        {content}
      </div>
      <div className="text-sm text-zinc-500 mt-1 md:mt-0 flex flex-col md:items-end">
        {sourcesTime && (
          <div className="px-2 py-1 rounded-md bg-[#9334E9] text-white w-fit">
            Searched in {sourcesTime} seconds
          </div>
        )}
      </div>
    </div>
  );
};
