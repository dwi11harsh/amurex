import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useOnboardingStore } from "@amurex/ui/store";
import { OnboardHeader } from "./onboard-header";
import { OnboardGmailConnect } from "./onboard-gmail-connect";
import { OnboardKnowledgeSources } from "./onboard-knowledge-sources";

export const OnboardingContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    currentStep,
    authCompleted,
    isProcessingEmails,
    enableEmailTagging,
    startCompleteImportProcess,
  } = useOnboardingStore();

  useEffect(() => {
    const connectionStatus = searchParams.get("connection");
    if (connectionStatus === "success") {
      if (localStorage.getItem("pendingGmailConnect") === "true") {
        localStorage.removeItem("pendingGmailConnect");
        toast.success("Gmail connected successfully!");
        enableEmailTagging();
        useOnboardingStore.getState().triggerFakeAnimation();
      } else if (localStorage.getItem("pendingGoogleDocsImport") === "true") {
        localStorage.removeItem("pendingGoogleDocsImport");
        toast.success("Google Docs connected successfully!");
        startCompleteImportProcess(router);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    useOnboardingStore.getState().checkGoogleConnection();
    useOnboardingStore.getState().checkNotionConnection();
    useOnboardingStore.getState().checkGoogleDocsConnection();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <OnboardHeader />
      <div className="flex-1 flex flex-col items-center justify-center max-w-5xl mx-auto px-4">
        {currentStep === 1 && <OnboardGmailConnect />}
        {currentStep === 2 && <OnboardKnowledgeSources />}
        {authCompleted && !isProcessingEmails && <OnboardGmailConnect />}
      </div>
    </div>
  );
};
