"use client";

import { BellRing } from "lucide-react";
import { useTranscriptStore } from "@amurex/ui/store";
import { Switch } from "@amurex/ui/components";

export const EmailNotificationToggle = () => {
  const { emailNotificationsEnabled, handleEmailNotificationsToggle } =
    useTranscriptStore();

  return (
    <div className="flex items-center gap-2">
      <BellRing className="w-5 h-5 text-white" />
      <div className="text-white hidden sm:block">
        Email notes after meetings
      </div>
      <Switch
        checked={emailNotificationsEnabled}
        onCheckedChange={handleEmailNotificationsToggle}
        className="data-[state=checked]:bg-[#9334E9]"
      />
    </div>
  );
};
