import { notFound } from "next/navigation";
import { Button } from "@/lib/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { Download, CheckCircle } from "lucide-react";

export default async function PublicInvoicePage({
  params,
}: {
  params: { id: string };
}) {
  return <div>Invoice</div>;
}
