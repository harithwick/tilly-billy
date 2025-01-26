"use client";

import { useState, useEffect } from "react";
import { Invoice } from "@/lib/types";
import { useRefreshStore } from "@/lib/stores/use-refresh-store";
import { toast } from "sonner";

export function useInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const refreshTrigger = useRefreshStore((state) => state.refreshTrigger);

  useEffect(() => {
    async function fetchInvoices() {
      try {
        setLoading(true);
        const url = new URL("/api/dashboard/invoices", window.location.origin);

        const response = await fetch(url, {
          cache: "force-cache",
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch invoices");
        }

        const data = await response.json();
        setInvoices(data["invoices"]);
      } catch (err) {
        console.error("Error fetching invoices:", err);
        toast.error(
          err instanceof Error ? err.message : "Failed to fetch invoices"
        );
        setError(
          err instanceof Error ? err.message : "Failed to fetch invoices"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchInvoices();
  }, [refreshTrigger]);

  return { invoices, loading, error };
}
