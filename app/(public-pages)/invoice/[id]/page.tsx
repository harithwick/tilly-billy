"use client";

import { notFound } from "next/navigation";
import { Button } from "@/lib/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { Download, CheckCircle } from "lucide-react";
import { useParams } from "next/navigation";

export default async function PublicInvoicePage() {
  const params = useParams<{ id: string }>();
  return <div>Invoice</div>;
}
