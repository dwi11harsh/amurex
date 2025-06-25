import { useSearchStore } from "@amurex/ui/store";

export const SpotlightSearch = () => {
  const {
    messageHistory,
    setMessageHistory,
    session,
    setSession,
    inputValue: spotlightInputValue,
    setSpotlightInputValue: setSpotlightInputValue,
    showSpotlight: isVisible,
    setShowSpotlight,
    suggestedPrompts,
    showGoogleDocs,
    setShowGoogleDocs,
    showNotion,
    setShowNotion,
    showMeetings,
    setShowMeetings,
    showObsidian,
    setShowObsidian,
    showGmail,
    setShowGmail,
    hasGoogleDocs,
    hasNotion,
    hasObsidian,
    hasMeetings,
    hasGmail,
    handleGoogleDocsClick,
    handleNotionClick,
    handleMeetingsClick,
    handleObsidianClick,
    handleGmailClick,
    gmailProfiles,
    handleSpotlightSearch,
    searchResults,
    setSearchResults,
  } = useSearchStore();

  const onClose = () => {
    setShowSpotlight(false);
  };

  const onSearch = () => {
    handleSpotlightSearch();
  };
};
