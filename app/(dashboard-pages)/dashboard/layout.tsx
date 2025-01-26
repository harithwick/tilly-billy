"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardNav from "@/lib/components/dashboard-nav";
import { OrgSwitcher } from "@/lib/components/org-switcher";
import { LoadingState } from "@/lib/components/loading-state";
import { Organization } from "@/lib/types";
import DashboardTopNav from "@/lib/components/dashboard-top-nav";
interface DashboardResponse {
  organizations: Organization[];
  activeOrgUuid: string | null;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function initializeDashboard() {
      try {
        const response = await fetch("/api/dashboard");
        console.log("dashboard response", response);

        if (response.redirected) {
          window.location.href = response.url;
          return;
        }

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Failed to fetch dashboard data");
        }

        const responseData: DashboardResponse = await response.json();
        console.log("responseData", responseData);
        setOrganizations(responseData.organizations);
      } catch (error) {
        console.error("Failed to initialize dashboard:", error);
      } finally {
        setLoading(false);
      }
    }
    initializeDashboard();
  }, []);

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardTopNav organizations={organizations} />

      <div className="flex-1 items-start px-4 md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
        <aside className="fixed top-16 z-30 hidden h-[calc(100vh-4rem)] w-full shrink-0 overflow-y-auto border-r md:sticky md:block">
          <div className="py-6 pr-6">
            {organizations && organizations.length > 0 ? (
              <OrgSwitcher organizations={organizations} className="mb-4" />
            ) : (
              ""
            )}
            <DashboardNav />
          </div>
        </aside>
        <main className="flex w-full flex-col overflow-hidden py-4 mx-auto max-w-screen-2xl">
          {children}
        </main>
      </div>
    </div>
  );
}
