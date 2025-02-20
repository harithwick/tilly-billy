"use client";

import { useState, useEffect } from "react";
import { Client } from "@/lib/types";
import { useRefreshStore } from "@/lib/stores/use-refresh-store";
import { getClients } from "@/lib/api_repository/clients";

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const refreshTrigger = useRefreshStore((state) => state.refreshTrigger);

  useEffect(() => {
    async function fetchClients() {
      try {
        setLoading(true);
        const data = await getClients();
        setClients(data);
      } catch (err) {
        console.error("Error fetching clients:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch clients"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchClients();
  }, [refreshTrigger]);

  return { clients, loading, error };
}
