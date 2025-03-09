"use client";

import { useState, useEffect } from "react";
import { Client, Organization, Invoice, AdjustmentItem } from "@/lib/types";
import { apiRequest, HttpMethod } from "@/lib/utils/api-request";
import { Product } from "@/lib/types/product";
import { StudioData } from "@/lib/types/studio-data";

export function useStudio(uuid: string | null) {
  const [data, setData] = useState<StudioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // Fetch base data (clients and products)
        const baseResponse = await fetch("/api/invoice/studio");
        const baseData = await baseResponse.json();

        if (uuid) {
          // If we have an invoiceId, fetch the invoice details
          const invoiceResponse = await fetch(`/api/invoice/studio/${uuid}`);
          const invoiceData = await invoiceResponse.json();

          setData({
            ...baseData,
            invoice: invoiceData.invoice,
          });
        } else {
          setData(baseData);
        }

        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setLoading(false);
      }
    }

    fetchData();
  }, [uuid]);

  return { data, loading, error };
}
