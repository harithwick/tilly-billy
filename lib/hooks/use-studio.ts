"use client";

import { useState, useEffect } from "react";
import { StudioData } from "@/lib/types/studio";
import { apiRequest, HttpMethod } from "@/lib/utils/api-request";

export function useStudio(invoiceId?: string | null) {
  const [data, setData] = useState<StudioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStudioData() {
      try {
        setLoading(true);
        const data = await apiRequest<StudioData>({
          endpoint: invoiceId
            ? `/api/invoice/studio/${invoiceId}`
            : "/api/invoice/studio/",
          method: HttpMethod.GET,
        });
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
