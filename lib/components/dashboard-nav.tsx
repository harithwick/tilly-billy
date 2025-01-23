"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { FileText, Home, Package, Settings, Users } from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarImage } from "./ui/avatar";
import { OrgSwitcher } from "./org-switcher";
const links = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Invoices", href: "/dashboard/invoices", icon: FileText },
  { name: "Products", href: "/dashboard/products", icon: Package },
  { name: "Clients", href: "/dashboard/clients", icon: Users },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardNav() {
  const pathname = usePathname();

  return (
    <>
      <nav className="grid items-center gap-2">
        {links.map((link) => {
          const LinkIcon = link.icon;
          return (
            <Link key={link.href} href={link.href}>
              <span
                className={cn(
                  "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  pathname === link.href ? "bg-accent" : "transparent"
                )}
              >
                <LinkIcon className="mr-2 h-4 w-4" />
                <span>{link.name}</span>
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
