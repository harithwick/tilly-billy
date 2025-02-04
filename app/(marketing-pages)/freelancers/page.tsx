import { Button } from "@/lib/components/ui/button";
import Link from "next/link";
import { GridSVG } from "@/lib/constants/grid-svg";
// You'll need to create these icons or import them from your preferred icon library
import {
  FileText as DocumentIcon,
  Clock as ClockIcon,
  DollarSign as CurrencyIcon,
  Clock as TimeIcon,
  Lock as LockIcon,
  BarChart as ChartIcon,
} from "lucide-react";

export const metadata = {
  title: "Freelancer Invoicing | Simple, Professional Invoices",
  description:
    "Create professional invoices in seconds. Built specifically for freelancers with features like automatic payment reminders, multiple currency support, and customizable templates.",
};

export default function FreelancersPage() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <GridSVG className="max-h-96 z-0" />
        <div className="max-w-7xl mx-auto z-100">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Invoicing Made Simple for
              <span className="text-primary block">Freelancers</span>
            </h1>
            <p className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto">
              Create professional invoices in seconds, get paid faster, and
              focus on what you do best.
            </p>
            <div className="mt-10 flex gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg">Start Free Trial</Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline">
                  See Features
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-16">
            Everything You Need to Run Your Freelance Business
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="p-6 rounded-lg bg-background">
                <feature.icon className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-16">
            Trusted by Freelancers Worldwide
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <blockquote key={index} className="p-6 rounded-lg bg-muted">
                <p className="text-lg mb-4">"{testimonial.quote}"</p>
                <footer>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-muted-foreground">
                    {testimonial.title}
                  </div>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Streamline Your Invoicing?
          </h2>
          <p className="text-xl mb-10 opacity-90">
            Join thousands of freelancers who've simplified their billing
            process
          </p>
          <Link href="/signup">
            <Button size="lg" variant="secondary">
              Start Your Free Trial
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

const features = [
  {
    title: "Professional Templates",
    description:
      "Choose from beautiful, customizable invoice templates that make you look professional.",
    icon: DocumentIcon,
  },
  {
    title: "Automatic Reminders",
    description:
      "Set up payment reminders that automatically follow up with your clients.",
    icon: ClockIcon,
  },
  {
    title: "Multiple Currencies",
    description: "Work with clients globally using our multi-currency support.",
    icon: CurrencyIcon,
  },
  {
    title: "Time Tracking",
    description:
      "Track your hours and automatically generate invoices based on your time.",
    icon: TimeIcon,
  },
  {
    title: "Secure Payments",
    description: "Accept payments online with our secure payment processing.",
    icon: LockIcon,
  },
  {
    title: "Financial Reports",
    description:
      "Get insights into your earnings with detailed financial reports.",
    icon: ChartIcon,
  },
];

const testimonials = [
  {
    quote:
      "This platform has completely transformed how I handle invoicing. It's saved me hours every month.",
    name: "Sarah Johnson",
    title: "Web Developer",
  },
  {
    quote:
      "The automatic reminders have helped me get paid faster. My cash flow has never been better.",
    name: "Michael Chen",
    title: "Graphic Designer",
  },
  {
    quote:
      "The professional templates and multi-currency support make it easy to work with international clients.",
    name: "Emma Rodriguez",
    title: "Marketing Consultant",
  },
];
