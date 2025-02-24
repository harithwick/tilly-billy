"use client";

import { Code2 } from "lucide-react";
import { UserNav } from "@/components/user-nav";
import DashboardTopNav from "@/components/dashboard-top-nav";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardTopNav organizations={[]} />
      <main className="flex-1">
        <div className="container mx-auto">{children}</div>
      </main>
    </div>
  );
}
