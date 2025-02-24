"use client";

import StudioContent from "@/components/studio/studio-content";
import { Suspense } from "react";
import { LoadingState } from "@/components/loading-state";

export default function StudioPage({ params }: { params: { uuid: string } }) {
  return (
    <Suspense fallback={<LoadingState />}>
      <StudioContent uuid={params.uuid} />
    </Suspense>
  );
}
