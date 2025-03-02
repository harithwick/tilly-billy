"use client";
import { useAuthUser } from "@/lib/hooks/use-auth-user";
import DashboardTopNav from "@/components/dashboard-top-nav";
import { SiteHeader } from "@/components/marketing/site-header";
import { LoadingState } from "@/components/loading-state";
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, userLoading } = useAuthUser();

  if (userLoading) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {user ? <DashboardTopNav organizations={[]} /> : <SiteHeader />}
      {children}
    </div>
  );
}
