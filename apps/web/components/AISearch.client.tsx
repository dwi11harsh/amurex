"use client";

import { MobileWarningBanner } from "@amurex/ui/components";
import { useSearchStore } from "@amurex/ui/store";

export const AISearchClient = () => {
  const { isSearchInitiated } = useSearchStore();
  return (
    <>
      <MobileWarningBanner />
      <div
        className={`min-h-screen bg-black ${isSearchInitiated ? "" : ""}`}
      ></div>
    </>
  );
};
