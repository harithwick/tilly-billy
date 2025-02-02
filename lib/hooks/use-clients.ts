"use client";

import { useState, useEffect } from "react";
import { Client } from "@/lib/types";
import { useRefreshStore } from "@/lib/stores/use-refresh-store";

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const refreshTrigger = useRefreshStore((state) => state.refreshTrigger);

  useEffect(() => {
    async function fetchClients() {
      try {
        setLoading(true);
        const responseData = await fetch("/api/dashboard/clients", {
          cache: "no-cache",
        });

        if (!responseData.ok) {
          const errorData = await responseData.json();
          throw new Error(errorData.error || "Failed to fetch clients");
        }

        let data = await responseData.json();

        if (responseData) {
          setClients(data);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error fetching clients:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch clients"
        );
      }
    }

    fetchClients();
  }, [refreshTrigger]);

  return { clients, loading, error };
}
