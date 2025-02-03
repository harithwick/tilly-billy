"use client";

import PricingPlans from "@/lib/components/marketing/pricing-plans";
import { PricingTable } from "@/lib/components/marketing/pricing-table";
import PricingFAQ from "@/lib/components/marketing/pricing-faq";

export default function page() {
  return (
    <div className="py-40 md:py-50">
      <div className="relative z-10 pt-8 pb-4 xl:py-16">
        <div className="mx-auto max-w-7xl px-8 text-center sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl space-y-2 lg:max-w-5xl">
            <h1 className="text-4xl lg:text-6xl font-bold mb-4">
              Predictable pricing,
              <br className="block lg:hidden " /> with a generous free tier
            </h1>
            <p className="p text-lg lg:text-xl leading-5 text-gray-500">
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
