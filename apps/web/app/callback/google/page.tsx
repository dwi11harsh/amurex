import { GoogleCallbackContent } from "@amurex/ui/components";
import { Suspense } from "react";

// Main page component with Suspense boundary
export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GoogleCallbackContent />
    </Suspense>
  );
}
