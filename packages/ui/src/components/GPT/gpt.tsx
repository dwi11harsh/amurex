"use client";

import { logUserAction } from "@amurex/ui/lib/log-user-action";
import { supabase } from "@amurex/ui/lib/supabaseClient";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { AnchorHTMLAttributes, FC, useEffect, useRef, useState } from "react";
import remarkGfm from "remark-gfm";
const ReactMarkdown = dynamic(() => import("react-markdown"), {
  ssr: false,
});

const fetchSession = async () => {
  const router = useRouter();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    router.push("/web_app/signin");
    return null;
  }
  return session;
};

interface GPTProps {
  content?: string;
}

interface UserSession {
  user: {
    id: string;
  };
}

export const GPT: FC<GPTProps> = ({ content = "" }) => {
  const [showEmailButton, setShowEmailButton] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setShowEmailButton(false);
    setIsComplete(false);

    const isEmailContent =
      content.toLowerCase().includes("subject:") ||
      content.toLowerCase().includes("dear ");
    setShowEmailButton(isEmailContent);

    if (contentRef.current) {
      contentRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [content]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsComplete(!content.endsWith("▋"));
    }, 1000);

    return () => clearTimeout(timer);
  }, [content]);

  const openGmail = async () => {
    try {
      const session = (await fetchSession()) as UserSession;
      await logUserAction(session.user.id, "web_open_email_in_gmail");

      const cleanContent = content
        .replace(/\*\*/g, "")
        .replace(/\*/g, "")
        .replace(/\n\n+/g, "\n\n")
        .replace(/\n/g, "%0A")
        .replace(/\s+/g, " ")
        .trim()
        .replace(/%0A\s+/g, "%0A")
        .replace(/%0A%0A+/g, "%0A%0A");

      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&body=${cleanContent}`;
      window.open(gmailUrl, "_blank");
    } catch (error) {
      console.error("Error opening Gmail:", error);
    }
  };

  return (
    <div
      ref={contentRef}
      className="prose text-base md:text-xl mt-1 w-full break-words prose-p:leading-relaxed"
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) => (
            <a {...props} style={{ color: "blue", fontWeight: "bold" }} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>

      {showEmailButton && isComplete && (
        <button
          onClick={openGmail}
          className="mt-4 px-4 py-2 rounded-lg bg-[#9334E9] text-white hover:bg-[#7928CA] transition-colors flex items-center gap-2"
          type="button"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Gmail_icon_%282020%29.svg/2560px-Gmail_icon_%282020%29.svg.png"
            alt="Gmail"
            className="h-4"
            loading="lazy"
          />
          Open in Gmail
        </button>
      )}
    </div>
  );
};
