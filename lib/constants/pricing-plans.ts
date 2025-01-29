export interface PricingPlan {
  id: string;
  name: string;
  price: {
    monthly: number;
    annual: number;
  };
  features: {
    title: string;
    included: boolean;
  }[];
  popularPlan?: boolean;
  description: string;
  ctaText: string;
}

export const pricingPlans = [
  {
    title: "Free",
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
    title: "Pro",
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
