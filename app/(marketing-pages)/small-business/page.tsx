import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BarChart2,
  Building2,
  CreditCard,
  Users,
  Receipt,
  Clock,
  Shield,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Small Business Invoicing Solutions | Tilly Billy",
  description:
    "Professional invoicing solutions designed specifically for small businesses. Create, send, and track invoices with ease.",
};

export default function SmallBusinessPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 md:px-6 lg:px-8 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                Professional Invoicing for Small Businesses
              </h1>
              <p className="mt-6 text-xl text-gray-600">
                Create professional invoices in minutes, get paid faster, and
                manage your cash flow with ease. Built specifically for small
                business needs.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link href="/signup">
                  <Button size="lg" className="w-full sm:w-auto">
                    Try Free for 14 Days
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/demo">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    Request Demo
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative h-[400px] w-full">
              <Image
                src="/images/invoice-preview.png"
                alt="Invoice Preview"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900">
            Everything You Need to Manage Invoicing
          </h2>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Receipt className="h-8 w-8" />}
              title="Professional Templates"
              description="Choose from dozens of professionally designed invoice templates tailored for small businesses."
            />
            <FeatureCard
              icon={<Clock className="h-8 w-8" />}
              title="Automated Reminders"
              description="Set up automatic payment reminders to reduce late payments and improve cash flow."
            />
            <FeatureCard
              icon={<Shield className="h-8 w-8" />}
              title="Secure Payments"
              description="Accept online payments securely with integrated payment processing solutions."
            />
            <FeatureCard
              icon={<BarChart2 className="h-8 w-8" />}
              title="Financial Insights"
              description="Track payments, generate reports, and gain valuable insights into your business finances."
            />
            <FeatureCard
              icon={<Users className="h-8 w-8" />}
              title="Client Management"
              description="Manage client information, payment history, and communication all in one place."
            />
            <FeatureCard
              icon={<Building2 className="h-8 w-8" />}
              title="Multi-Business Support"
              description="Manage multiple businesses or branches from a single dashboard with ease."
            />
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 px-4 md:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-gray-900">
                Trusted by Small Businesses
              </h2>
              <blockquote className="text-xl text-gray-600">
                "Since switching to Tilly Billy, we've reduced our payment
                collection time by 70%. The automated reminders and professional
                templates have made a huge difference to our cash flow."
              </blockquote>
              <div>
                <p className="font-medium text-gray-900">Michael Chen</p>
                <p className="text-gray-600">Owner, Chen Design Studio</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-3xl font-bold text-blue-600">75%</h3>
                <p className="mt-2 text-gray-600">Faster Payment Collection</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-3xl font-bold text-blue-600">5k+</h3>
                <p className="mt-2 text-gray-600">Small Businesses</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-3xl font-bold text-blue-600">$10M+</h3>
                <p className="mt-2 text-gray-600">Processed Monthly</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-3xl font-bold text-blue-600">4.9/5</h3>
                <p className="mt-2 text-gray-600">Customer Rating</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 md:px-6 lg:px-8 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Start Streamlining Your Invoicing Today
          </h2>
          <p className="mt-4 text-xl text-blue-100">
            Join thousands of small businesses using Tilly Billy to manage their
            invoicing.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-blue-600 hover:bg-blue-50"
              >
                Start Your Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-sm text-blue-100">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="text-blue-600">{icon}</div>
      <h3 className="mt-4 text-xl font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-gray-600">{description}</p>
    </div>
  );
}
