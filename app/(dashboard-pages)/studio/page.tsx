"use client";

import StudioContent from "@/components/studio/studio-content";
import { Suspense } from "react";
import { LoadingState } from "@/components/loading-state";

export default function StudioPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <StudioContent />
    </Suspense>
  );
}
