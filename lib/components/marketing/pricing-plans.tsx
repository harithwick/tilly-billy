import { plans } from "@/lib/constants/pricing-plans";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { Badge } from "@/lib/components/ui/badge";
import { Button } from "@/lib/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/lib/components/ui/tabs";
import { useState } from "react";

export default function PricingPlans() {
  const [billingInterval, setBillingInterval] = useState<"monthly" | "yearly">(
    "yearly"
  );

  return (
    <div className="mx-auto lg:container lg:px-16 xl:px-12 flex flex-col">
      <div className="relative z-10 mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center mb-8">
          <Tabs
            defaultValue="yearly"
            value={billingInterval}
            onValueChange={(value) =>
              setBillingInterval(value as "monthly" | "yearly")
            }
          >
            <TabsList>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="yearly">
                Yearly <Badge className="ml-2">Save 20%</Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="mx-auto max-w-md grid lg:max-w-none mt-24 lg:grid-cols-2 xl:grid-cols-3 gap-4 xl:gap-0">
          {plans.map((plan) => {
            const isProPlan = plan.name === "Pro";
            const isTeamPlan = plan.name === "Team";
            const price =
              billingInterval === "monthly"
                ? plan.priceMonthly
                : plan.priceYearly;
            const costUnit =
              billingInterval === "monthly"
                ? plan.costUnitMonthly
                : plan.costUnitYearly;

            return (
              <div
                key={`row-${plan.name}`}
                className={cn(
                  "flex flex-col border xl:border-r-0 last:border-r bg-surface-75 rounded-xl xl:rounded-none first:rounded-l-xl last:rounded-r-xl",
                  isProPlan &&
                    "border-foreground-muted !border-2 !rounded-xl xl:-my-8",
                  isTeamPlan && "xl:border-l-0"
                )}
              >
                <div
                  className={cn(
                    "px-8 xl:px-4 2xl:px-8 pt-6",
                    isProPlan ? "rounded-tr-[9px] rounded-tl-[9px]" : ""
                  )}
                >
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 pb-2">
                      <h3 className="text-foreground text-2xl font-normal uppercase flex items-center gap-4 ">
                        {plan.name}
                      </h3>
                      {plan.nameBadge && (
                        <Badge variant="secondary">{plan.nameBadge}</Badge>
                      )}
                    </div>
                  </div>
                  <p
                    className={cn(
                      "text-foreground-light mb-4 text-sm 2xl:pr-4",
                      isProPlan && "xl:mb-12"
                    )}
                  >
                    {plan.description}
                  </p>

                  <div
                    className={cn(
                      "text-foreground flex items-baseline text-5xl font-normal lg:text-4xl xl:text-4xl border-b border-default lg:min-h-[155px]",
                      plan.priceLabel
                        ? "py-6 lg:pb-0 pt-6"
                        : "py-8 lg:pb-0 lg:pt-10"
                    )}
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-end gap-2">
                        <div>
                          {plan.priceLabel && (
                            <p className="text-foreground-lighter ml-1 text-[13px] leading-4 font-normal">
                              {plan.priceLabel}
                            </p>
                          )}

                          <div className="flex items-end">
                            <p className={`mt-2 pb-1 text-4xl`}>{price}</p>
                            <p className="text-foreground-lighter mb-1.5 ml-1 text-[13px] leading-4">
                              {costUnit}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={cn(
                    "border-default flex rounded-bl-[4px] rounded-br-[4px] flex-1 flex-col px-8 xl:px-4 2xl:px-8 py-6",
                    isProPlan && "mb-0.5 rounded-bl-[4px] rounded-br-[4px]"
                  )}
                >
                  {plan.preface && (
                    <p className="text-foreground-lighter text-[13px] mt-2 mb-4">
                      {plan.preface}
                    </p>
                  )}
                  <ul className="text-[13px] flex-1 text-foreground-lighter">
                    {plan.features.map((feature) => (
                      <li
                        key={typeof feature === "string" ? feature : feature[0]}
                        className="flex flex-col py-2 first:mt-0"
                      >
                        <div className="flex items-center">
                          <div className="flex w-6">
                            <Check
                              className={cn(
                                "h-4 w-4",
                                plan.name === "Enterprise"
                                  ? "text-foreground"
                                  : "text-brand"
                              )}
                              aria-hidden="true"
                              strokeWidth={3}
                            />
                          </div>
                          <span className="text-foreground mb-0">
                            {typeof feature === "string" ? feature : feature[0]}
                          </span>
                        </div>
                        {typeof feature !== "string" && (
                          <p className="ml-6 text-foreground-lighter">
                            {feature[1]}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full mt-4 mb-2">{plan.cta}</Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
