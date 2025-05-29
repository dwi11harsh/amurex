"use client";

import { EmailsContent } from "@amurex/ui/components";
import { Suspense } from "react";

export default function EmailsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EmailsContent />
    </Suspense>
  );
}
