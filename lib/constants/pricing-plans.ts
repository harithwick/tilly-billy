export const pricingPlans = [
  {
    title: "Generous Free Tier",
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: "Generous free tier for everyday needs",
    features: [
      "Unlimited Invoices",
      "1 Client",
      "1 Currency",
      "1 Organization",
    ],
    actionLabel: "Get Started",
  },
  {
    title: "Indie ",
    monthlyPrice: 6.99,
    yearlyPrice: 69.99,
    description: "Perfect for owners of small & medium businessess",
    features: [
      "Unlimited Invoices",
      "Unlimited Clients",
      "Unlimited Currencies",
      "Unlimited Organizations",
    ],
    actionLabel: "Get Started",
    popular: true,
  },
  {
    title: "Enterprise",
    price: "Custom",
    description: "Dedicated support and infrastructure to fit your needs",
    features: [
      "Example Feature Number 1",
      "Example Feature Number 2",
      "Example Feature Number 3",
      "Super Exclusive Feature",
    ],
    actionLabel: "Contact Sales",
    exclusive: true,
  },
];

export interface PricingInformation {
  id: string;
  name: string;
  nameBadge?: string;
  costUnitMonthly?: string;
  costUnitYearly?: string;
  href: string;
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
