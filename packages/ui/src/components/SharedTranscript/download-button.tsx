"use client";

import { useSharedTranscriptStore } from "@amurex/ui/store";

interface DownloadButtonProps {
  className: string;
  children: React.ReactNode;
}

export const DownloadButton = ({
  className,
  children,
}: DownloadButtonProps) => {
  const { handleDownload } = useSharedTranscriptStore();

  return (
    <button
      id="download-transcript"
      className={className}
      onClick={handleDownload}
    >
      {children}
    </button>
  );
};
