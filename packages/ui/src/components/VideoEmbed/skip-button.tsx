"use client";

import Link from "next/link";

export const SkipButton = () => {
  return (
    <Link
      href="/search"
      className="px-4 py-2 inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium border border-white/10 bg-[#9334E9] text-[#FAFAFA] cursor-pointer transition-all duration-200 whitespace-nowrap hover:bg-[#3c1671] hover:border-[#6D28D9]"
    >
      Skip Onboarding
    </Link>
  );
};
