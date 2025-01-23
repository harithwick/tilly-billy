import Link from "next/link";
import { Button } from "@/lib/components/ui/button";

export default function Pricing() {
  return (
    <section id="pricing-section">
      <div className="container px-4 py-24 md:py-32 mx-auto">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            No subscriptions. No hidden fees. Just honest pricing for indie
            developers.
          </p>
        </div>
        <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
          <div className="rounded-lg border bg-card p-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">Community Edition</h3>
                <p className="text-sm text-muted-foreground">
                  Perfect for indie developers
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">$0</p>
                <p className="text-sm text-muted-foreground">Forever free</p>
              </div>
            </div>
            <div className="mt-8 space-y-4">
              <div className="flex items-center">
                <svg
                  className="mr-2 h-4 w-4 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Unlimited invoices</span>
              </div>
              <div className="flex items-center">
                <svg
                  className="mr-2 h-4 w-4 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Basic analytics</span>
              </div>
              <div className="flex items-center">
                <svg
                  className="mr-2 h-4 w-4 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Self-hosted</span>
              </div>
            </div>
            <Link href="/dashboard" className="mt-8 block">
              <Button className="w-full" variant="outline">
                Get Started Free
              </Button>
            </Link>
          </div>
          <div className="relative rounded-lg border bg-card p-8">
            <div className="absolute -top-4 right-4 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
              RECOMMENDED
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">Pro Edition</h3>
                <p className="text-sm text-muted-foreground">
                  For serious freelancers
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">$69</p>
                <p className="text-sm text-muted-foreground">
                  One-time payment
                </p>
              </div>
            </div>
            <div className="mt-8 space-y-4">
              <div className="flex items-center">
                <svg
                  className="mr-2 h-4 w-4 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Everything in Community</span>
              </div>
              <div className="flex items-center">
                <svg
                  className="mr-2 h-4 w-4 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Advanced analytics</span>
              </div>
              <div className="flex items-center">
                <svg
                  className="mr-2 h-4 w-4 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Custom branding</span>
              </div>
              <div className="flex items-center">
                <svg
                  className="mr-2 h-4 w-4 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Priority support</span>
              </div>
            </div>
            <Link href="/dashboard" className="mt-8 block">
              <Button className="w-full">Get Pro Access</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
