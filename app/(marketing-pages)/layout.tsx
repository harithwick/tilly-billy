import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Footer from "@/lib/components/marketing/footer";
import { SiteHeader } from "@/lib/components/marketing/site-header";

export const metadata: Metadata = {
  title: "Tilly Billy",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <SiteHeader />
      {children}
      <Footer />
    </div>
  );
}
