import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SiteHeader } from "@/components/ui/site-header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tilly Billy | Auth",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <SiteHeader />
      {children}
    </div>
  );
}
