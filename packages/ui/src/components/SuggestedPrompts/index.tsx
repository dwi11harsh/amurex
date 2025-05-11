"use client";

import { sendMessage } from "@amurex/ui/lib/send-message";
import { useSearchStore, useSuggestedPromptsStore } from "@amurex/ui/store";

export const SuggestedPrompts = () => {
  const isSearchInitiated = useSearchStore((state) => state.isSearchInitiated);
  const suggestedPrompts = useSuggestedPromptsStore(
    (state) => state.suggestedPrompts,
  );
  const setInputValue = useSearchStore((state) => state.setInputValue);
  return (
    <>
      {!isSearchInitiated && (
        <div className="mt-4 space-y-2">
          <div className="text-zinc-500 text-sm">Suggested searches:</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {suggestedPrompts.length === 0 ? (
              <>
                {[1, 2, 3].map((_, index) => (
                  <div
                    key={index}
                    className="h-[52px] bg-black rounded-lg border border-zinc-800 animate-pulse"
                  >
                    <div className="h-4 bg-zinc-800 rounded w-3/4 m-4"></div>
                  </div>
                ))}
              </>
            ) : (
              <>
                {/* Regular prompts */}
                {suggestedPrompts
                  .filter((item) => item.type === "prompt")
                  .map((item, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setInputValue(item.text);
                        sendMessage(item.text);
                      }}
                      className="px-4 py-2 rounded-lg bg-black border border-zinc-800 text-zinc-300 hover:bg-[#3c1671] transition-colors text-sm text-left"
                    >
                      {item.text}
                    </button>
                  ))}
                {/* Email actions */}
                {suggestedPrompts
                  .filter((item) => item.type === "email")
                  .map((item, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setInputValue(item.text);
                        sendMessage(item.text);
                      }}
                      className="px-4 py-2 rounded-lg bg-black border border-zinc-800 text-zinc-300 hover:bg-[#3c1671] transition-colors text-sm text-left flex items-center justify-between"
                    >
                      <span>{item.text}</span>
                    </button>
                  ))}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};
