"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect } from "react";
const ReactMarkdown = dynamic(() => import("react-markdown"), {
  ssr: false,
});

interface SourceItem {
  type: "meeting" | "email" | "google_docs" | "notion" | "obsidian";
  message_id?: string;
  thread_id?: string;
  url?: string;
  id?: string;
  title?: string;
  text?: string;
  sender?: string;
  received_at?: string;
  platform_id?: string;
}

interface SourcesProps {
  content?: SourceItem[];
}

export const Sources = ({ content = [] }: SourcesProps) => {
  useEffect(() => {
    console.log("Sources content:", content);
  }, [content]);

  const createGmailUrl = (source: SourceItem) => {
    if (source.message_id) {
      return `https://mail.google.com/mail/u/0/#inbox/${source.message_id}`;
    } else if (source.thread_id) {
      return `https://mail.google.com/mail/u/0/#inbox/${source.thread_id}`;
    }
    return source.url || `/emails/${source.id}`;
  };

  if (!content || content.length === 0) {
    return (
      <div>
        <div className="text-[#9334E9] font-medium mb-3 text-md md:text-xl flex items-center gap-2">
          <Image
            height={20}
            width={20}
            src="/git-branch.svg"
            alt="Git"
            className="md:w-6 md:h-6"
          />
          <span>Sources</span>
        </div>
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map((_, index) => (
            <div
              key={index}
              className="bg-black rounded-lg p-4 border border-zinc-800"
            >
              <div className="h-4 bg-zinc-800 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-zinc-800 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="text-[#9334E9] font-medium mb-3 text-md md:text-xl flex items-center gap-2">
        <Image
          height={20}
          width={20}
          src="/git-branch.svg"
          alt="Git"
          className="md:w-6 md:h-6"
        />
        <span>Sources</span>
      </div>
      <div className="grid grid-cols-1 gap-2">
        {Array.isArray(content) &&
          content.map((source, index) => {
            console.log(`Source ${index}:`, source);

            if (source.type === "meeting") {
              let platform = "teams";
              try {
                if (
                  source.platform_id &&
                  typeof source.platform_id === "string"
                ) {
                  platform = source.platform_id.includes("-")
                    ? "google"
                    : "teams";
                }
              } catch (error) {
                console.error("Error determining platform:", error);
              }

              return (
                <a
                  key={index}
                  href={source.url}
                  className="block"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="bg-black rounded-lg p-4 border border-zinc-800 hover:border-[#6D28D9] transition-colors h-[160px] relative">
                    <Image
                      src="/link.svg"
                      alt="Link"
                      height={16}
                      width={16}
                      className="absolute top-4 right-4 w-4 h-4 text-zinc-500"
                    />
                    <div className="text-zinc-300 text-sm font-medium mb-2 flex items-center gap-2">
                      {platform === "google" ? (
                        <img
                          src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Google_Meet_icon_%282020%29.svg/1024px-Google_Meet_icon_%282020%29.svg.png?20221213135236"
                          alt="Google Meet"
                          className="w-8"
                        />
                      ) : (
                        <img
                          src="https://www.svgrepo.com/show/303180/microsoft-teams-logo.svg"
                          alt="Microsoft Teams"
                          className="w-8"
                        />
                      )}
                      {source.title}
                    </div>
                    <div className="text-zinc-500 text-xs overflow-hidden line-clamp-4">
                      <ReactMarkdown>{source.text}</ReactMarkdown>
                    </div>
                  </div>
                </a>
              );
            } else if (source.type === "email") {
              const gmailUrl = createGmailUrl(source);

              return (
                <a
                  key={index}
                  href={gmailUrl}
                  className="block"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="bg-black rounded-lg p-4 border border-zinc-800 hover:border-[#6D28D9] transition-colors h-[160px] relative">
                    <Image
                      src="/link.svg"
                      alt="Link"
                      height={16}
                      width={16}
                      className="absolute top-4 right-4 w-4 h-4 text-zinc-500"
                    />
                    <div className="text-zinc-300 text-sm font-medium mb-2 flex items-center gap-2">
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Gmail_icon_%282020%29.svg/2560px-Gmail_icon_%282020%29.svg.png"
                        alt="Gmail"
                        className="w-6 flex-shrink-0"
                      />
                      <div className="flex flex-col overflow-hidden">
                        <span className="truncate font-medium max-w-full">
                          {source.title}
                        </span>
                        <span className="text-xs text-zinc-400 truncate max-w-full">
                          {source.sender}
                        </span>
                        {source.received_at && (
                          <span className="text-xs text-zinc-500">
                            {new Date(source.received_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-zinc-500 text-xs overflow-hidden line-clamp-4">
                      {source.text}
                    </div>
                  </div>
                </a>
              );
            } else {
              let icon = null;
              if (source.type === "google_docs") {
                icon = (
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/0/01/Google_Docs_logo_%282014-2020%29.svg"
                    alt="Google Docs"
                    className="w-6 h-6"
                  />
                );
              } else if (source.type === "notion") {
                icon = (
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png"
                    alt="Notion"
                    className="w-6 h-6"
                  />
                );
              } else if (source.type === "obsidian") {
                icon = (
                  <img
                    src="https://obsidian.md/images/obsidian-logo-gradient.svg"
                    alt="Obsidian"
                    className="w-6 h-6"
                  />
                );
              }

              return (
                <a
                  key={index}
                  href={source.url}
                  className="block"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="bg-black rounded-lg p-4 border border-zinc-800 hover:border-[#6D28D9] transition-colors h-[160px] relative">
                    <Image
                      src="/link.svg"
                      alt="Link"
                      height={16}
                      width={16}
                      className="absolute top-4 right-4 w-4 h-4 text-zinc-500"
                    />
                    <div className="text-zinc-300 text-sm font-medium mb-2 flex items-center gap-2">
                      {icon}
                      <span className="truncate">
                        {source.title || "Document"}
                      </span>
                    </div>
                    <div className="text-zinc-500 text-xs overflow-hidden line-clamp-4">
                      <ReactMarkdown>{source.text}</ReactMarkdown>
                    </div>
                  </div>
                </a>
              );
            }
          })}
      </div>
    </div>
  );
};
