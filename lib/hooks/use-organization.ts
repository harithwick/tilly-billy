import { useState, useEffect } from "react";
import { Organization } from "@/lib/types";
import { getOrganization } from "@/lib/api_repository/organization";
import { useRefreshStore } from "@/lib/stores/use-refresh-store";
export function useOrganization() {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const refreshTrigger = useRefreshStore((state) => state.refreshTrigger);
  useEffect(() => {
    async function fetchOrganization() {
      try {
        setLoading(true);
        const data = await getOrganization();
        setOrganization(data);
      } catch (err) {
        console.error("Error fetching organization:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch organization"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchOrganization();
  }, [refreshTrigger]);

  return { organization, setOrganization, loading, error };
}
