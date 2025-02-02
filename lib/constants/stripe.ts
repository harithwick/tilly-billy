export const STRIPE_PORTAL_LINKS = {
  development: "https://billing.stripe.com/p/login/test_28obLT3vsccVcM0000",
  production: "https://billing.stripe.com/p/login/28obKE1u48iZb6wdQQ",
} as const;

// Helper function to get the correct portal link based on environment
export function getStripePortalLink(email: string): string {
  const baseUrl =
    process.env.NODE_ENV === "development"
      ? STRIPE_PORTAL_LINKS.development
      : STRIPE_PORTAL_LINKS.production;

  return `${baseUrl}?prefilled_email=${encodeURIComponent(email)}`;
}
