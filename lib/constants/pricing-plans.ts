export interface PricingInformation {
  id: string;
  name: string;
  nameBadge?: string;
  costUnitMonthly?: string;
  costUnitYearly?: string;
  href: string;
  stripePriceIdMonthly?: string;
  stripePriceIdYearly?: string;
  priceLabel?: string;
  priceMonthly: number | string;
  priceYearly: number | string;
  description: string;
  preface: string;
  features: (string | string[])[];
  footer?: string;
  cta: string;
}

export const plans: PricingInformation[] = [
  {
    id: "tier_free",
    name: "Free",
    nameBadge: "Generous",
    costUnitMonthly: "",
    costUnitYearly: "",
    href: "/login",
    priceLabel: "Free",
    priceYearly: "$0",
    priceMonthly: "$0",
    description: "Generous free tier to get you started",
    preface: "Get started with:",
    features: ["Generate Unlimited Invoices"],
    footer:
      "Free projects are paused after 1 week of inactivity. Limit of 2 active projects.",
    cta: "Start for Free",
  },
  {
    id: "tier_pro",
    name: "Pro",
    nameBadge: "Most Popular",
    costUnitMonthly: "/ month",
    costUnitYearly: "/ year",
    href: "/profile?tab=billing",
    priceLabel: "",
    stripePriceIdMonthly: "price_1Qn6NkBOi65YTMm133g2SbdC",
    stripePriceIdYearly: "price_1Qn6OpBOi65YTMm1hipIdYrI",
    priceMonthly: "$9.99",
    priceYearly: "$6.99",
    description: "For production applications with the power to scale.",
    features: [
      "1 Year Analytics Data Retention",
      "Unlimited Clients",
      "Unlimited Currencies",
      "Email support",
    ],
    preface: "Everything in the Free Plan, plus:",
    cta: "Get Started",
  },
  {
    id: "tier_team",
    name: "Team",
    nameBadge: "",
    costUnitMonthly: "/ month",
    costUnitYearly: "/ year",
    href: "/profile?tab=billing",
    priceLabel: "",
    stripePriceIdMonthly: "price_1Qn6PiBOi65YTMm1QZzRohTf",
    stripePriceIdYearly: "price_1Qn6QyBOi65YTMm1s1WAKptD",
    priceMonthly: "$12.99",
    priceYearly: "$9.99",
    description:
      "Add features such as SSO, control over backups, and industry certifications.",
    features: [
      "Unlimited Organizations",
      "Lifetime Analytics Data Retention",
      "Collaborate with your team",
      "Priority Email support",
    ],
    preface: "Everything in the Pro Plan, plus:",
    cta: "Get Started",
  },
];
