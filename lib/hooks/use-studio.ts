"use client";

import { useState, useEffect } from "react";
import { StudioData } from "@/lib/types/studio";

export function useStudio(invoiceId?: string | null) {
  const [data, setData] = useState<StudioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStudioData() {
      try {
        setLoading(true);
        let url = new URL("/api/studio/", window.location.origin);
        if (invoiceId) {
          url = new URL(`/api/studio/${invoiceId}`, window.location.origin);
        }

        const response = await fetch(url, {
          cache: "no-store",
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch studio data");
        }

        const data = await response.json();

        setData(data);
      } catch (err) {
        console.error("Error fetching studio data:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch studio data"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchStudioData();
  }, [invoiceId]);

  return { data, loading, error };
}
