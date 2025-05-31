"use client";
import { useEffect } from "react";
import Link from "next/link";
import { useTranscriptStore } from "@amurex/ui/store";
import {
  FileText,
  MeetActionItemsSection,
  MeetChatSidebar,
  MeetErrorDisplay,
  MeetHeader,
  MeetingSummarySection,
  MeetLoadingSpinner,
  MeetPreviewModal,
  MeetShareModal,
} from "@amurex/ui/components";

interface TranscriptDetailProps {
  params: {
    id: string;
  };
}

export default function TranscriptDetail({ params }: TranscriptDetailProps) {
  const {
    loading,
    error,
    transcript,
    isModalOpen,
    isPreviewModalOpen,
    isChatOpen,
    chatMessages,
    chatInput,
    isSending,
    copyButtonText,
    copyActionItemsText,
    copyMeetingSummaryText,
    emails,
    emailInput,
    isMobile,
    sharedWith,
    previewContent,
    isLoadingPreview,
    init,
    setEmailInput,
    setEmails,
    setChatInput,
    setIsChatOpen,
    setIsModalOpen,
    setIsPreviewModalOpen,
    setCopyActionItemsText,
    setCopyMeetingSummaryText,
    fetchSession,
    logUserAction,
    fetchTranscript,
    fetchMemoryStatus,
    toggleModal,
    validateEmail,
    handleEmailInputKeyDown,
    addEmail,
    removeEmail,
    sendEmails,
    handleCopyLink,
    handleDownload,
    handleActualDownload,
    handleActionItemClick,
    handleSummaryClick,
    handleChatSubmit,
  } = useTranscriptStore();

  useEffect(() => {
    init(params);
  }, [params, init]);

  if (loading) {
    return <MeetLoadingSpinner />;
  }

  if (error || !transcript) {
    return <MeetErrorDisplay error={error} />;
  }

  return (
    <>
      <div className="min-h-screen bg-black">
        <div className="p-6 mx-auto">
          <MeetShareModal
            isOpen={isModalOpen}
            title={transcript.title}
            emailInput={emailInput}
            emails={emails}
            sharedWith={sharedWith}
            copyButtonText={copyButtonText}
            validateEmail={validateEmail}
            handleEmailInputChange={(e) => setEmailInput(e.target.value)}
            handleEmailInputKeyDown={handleEmailInputKeyDown}
            addEmail={addEmail}
            removeEmail={removeEmail}
            sendEmails={sendEmails}
            handleCopyLink={handleCopyLink}
            toggleModal={toggleModal}
            paramsId={params.id}
          />

          <MeetPreviewModal
            isOpen={isPreviewModalOpen}
            isLoading={isLoadingPreview}
            previewContent={previewContent}
            title={transcript.title}
            handleActualDownload={handleActualDownload}
            closeModal={() => setIsPreviewModalOpen(false)}
          />

          <MeetChatSidebar
            isOpen={isChatOpen}
            chatMessages={chatMessages}
            chatInput={chatInput}
            isSending={isSending}
            handleDownload={handleDownload}
            closeChat={() => setIsChatOpen(false)}
            setChatInput={setChatInput}
            handleChatSubmit={handleChatSubmit}
          />

          <div
            className={`transition-all duration-300 ${isChatOpen ? "mr-[450px]" : ""}`}
          >
            <MeetHeader
              memoryEnabled={useTranscriptStore.getState().memoryEnabled}
              date={transcript.date}
              time={transcript.time}
            />

            <div className="bg-black rounded-xl border border-zinc-800">
              <div className="p-6 border-b border-zinc-800 hidden lg:block">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="hidden text-[#6D28D9]">
                      <FileText className="h-5 w-5" />
                    </div>
                    <h1 className="text-2xl font-medium text-white">
                      {transcript.title}
                    </h1>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className={`${isChatOpen ? "hidden" : ""} bg-[#6D28D9] lg:px-4 lg:py-2 px-2 py-2 inline-flex items-center justify-center gap-2 rounded-lg text-md font-normal border border-white/10 text-[#FAFAFA] cursor-pointer transition-all duration-200 whitespace-nowrap hover:bg-[#3c1671] hover:border-[#6D28D9]`}
                      onClick={() => setIsChatOpen(true)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                      </svg>
                      Chat with the meeting
                    </button>
                  </div>
                </div>
              </div>

              {/* Mobile layout */}
              <div className="p-6 border-b border-zinc-800 lg:hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-[#9334E9]">
                      <FileText className="h-5 w-5" />
                    </div>
                    <h1 className="text-md font-medium text-white">
                      {transcript.title}
                    </h1>
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  <button
                    className="px-2 py-2 inline-flex items-center justify-center gap-2 rounded-[8px] text-sm font-medium border border-white/10 bg-[#9334E9] text-[#FAFAFA] cursor-pointer transition-all duration-200 whitespace-nowrap hover:bg-[#3c1671] hover:border-[#6D28D9]"
                    onClick={toggleModal}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 12v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6" />
                      <polyline points="16 6 12 2 8 6" />
                      <line x1="12" y1="2" x2="12" y2="15" />
                    </svg>
                    <span>Share link</span>
                  </button>

                  <button
                    className="px-2 py-2 inline-flex items-center justify-center gap-2 rounded-[8px] text-sm font-medium border border-white/10 text-[#FAFAFA] cursor-pointer transition-all duration-200 whitespace-nowrap hover:bg-[#3c1671] hover:border-[#6D28D9]"
                    onClick={handleDownload}
                  >
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M21 15V16C21 18.2091 19.2091 20 17 20H7C4.79086 20 3 18.2091 3 16V15M12 3V16M12 16L16 11M12 16L8 11"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>Download transcript</span>
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {transcript.actionItems && (
                  <MeetActionItemsSection
                    actionItems={transcript.actionItems}
                    copyActionItemsText={copyActionItemsText}
                    handleActionItemClick={handleActionItemClick}
                    setCopyActionItemsText={setCopyActionItemsText}
                  />
                )}

                {transcript.summary && (
                  <MeetingSummarySection
                    summary={transcript.summary}
                    copyMeetingSummaryText={copyMeetingSummaryText}
                    handleSummaryClick={handleSummaryClick}
                    setCopyMeetingSummaryText={setCopyMeetingSummaryText}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
