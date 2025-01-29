import Link from "next/link";
import { Button } from "@/lib/components/ui/button";
import { PricingTable } from "@/lib/components/marketing/pricing-table";
export default function Pricing() {
  return (
    <section id="pricing-section">
      <PricingTable />
    </section>
  );
}
