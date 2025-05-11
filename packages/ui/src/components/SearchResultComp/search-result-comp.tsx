"use client";

import { useSearchStore } from "@amurex/ui/store";
import { useShallow } from "zustand/shallow";
import { GPT, Query, Sources } from "@amurex/ui/components";
import { Heading } from "./heading";
import { sendMessage } from "@amurex/ui/lib/send-message";

export const SearchResultsComp = () => {
  const { isSearching, searchResults } = useSearchStore(
    useShallow((state) => ({
      isSearching: state.isSearching,
      searchResults: state.searchResult,
    })),
  );
  return (
    <>
      {(isSearching || searchResults?.query) && (
        <div className="space-y-6">
          <Query content={searchResults?.query || ""} />

          <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-6">
            <div>
              <div className="flex justify-between items-center mb-3">
                <Heading content="Answer" />
                {!isSearching && searchResults?.query && (
                  <button
                    onClick={() => sendMessage(searchResults.query)}
                    className="flex items-center gap-1 text-sm text-zinc-300 hover:text-white bg-black border border-zinc-800 hover:border-[#6D28D9] px-3 py-1.5 rounded-md transition-colors"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 489.645 489.645"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M460.656,132.911c-58.7-122.1-212.2-166.5-331.8-104.1c-9.4,5.2-13.5,16.6-8.3,27c5.2,9.4,16.6,13.5,27,8.3
                              c99.9-52,227.4-14.9,276.7,86.3c65.4,134.3-19,236.7-87.4,274.6c-93.1,51.7-211.2,17.4-267.6-70.7l69.3,14.5
                              c10.4,2.1,21.8-4.2,23.9-15.6c2.1-10.4-4.2-21.8-15.6-23.9l-122.8-25c-20.6-2-25,16.6-23.9,22.9l15.6,123.8
                              c1,10.4,9.4,17.7,19.8,17.7c12.8,0,20.8-12.5,19.8-23.9l-6-50.5c57.4,70.8,170.3,131.2,307.4,68.2
                              C414.856,432.511,548.256,314.811,460.656,132.911z"
                      />
                    </svg>
                    Regenerate
                  </button>
                )}
              </div>
              <div className="bg-black rounded-lg p-4 border border-zinc-800 text-zinc-300">
                <GPT content={searchResults?.answer || ""} />
                {isSearching && (
                  <span className="inline-block animate-pulse">▋</span>
                )}
              </div>
            </div>

            {searchResults?.sources?.length &&
              searchResults?.sources?.length > 0 && (
                <div>
                  <Sources content={searchResults.sources} />
                </div>
              )}
          </div>
        </div>
      )}
    </>
  );
};
