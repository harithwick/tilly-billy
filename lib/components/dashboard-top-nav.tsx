import { Sheet, SheetContent, SheetTrigger } from "@/lib/components/ui/sheet";
import { Button } from "@/lib/components/ui/button";
import { Menu } from "lucide-react";
import { Code2 } from "lucide-react";
import { OrgSwitcher } from "./org-switcher";
import { UserNav } from "./user-nav";
import DashboardNav from "./dashboard-nav";
import { useState } from "react";
import { Organization } from "@/lib/types";
import { Pacifico } from "next/font/google";

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: ["400"],
});

interface DashboardTopNavProps {
  organizations: Organization[];
}

export default function DashboardTopNav({
  organizations,
}: DashboardTopNavProps) {
  const [open, setOpen] = useState(false);
  return (
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
                <span className={`text-xl font-bold ${pacifico.className}`}>
                  Tilly Billy
                </span>
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
            <span className={`text-xl font-thin ${pacifico.className}`}>
              Tilly Billy
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <UserNav />
        </div>
      </div>
    </header>
  );
}
