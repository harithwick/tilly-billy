import type { Metadata } from "next";
import { Inter } from "next/font/google";
import SiteHeader from "@/components/ui/site-header";
import Footer from "@/lib/components/marketing/footer";

const inter = Inter({ subsets: ["latin"] });

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
