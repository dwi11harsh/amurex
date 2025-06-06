"use client";

import Image from "next/Image";
import { useRouter } from "next/navigation";
import { Button } from "@amurex/ui/components";
import { Home, Search, Settings } from "lucide-react";

export const Navbar = () => {
  const router = useRouter();

  // TODO: ADD FUNCTIONALITIES

  return (
    <aside
      className="hidden lg:flex w-16 shadow-md flex-col justify-between items-center py-4 fixed h-full z-50 border-r border-zinc-800"
      style={{ backgroundColor: "black" }}
    >
      <span className="text-4xl" role="img" aria-label="Amurex logo">
        <Image
          src="/amurex.png"
          alt="Amurex logo"
          width={100}
          height={100}
          className="w-10 h-10 border-2 border-black rounded-full"
          style={{ color: "var(--color-4)" }}
        />
      </span>
      <div className="flex flex-col items-center space-y-8 mb-4">
        <div className="relative group">
          <Button
            variant="navbar"
            size="icon"
            onClick={() => router.push("/chat")}
          >
            <Search className="h-6 w-6" style={{ color: "var(--color-4)" }} />
          </Button>
          <span className="absolute left-12 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white">
            Chat
          </span>
        </div>
        <div className="relative group">
          <Button
            variant="navbar"
            size="icon"
            onClick={() => router.push("/meetings")}
          >
            <Home className="h-6 w-6" style={{ color: "var(--color-4)" }} />
          </Button>
          <span className="absolute left-12 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white">
            Meetings
          </span>
        </div>
        <div className="relative group">
          <Button
            variant="navbar"
            size="icon"
            onClick={() => router.push("/settings?tab=personalization")}
          >
            <Settings className="h-6 w-6" style={{ color: "var(--color-4)" }} />
          </Button>
          <span className="absolute left-12 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white">
            Settings
          </span>
        </div>
      </div>
    </aside>
  );
};
