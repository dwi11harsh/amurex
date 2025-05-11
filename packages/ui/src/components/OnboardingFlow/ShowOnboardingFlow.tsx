"use client";

import { useShowOnboarding } from "@amurex/ui/store";
import { OnboardingFlow } from "./OnboardingFlow";

export const ShowOnboardingFlow = () => {
  const { showOnboarding, setShowOnboarding } = useShowOnboarding(
    (state) => state,
  );
  return <>{showOnboarding && <OnboardingFlow />}</>;
};
