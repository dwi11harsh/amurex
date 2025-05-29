"use client";

import { motion } from "framer-motion";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { CategoriesState, SampleEmail } from "./types";
import { supabase } from "@amurex/ui/lib/supabaseClient";
import { MobileWarningBanner } from "@amurex/ui/components";
import { EmailTaggingCard } from "./email-tagging-card";
import { AnimatePresence } from "framer-motion";
import { CategoriesSettings } from "./categories-settings";
import { ConnectCard } from "./connect-card";
import { EmailPreview } from "./email-preview";

export const EmailsContent = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [isProcessingEmails, setIsProcessingEmails] = useState(false);
  const [emailTaggingEnabled, setEmailTaggingEnabled] = useState(false);
  const [hasEmailRecord, setHasEmailRecord] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [processingComplete, setProcessingComplete] = useState(false);
  const [categories, setCategories] = useState<CategoriesState>({
    categories: {
      to_respond: true,
      fyi: true,
      comment: true,
      notification: true,
      meeting_update: true,
      awaiting_reply: true,
      actioned: true,
    },
    custom_properties: {},
  });

  const sampleEmails: SampleEmail[] = [
    {
      id: 1,
      sender: "Product Team",
      subject: "Need your feedback on this proposal",
      category: "to_respond",
      time: "10:30 AM",
    },
    {
      id: 2,
      sender: "Sanskar Jethi",
      subject: "Boring stakeholder meeting on ROI strategy for Q3",
      category: "fyi",
      time: "Yesterday",
    },
    {
      id: 3,
      sender: "Arsen Kylyshbek",
      subject: "just launched a feature - let's f*cking go!",
      category: "comment",
      time: "Yesterday",
    },
    {
      id: 4,
      sender: "GitHub",
      subject: "Security alert for your repository",
      category: "notification",
      time: "Sep 14",
    },
    {
      id: 5,
      sender: "Zoom",
      subject: "Your meeting with Design Team has been scheduled",
      category: "meeting_update",
      time: "Sep 14",
    },
    {
      id: 6,
      sender: "Alice Bentinck",
      subject: "Re: Invitation - IC",
      category: "awaiting_reply",
      time: "Sep 13",
    },
    {
      id: 7,
      sender: "Marketing",
      subject: "Content calendar approved",
      category: "actioned",
      time: "Sep 12",
    },
  ];

  const filteredEmails = sampleEmails.filter(
    (email) => categories.categories[email.category],
  );

  useEffect(() => {
    const fetchUserId = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user?.id) {
        setUserId(session.user.id);
        fetchCategories(session.user.id);
        fetchEmailTaggingStatus(session.user.id);
        checkEmailRecord(session.user.id);
      }
    };

    fetchUserId();
  }, []);

  const fetchCategories = async (uid: string) => {
    try {
      const response = await fetch(`/api/email-preferences?userId=${uid}`);
      const data = await response.json();
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error("Error fetching email categories:", error);
      toast.error("Failed to load email preferences");
    }
  };

  const fetchEmailTaggingStatus = async (uid: string) => {
    try {
      const { data: userData, error } = await supabase
        .from("users")
        .select("email_tagging_enabled")
        .eq("id", uid)
        .single();

      if (error) throw error;
      setEmailTaggingEnabled(userData.email_tagging_enabled || false);
    } catch (error) {
      console.error("Error fetching email tagging status:", error);
      toast.error("Failed to load email tagging status");
    }
  };

  const checkEmailRecord = async (uid: string) => {
    try {
      const { data, error } = await supabase
        .from("emails")
        .select("id")
        .eq("user_id", uid)
        .limit(1);

      if (error) throw error;
      setHasEmailRecord(!!(data && data.length > 0));
    } catch (error) {
      console.error("Error checking email records:", error);
      setHasEmailRecord(false);
    }
  };

  const handleCategoryToggle = async (
    category: keyof CategoriesState["categories"],
    checked: boolean,
  ) => {
    if (!userId) return;

    try {
      const newCategories = {
        ...categories,
        categories: {
          ...categories.categories,
          [category]: checked,
        },
      };

      const response = await fetch("/api/email-preferences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          categories: newCategories,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setCategories(newCategories);
        toast.success(`${category.replace("_", " ")} category updated`);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Failed to update category");
    }
  };

  const processGmailLabels = async () => {
    if (!userId) return;

    try {
      setIsProcessingEmails(true);
      setProcessingComplete(false);
      const response = await fetch("/api/gmail/process-labels", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          maxEmails: 20,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setProcessingComplete(true);
        toast.success(`Successfully processed ${data.processed} emails`);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error("Error processing Gmail labels:", error);
      toast.error("Failed to process emails");
    } finally {
      setIsProcessingEmails(false);
    }
  };

  const handleGmailConnect = async () => {
    if (!userId) return;

    try {
      setIsProcessingEmails(true);
      const { error } = await supabase
        .from("users")
        .update({ email_tagging_enabled: true })
        .eq("id", userId);

      if (error) throw error;
      setEmailTaggingEnabled(true);
      toast.success("Gmail connected successfully");
    } catch (error) {
      console.error("Error connecting Gmail:", error);
      toast.error("Failed to connect Gmail");
    } finally {
      setIsProcessingEmails(false);
    }
  };

  const handleEmailTaggingToggle = async (checked: boolean) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from("users")
        .update({ email_tagging_enabled: checked })
        .eq("id", userId);

      if (error) throw error;
      setEmailTaggingEnabled(checked);
      toast.success(
        checked ? "Email tagging enabled" : "Email tagging disabled",
      );
    } catch (error) {
      console.error("Error updating email tagging status:", error);
      toast.error("Failed to update email tagging status");
    }
  };

  const handleEmailClick = (sender: string) => {
    if (sender === "Sanskar Jethi") {
      window.open("https://www.linkedin.com/in/sanskar123/", "_blank");
    } else if (sender === "Arsen Kylyshbek") {
      window.open("https://www.linkedin.com/in/arsenkk/", "_blank");
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <MobileWarningBanner />
      <div className="content p-8">
        <div
          className={`${showPreview ? "w-[60%]" : "w-full"} transition-all duration-500`}
        >
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-medium text-white">Emails</h2>
          </div>
          <p className="text-sm text-zinc-400 mb-6">
            Automated email categorization to keep your inbox focused on
            important messages
          </p>

          <a href="/search" rel="noopener noreferrer">
            <div className="my-2 bg-zinc-800/80 rounded-xl flex items-center px-3 py-2 cursor-text hover:bg-zinc-700 transition-colors border border-white/10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-zinc-400 mr-2"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <div className="text-zinc-400 text-md">Search in emails...</div>
            </div>
          </a>

          <EmailTaggingCard
            emailTaggingEnabled={emailTaggingEnabled}
            isProcessingEmails={isProcessingEmails}
            processingComplete={processingComplete}
            onToggle={handleEmailTaggingToggle}
            onProcess={processGmailLabels}
            showPreview={showPreview}
            onTogglePreview={() => setShowPreview(!showPreview)}
          />

          <AnimatePresence>
            {emailTaggingEnabled && hasEmailRecord ? (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <div className="hidden bg-black rounded-lg p-4 mb-6 flex items-start gap-3">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-gray-400 mt-1"
                  >
                    <path
                      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 16V12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 8H12.01"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-gray-400">
                    If you switch a category off here, emails in that category
                    will be filed away in their folder or label, and won&apos;t
                    be shown in your main inbox.
                  </span>
                </div>

                <CategoriesSettings
                  categories={categories}
                  onToggle={handleCategoryToggle}
                />
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <ConnectCard />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {showPreview && (
            <EmailPreview
              emails={sampleEmails}
              categories={categories}
              onEmailClick={handleEmailClick}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
