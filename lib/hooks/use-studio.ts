"use client";

import { useState, useEffect } from "react";
import { Client, Organization, Invoice } from "@/lib/types";
import { apiRequest, HttpMethod } from "@/lib/utils/api-request";

interface StudioData {
  invoice?: {
    id: string;
    issueDate: string;
    paymentTerms: string;
    notes: string;
    terms: string;
    client: Client;
    items: Array<{
      id: string;
      description: string;
      quantity: number;
      rate: number;
      discount: number;
      amount: number;
    }>;
    adjustments: Array<{
      name: string;
      value: number;
      isPercentage: boolean;
    }>;
  };
  organization?: Organization;
  clients: Client[];
  products: Array<{
    id: string;
    name: string;
    price: number;
  }>;
}

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
