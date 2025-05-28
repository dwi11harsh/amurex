// NotionCallbackPage.tsx
import {
  NotionCallbackContent,
  NotionLoadingSpinner,
} from "@amurex/ui/components";
import { Suspense } from "react";

export default function NotionCallbackPage() {
  return (
    <Suspense fallback={<NotionLoadingSpinner text="Loading..." />}>
      <NotionCallbackContent />
    </Suspense>
  );
}
