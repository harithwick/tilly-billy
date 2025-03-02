"use client";

import StudioContent from "@/components/studio/studio-content";
import { Suspense } from "react";
import { LoadingState } from "@/components/loading-state";
import { useParams } from "next/navigation";
export default function StudioPage() {
  const params = useParams<{ uuid: string }>();

  return (
    <Suspense fallback={<LoadingState />}>
      <StudioContent uuid={params.uuid} />
    </Suspense>
  );
}
