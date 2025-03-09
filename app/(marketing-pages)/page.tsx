import { redirect } from "next/navigation";

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

export default function Home() {
  redirect("/login");
  return <div className="flex min-h-screen flex-col"></div>;
}
