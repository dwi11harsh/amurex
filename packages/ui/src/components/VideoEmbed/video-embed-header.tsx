import { SkipButton } from "./skip-button";

export const VideoEmbedHeader = () => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-medium text-white">Welcome to Amurex!</h1>
        <p className="text-zinc-400 mt-2">
          This is a quick tour that will help you get started with Amurex
        </p>
      </div>
      <SkipButton />
    </div>
  );
};
