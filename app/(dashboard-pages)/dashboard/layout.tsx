"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardNav from "@/lib/components/dashboard-nav";
import { Button } from "@/lib/components/ui/button";
import { Code2, Menu } from "lucide-react";
import { UserNav } from "@/lib/components/user-nav";
import { Sheet, SheetContent, SheetTrigger } from "@/lib/components/ui/sheet";
import { OrgSwitcher } from "@/lib/components/org-switcher";
import { LoadingState } from "@/lib/components/loading-state";
import { Organization } from "@/lib/types";
interface DashboardResponse {
  organizations: Organization[];
  activeOrgUuid: string | null;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function initializeDashboard() {
      try {
        const response = await fetch("/api/dashboard");

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Failed to fetch dashboard data");
        }
        const responseData: DashboardResponse = await response.json();

        if (responseData.organizations.length === 0) {
          router.push("/create-org");
          return;
        }
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
      <header className="sticky top-0 z-50 border-b bg-background">
        <div className="container flex h-16 items-center justify-between px-4 mx-auto">
          <div className="flex items-center gap-4">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64">
                <div className="flex items-center gap-2 pb-4 pt-4">
                  <Code2 className="h-6 w-6" />
                  <span className="text-xl font-bold">Tilly Billy</span>
                </div>
                {organizations && organizations.length > 0 ? (
                  <OrgSwitcher organizations={organizations} className="mb-4" />
                ) : (
                  ""
                )}
                <DashboardNav />
              </SheetContent>
            </Sheet>
            <div className="flex items-center gap-2">
              <span className="text-xl font-thin">Tilly Billy</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <UserNav />
          </div>
        </div>
      </header>

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
