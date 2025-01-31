export interface PricingInformation {
  id: string;
  name: string;
  nameBadge?: string;
  costUnitMonthly?: string;
  costUnitYearly?: string;
  href: string;
  priceLabelYearly?: string;
  priceLabelMonthly?: string;
  stripePriceIdMonthly?: string;
  stripePriceIdYearly?: string;
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
    priceLabelYearly: "Free",
    priceLabelMonthly: "Free",
    priceYearly: "$0",
    priceMonthly: "$0",
    description: "Generous free tier to get you started",
    preface: "Get started with:",
    features: [
      "Generate Unlimited Invoices",
      "Download Invoices",
      "Indepth Analytics",
      "Unlimited Products & Services",
    ],
    footer:
      "Free projects are paused after 1 week of inactivity. Limit of 2 active projects.",
    cta: "Start for Free",
  },
  {
    id: "tier_pro",
    name: "Pro",
    nameBadge: "Most Popular",
    costUnitMonthly: "/ Month",
    costUnitYearly: "/ Month",
    href: "/profile?tab=billing",
    priceLabelYearly: "Billed Yearly",
    priceLabelMonthly: "Billed Monthly",
    stripePriceIdMonthly: "price_1Qn6NkBOi65YTMm133g2SbdC",
    stripePriceIdYearly: "price_1Qn6OpBOi65YTMm1hipIdYrI",
    priceMonthly: "$9.99",
    priceYearly: "$6.99",
    description: "Suitable for small business, freelancers and startups",
    features: [
      "Email Invoices",
      "Recurring Invoices",
      "Unlimited Clients",
      "Email support",
    ],
    preface: "Everything in the Free Plan, plus:",
    cta: "Get Started",
  },
  {
    id: "tier_team",
    name: "Team",
    nameBadge: "",
    costUnitMonthly: "/ Month",
    costUnitYearly: "/ Month",
    href: "/profile?tab=billing",
    priceLabelYearly: "Billed Yearly",
    priceLabelMonthly: "Billed Monthly",
    stripePriceIdMonthly: "price_1Qn6PiBOi65YTMm1QZzRohTf",
    stripePriceIdYearly: "price_1Qn6QyBOi65YTMm1s1WAKptD",
    priceMonthly: "$12.99",
    priceYearly: "$9.99",
    description: "",
    features: [
      "Unlimited Organizations",
      "Multi Currency Support",
      "Lifetime Analytics Data Retention",
      "Collaborate with your team",
      "Priority Email support",
    ],
    preface: "Everything in the Pro Plan, plus:",
    cta: "Get Started",
  },
];

export const planFeatures = [
  {
    title: "Total Users",
    tooltips: { main: "The maximum number of users your project can have" },
    plans: {
      free: "Unlimited",
      pro: "Unlimited",
      team: "Unlimited",
    },
    usage_based: false,
  },
  {
    title: "MAUs",
    tooltips: {
      main: "Users who log in or refresh their token count towards MAU.\nBilling is based on the sum of distinct users requesting your API throughout the billing period. Resets every billing cycle.",
    },
    plans: {
      free: "50,000 included",
      pro: ["100,000 included", "then $0.00325 per MAU"],
      team: ["100,000 included", "then $0.00325 per MAU"],
    },
    usage_based: true,
  },
  {
    title: "MAUs",
    tooltips: {
      main: "Users who log in or refresh their token count towards MAU.\nBilling is based on the sum of distinct users requesting your API throughout the billing period. Resets every billing cycle.",
    },
    plans: {
      free: true,
      pro: ["100,000 included", "then $0.00325 per MAU"],
      team: ["100,000 included", "then $0.00325 per MAU"],
    },
    usage_based: true,
  },
];
