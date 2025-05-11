"use client";

import { sendMessage } from "@amurex/ui/lib/send-message";
import Image from "next/image";
import { ChangeEvent, KeyboardEvent } from "react";
import { useSearchStore } from "@amurex/ui/store";
import { useShallow } from "zustand/shallow";

export const InputArea = ({ className = "" }: { className?: string }) => {
  const { inputValue, setInputValue } = useSearchStore(
    useShallow((state) => ({
      inputValue: state.inputValue,
      setInputValue: state.setInputValue,
    })),
  );

  return (
    <div className={`flex items-center ${className}`}>
      <input
        type="text"
        placeholder="Type your search..."
        className="flex-1 p-3 md:p-4 text-sm md:text-base rounded-l-lg focus:outline-none bg-black border border-zinc-800 text-zinc-300"
        value={inputValue}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setInputValue(e.target.value)
        }
        onKeyDown={(e: KeyboardEvent<HTMLInputElement>) =>
          e.key === "Enter" && sendMessage()
        }
      />
      <button
        onClick={() => sendMessage()}
        className="p-3 md:p-4 rounded-r-lg bg-black border-t border-r border-b border-zinc-800 text-zinc-300 hover:bg-[#3c1671] transition-colors"
      >
        <Image sizes="20px" src="/arrow-circle-right.svg" alt="Send" />
      </button>
    </div>
  );
};
