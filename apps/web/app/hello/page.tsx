import { VideoEmbed, VideoEmbedHeader } from "@amurex/ui/components";
import React from "react";

export default function HelloPage() {
  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        <div className="container mx-auto p-8">
          <VideoEmbedHeader />
          <VideoEmbed />
        </div>
      </div>
    </div>
  );
}
