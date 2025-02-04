import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/lib/components/ui/button";

const useCases = [
  {
    title: "Freelancers",
    description:
      "Create professional invoices for your clients in seconds. Track payments and manage your business efficiently.",
    link: "/signup?type=freelancer",
  },
  {
    title: "Small Businesses",
    description:
      "Generate branded invoices, track expenses, and maintain professional relationships with your customers.",
    link: "/signup?type=business",
  },
  {
    title: "Agencies",
    description:
      "Manage multiple clients and projects with customizable invoice templates and automated billing.",
    link: "/signup?type=agency",
  },
];

export default function UseCases() {
  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 mx-auto">
        <div className="max-w-2xl mx-auto mb-16 text-center">
          <h2 className="text-4xl font-bold tracking-tight">
            Perfect For Every Business
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Whether you're a freelancer, small business, or agency, Tilly Billy
            has you covered
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {useCases.map((useCase, index) => (
            <div
              key={index}
              className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <h3 className="mb-4 text-2xl font-bold">{useCase.title}</h3>
              <p className="mb-6 text-gray-600 dark:text-gray-400">
                {useCase.description}
              </p>
              <Link href={useCase.link}>
                <Button variant="ghost" className="group">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
