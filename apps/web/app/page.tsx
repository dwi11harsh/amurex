import React from "react";
import { Navbar, Searchbar, NoteEditor } from "@amurex/ui/components";
import localFont from "next/font/local";

const louizeFont = localFont({
  src: "../fonts/Louize.ttf",
  variable: "--font-louize",
});

const Home = () => {
  return (
    <>
      <Navbar />
      <div
        className={`${louizeFont.variable} flex flex-col h-screen ml-16`}
        style={{ backgroundColor: "var(--surface-color-2)" }}
      >
        <div
          className="sticky top-0 z-40 w-full bg-opacity-90 backdrop-blur-sm"
          style={{ backgroundColor: "var(--surface-color-2)" }}
        >
          <div className="w-full py-4 px-8 flex justify-between items-center">
            <div className="relative w-full flex items-center">
              <Searchbar />
            </div>
          </div>

          <div className="flex-grow overflow-hidden">
            <NoteEditor />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
