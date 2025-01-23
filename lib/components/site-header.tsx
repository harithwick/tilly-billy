import Link from "next/link";
import { Button } from "@/lib/components/ui/button";
import { Code2, Github } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="border-b z-100">
      <div className="container flex h-16 mx-auto items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <span className="text-xl font-thin">Tilly Billy</span>
        </div>
        <nav className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost">Dashboard</Button>
          </Link>
          <Link href="/sign-up">
            <Button>Get Started</Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
