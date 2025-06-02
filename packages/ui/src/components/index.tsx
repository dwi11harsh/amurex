// Shadcn Components
export * from "./ui/button";
export * from "./ui/input";
export * from "./ui/card";
export * from "./ui/icon-toggle";
export * from "./ui/switch";
export * from "./ui/mobile-warning-banner";

// Custom Components
export * from "./Navbar";
export * from "./Searchbar";
export * from "./NoteEditor";
export * from "./star-button";
export * from "./OnboardingFlow";
export * from "./CheckEnables";
export * from "./InputArea";
export * from "./SuggestedPrompts";
export * from "./Query";
export * from "./GPT";
export * from "./Sources";
export * from "./SearchResultComp";
export * from "./GoogleCallbackContent";
export * from "./CallbackStatusView";
export * from "./NotionCallbackContent";
export * from "./EmailContent";
export * from "./VideoEmbed";
export * from "./MeetingsComp";
export * from "./OnboardingContent";
export * from "./ResetPasswordForm";

// lib
// Supabase Client
export * from "../lib/supabaseClient";
// cn function
export * from "../lib/utils";

export const BASE_URL_BACKEND = "https://api.amurex.ai";

export const PROVIDER_ICONS = {
  gmail:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Gmail_icon_%282020%29.svg/2560px-Gmail_icon_%282020%29.svg.png",
};
