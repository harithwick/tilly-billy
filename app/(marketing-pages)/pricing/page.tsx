"use client";

import PricingPlans from "@/components/marketing/pricing-plans";
import { PricingTable } from "@/components/marketing/pricing-table";
import PricingFAQ from "@/components/marketing/pricing-faq";
import { GridSVG } from "@/lib/constants/grid-svg";

export default function page() {
  return (
    <div className="py-24 md:py-28">
      <GridSVG className="max-h-96" />
      <div className="relative pt-8 pb-4 xl:py-16">
        <div className="mx-auto max-w-7xl px-8 text-center sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl space-y-2 lg:max-w-5xl relative">
            <div className="absolute inset-0 -z-10"></div>
            <h1 className="text-2xl md:text-4xl z-10 lg:text-6xl font-bold mb-4 lg:mb-8">
              Predictable pricing,
              <br className="block lg:hidden" /> with a generous free tier
            </h1>
            <p className="text-base md:text-xl lg:text-xl leading-5 text-gray-500">
              Start building for free, collaborate with your team, then scale to
              millions of users
            </p>
          </div>
        </div>
      </div>
      <PricingPlans />
      <PricingTable />
      <PricingFAQ />
    </div>
  );
}
