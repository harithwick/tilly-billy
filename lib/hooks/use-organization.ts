import { useState, useEffect } from "react";
import { Organization } from "@/lib/types";

export function useOrganization() {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrganization() {
      try {
        setLoading(true);
        const response = await fetch(`/api/dashboard/organization/`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch organization");
        }

        const data = await response.json();
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
  }, []);

  const updateOrganization = async (data: Partial<Organization>) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/dashboard/organization/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update organization");
      }

      const updatedData = await response.json();
      setOrganization(updatedData);
      return updatedData;
    } catch (err) {
      console.error("Error updating organization:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { organization, setOrganization, loading, error, updateOrganization };
}
