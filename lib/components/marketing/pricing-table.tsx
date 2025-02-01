import { Fragment } from "react";
import {
  IconPricingIncludedCheck,
  IconPricingInfo,
  IconPricingMinus,
} from "./pricing-icons";
import { plans, planFeatures } from "@/lib/constants/pricing-plans";
import { HelpCircle } from "lucide-react";

export const PricingTable = (props: any) => {
  return (
    <div className="mx-auto lg:container lg:px-16 xl:px-12 flex flex-col">
      <table className="h-px w-full table-fixed mt-40">
        <thead className="z-10">
          <tr>
            <th className="text-foreground md:w-1/3 w-1/4 px-6 pt-2 pb-2 text-left"></th>
            <th className="text-foreground px-6 pt-2 pb-2 text-left md:text-2xl text-lg">
              <span>Free</span>
            </th>
            <th className="text-foreground px-6 pt-2 pb-2 text-left md:text-2xl text-lg">
              <span>Pro</span>
            </th>
            <th className="text-foreground px-6 pt-2 pb-2 text-left md:text-2xl text-lg">
              <span>Enterprise</span>
            </th>
          </tr>
        </thead>

        <tbody className="border-default divide-border divide-y first:divide-y-0">
          <tr
            className="divide-border -scroll-mt-5"
            style={{ borderTop: "none" }}
          >
            <td className="bg-background px-6 py-5 free"></td>
            <td className="bg-background px-6 py-5 pro"></td>
            <td className="bg-background px-6 py-5 enterprise"></td>
          </tr>

          {planFeatures.map((feat: any, i: number) => {
            return (
              <Fragment key={feat.title}>
                <tr className="divide-border md:text-lg text-sm" key={i}>
                  <th
                    className={`text-foreground flex items-center px-6 py-5 last:pb-24 text-left font-normal `}
                    scope="row"
                  >
                    {feat.title}
                  </th>

                  {Object.entries(feat.plans).map((entry: any, i) => {
                    const planName = entry[0];
                    const planValue = entry[1];

                    return (
                      <td
                        key={i}
                        className={[
                          `pl-6 pr-2 tier-${planName}`,
                          typeof planValue === "boolean" ? "text-center" : "",
                        ].join(" ")}
                      >
                        {typeof planValue === "boolean" &&
                        planValue === true ? (
                          <IconPricingIncludedCheck plan={planValue} />
                        ) : typeof planValue === "boolean" &&
                          planValue === false ? (
                          <div className="text-muted">
                            <IconPricingMinus plan={planValue} />
                          </div>
                        ) : (
                          <div className="text-foreground flex flex-col justify-center">
                            <span className="flex items-center gap-2">
                              {feat.tooltips?.[planName] && (
                                <span
                                  className="shrink-0 hover:text-background-overlay-default cursor-pointer transition-colors"
                                  data-tip={feat.tooltips[planName]}
                                >
                                  <IconPricingInfo />
                                </span>
                              )}
                              {typeof planValue === "string"
                                ? planValue
                                : planValue[0]}
                            </span>
                            {typeof planValue !== "string" && (
                              <span className="text-lighter leading-4">
                                {planValue[1]}
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
