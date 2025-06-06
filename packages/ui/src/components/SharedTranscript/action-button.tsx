"use client";

import { useSharedTranscriptStore } from "@amurex/ui/store";

export const ActionButtons = () => {
  const { isLoggedIn, handleTryClick, handleSignInClick } =
    useSharedTranscriptStore();

  return (
    <div className="flex items-center gap-2 ml-4">
      {!isLoggedIn && (
        <a
          id="try-button"
          onClick={handleTryClick}
          className="hidden lg:block z-0 rounded-[8px] bg-[#9334E9] border border-[#9334E9] px-4 py-2 text-md font-medium text-white shadow-sm hover:bg-[#3c1671] hover:border hover:border-[#9334E9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400 ml-2 transition duration-300 cursor-pointer"
        >
          Try Now
        </a>
      )}

      <a
        id="signin-button"
        onClick={handleSignInClick}
        className="z-0 rounded-[8px] border-solid border border-[#9334E9] px-4 py-2 text-md font-medium text-white shadow-sm hover:bg-[#3c1671] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400 ml-2 transition duration-300 cursor-pointer"
      >
        {isLoggedIn ? "My Meetings" : "Sign In"}
      </a>
    </div>
  );
};
