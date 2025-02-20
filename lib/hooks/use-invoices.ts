"use client";

import { useState, useEffect } from "react";
import { Invoice } from "@/lib/types";
import { useRefreshStore } from "@/lib/stores/use-refresh-store";
import { toast } from "sonner";
import { getInvoices } from "@/lib/api_repository/invoices";

interface InvoicesResponse {
  invoices: Invoice[];
}

export function useInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const refreshTrigger = useRefreshStore((state) => state.refreshTrigger);

  useEffect(() => {
    async function fetchInvoices() {
      try {
        setLoading(true);
        const data = await getInvoices();
        setInvoices(data.invoices);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to fetch invoices";
        toast.error(message);
        setError(message);
      } finally {
        setLoading(false);
      }
    }

    fetchInvoices();
  }, [refreshTrigger]);

  return { invoices, loading, error };
}
