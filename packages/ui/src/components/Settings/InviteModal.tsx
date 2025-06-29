"use client";

import { useSettingsStore } from "@amurex/ui/store";
import { Minus, Plus } from "lucide-react";

export const InviteModal = () => {
  const {
    isInviteModalOpen,
    teamName,
    emailInput,
    handleEmailInputChange,
    isMobile,
    handleEmailInputKeyDown,
    addEmail,
    emails,
    removeEmail,
    sendInvites,
    copyButtonText,
    setIsInviteModalOpen,
    handleCopyInviteLink,
    teamInviteCode,
  } = useSettingsStore();
  return (
    <>
      {isInviteModalOpen && (
        <div className="px-2 fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-black bg-opacity-40 backdrop-blur-sm p-8 rounded-lg shadow-lg border border-white/20">
            <h2 className="lg:text-xl text-md font-medium mb-4 text-white">
              Invite members to <b>{teamName}</b>
            </h2>

            <div className="mt-4">
              <p className="text-white lg:text-md text-sm font-semibold">
                Send invites via email
              </p>
              <div className="flex items-center">
                <input
                  type="text"
                  value={emailInput}
                  onChange={handleEmailInputChange}
                  onKeyDown={isMobile ? undefined : handleEmailInputKeyDown}
                  placeholder={
                    isMobile ? "Enter emails" : "Enter emails and press enter"
                  }
                  className="w-full mt-2 p-2 border rounded bg-transparent text-white text-sm lg:text-md"
                />
                {isMobile && (
                  <button
                    onClick={addEmail}
                    className="ml-2 mt-2 p-2 bg-[#9334E9] text-white rounded"
                  >
                    <Plus />
                  </button>
                )}
              </div>

              {emails.length > 0 && (
                <ul className="mt-2 text-white">
                  <li className="font-semibold lg:text-md text-sm">
                    New invites
                  </li>
                  {emails.map((email, index) => (
                    <li
                      key={index}
                      className="lg:text-md text-sm bg-[#27272A] p-2 rounded mt-1 flex justify-between items-center w-min"
                    >
                      {email}
                      <button
                        onClick={() => removeEmail(index)}
                        className="ml-2 p-1 bg-[#9334E9] text-white rounded"
                      >
                        <Minus />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <button
                className="mt-2 lg:px-4 lg:py-2 px-2 py-2 inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium border border-white/10 bg-[#9334E9] text-[#FAFAFA] cursor-pointer transition-all duration-200 whitespace-nowrap hover:bg-[#3c1671] hover:border-[#6D28D9]"
                onClick={sendInvites}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-send"
                >
                  <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" />
                  <path d="m21.854 2.147-10.94 10.939" />
                </svg>
                <span>Send Invites</span>
              </button>
            </div>

            <div className="mt-6">
              <p className="text-white lg:text-md text-sm font-semibold">
                Or copy the invite URL
              </p>
              <input
                type="text"
                value={`${window.location.host}/teams/join/${teamInviteCode}`}
                readOnly
                className="w-full mt-2 p-2 border rounded bg-transparent text-white lg:text-md text-sm"
              />
              <button
                className="mt-2 lg:px-4 lg:py-2 px-2 py-2 inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium border border-white/10 bg-[#9334E9] text-[#FAFAFA] cursor-pointer transition-all duration-200 whitespace-nowrap hover:bg-[#3c1671] hover:border-[#6D28D9]"
                onClick={handleCopyInviteLink}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8 4V16C8 17.1046 8.89543 18 10 18H18C19.1046 18 20 17.1046 20 16V7.24853C20 6.77534 19.7893 6.32459 19.4142 6.00001L16.9983 3.75735C16.6232 3.43277 16.1725 3.22205 15.6993 3.22205H10C8.89543 3.22205 8 4.11748 8 5.22205"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M16 4V7H19"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M4 8V20C4 21.1046 4.89543 22 6 22H14C15.1046 22 16 21.1046 16 20"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>{copyButtonText}</span>
              </button>
            </div>

            <div className="flex justify-end mt-6">
              <button
                className="px-4 py-2 inline-flex items-center justify-center gap-2 rounded-md text-md font-medium border border-white/10 text-[#FAFAFA] cursor-pointer transition-all duration-200 whitespace-nowrap hover:bg-[#3c1671] hover:border-[#6D28D9]"
                onClick={() => setIsInviteModalOpen(false)}
              >
                <span>Done</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
