import { Button, IconToggle, PROVIDER_ICONS } from "@amurex/ui/components";
import { EmailTaggingCardProps } from "./types";

export const EmailTaggingCard: React.FC<EmailTaggingCardProps> = ({
  emailTaggingEnabled,
  isProcessingEmails,
  processingComplete,
  onToggle,
  onProcess,
  showPreview,
  onTogglePreview,
}) => (
  <div className="rounded-xl border text-card-foreground shadow bg-black/80 border-white/10 mb-6">
    <div className="flex flex-col">
      <div className="flex flex-row justify-between gap-2 border-b border-white/10 bg-zinc-800/50 rounded-t-xl">
        <div className="flex items-center gap-4 px-6 py-4">
          <img src={PROVIDER_ICONS.gmail} alt="Gmail" className="hidden w-8" />
          <div>
            <h2 className="font-medium text-white text-[14px]">
              Categorize emails with AI
            </h2>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="hidden text-white text-sm">
                Enable email tagging
              </span>
              <IconToggle checked={emailTaggingEnabled} onChange={onToggle} />
            </div>
          </div>
        </div>
        {emailTaggingEnabled && (
          <div className="flex items-center gap-2 mx-6">
            <Button
              variant="outline"
              className="text-xs font-medium bg-[#3c1671] text-white hover:bg-[#3c1671] hover:border-[#6D28D9] border border-white/10 px-4 py-2"
              onClick={onProcess}
              disabled={isProcessingEmails}
            >
              {isProcessingEmails ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-3 mr-2"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.3" />
                  </svg>
                  Categorize new emails
                </div>
              )}
            </Button>
            {processingComplete && (
              <Button
                variant="outline"
                className="text-xs font-normal bg-[#3c1671] text-white hover:bg-[#3c1671] hover:border-[#6D28D9] border border-white/10 px-4 py-2"
                onClick={() => window.open("https://mail.google.com", "_blank")}
              >
                <div className="flex items-center">
                  <img
                    src={PROVIDER_ICONS.gmail}
                    alt="Gmail"
                    className="w-3 mr-2"
                  />
                  Open Gmail
                </div>
              </Button>
            )}
          </div>
        )}
        <div
          className="hidden flex items-center mx-6 gap-2 px-3 py-1 bg-zinc-700 rounded-md cursor-pointer hover:bg-zinc-900 transition-colors h-fit my-auto"
          onClick={onTogglePreview}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="hidden h-4 w-4 text-black"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path
              fillRule="evenodd"
              d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
              clipRule="evenodd"
            />
          </svg>
          <img src={PROVIDER_ICONS.gmail} alt="Gmail" className="w-6 mr-2" />
          <span className="text-white text-lg">
            {showPreview ? "Hide Preview" : "Show Preview"}
          </span>
        </div>
      </div>
    </div>
  </div>
);
