"use client";
import { useRefreshStore } from "../stores/use-refresh-store";
import { useState, useEffect } from "react";

export function useDashboardMetrics() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const refreshTrigger = useRefreshStore((state) => state.refreshTrigger);
  useEffect(() => {
    async function fetchMetrics() {
      try {
        setLoading(true);

        const response = await fetch("/api/dashboard/metrics");
        console.log("response", response);
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Failed to fetch dashboard metrics");
        }

        setMetrics(response.json());
      } catch (err) {
        console.error("Error fetching dashboard metrics:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch dashboard metrics"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchMetrics();
  }, [refreshTrigger]);

  return { metrics, loading, error };
}
