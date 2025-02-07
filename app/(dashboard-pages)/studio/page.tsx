"use client";

import StudioContent from "@/lib/components/studio/studio-content";
import { Suspense } from "react";
import { LoadingState } from "@/lib/components/loading-state";

export default function StudioPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <StudioContent />
    </Suspense>
  );
}
