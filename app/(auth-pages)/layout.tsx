import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SiteHeader } from "@/components/marketing/site-header";
import Footer from "@/components/marketing/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Tilly Billy - Open SourceInvoice Generator",
  description:
    "Tilly Billy is an open source invoice generator that helps you create invoices for your clients.",
  openGraph: {
    title: "Tilly Billy - Open SourceInvoice Generator",
    description:
      "Tilly Billy is an open source invoice generator that helps you create invoices for your clients.",
  },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}
