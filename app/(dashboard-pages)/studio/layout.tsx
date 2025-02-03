"use client";

import { Code2, Save, ArrowLeft } from "lucide-react";
import { Button } from "@/lib/components/ui/button";
import Link from "next/link";
import { UserNav } from "@/lib/components/user-nav";

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">{children}</main>
    </div>
  );
}
