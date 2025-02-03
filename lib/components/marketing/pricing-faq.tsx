import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/lib/components/ui/accordion";

const faqs = [
  {
    "question": "What’s included in the free tier?",
    "answer":
      "The free tier includes all essential features to get started, including basic analytics, up to 1,000 monthly active users, and core functionality. Perfect for personal projects and small teams.",
  },
  {
    "question": "How can I upgrade to a premium plan?",
    "answer":
      "You can upgrade to a premium plan anytime from your account settings. Simply navigate to the billing section and choose the plan that fits your needs.",
  },
  {
    "question": "What payment methods do you accept?",
    "answer":
      "We accept major credit cards, PayPal, and bank transfers for annual subscriptions.",
  },
  {
    "question": "Is there a trial period for premium plans?",
    "answer":
      "Yes, we offer a 14-day free trial for all premium plans. You can explore all premium features before committing to a subscription.",
  },
  {
    "question": "Can I cancel my subscription anytime?",
    "answer":
      "Yes, you can cancel your subscription anytime from your account settings. Your plan will remain active until the end of the billing cycle.",
  },
];
export default function PricingFAQ() {
  return (
    <div className="mx-auto px-8 container py-48 lg:py-64 lg:px-16 xl:px-12">
      <div className="lg:flex lg:justify-start">
        <div className="lg:w-1/2">
          <h2 className="text-3xl lg:text-5xl font-bold mb-12">
            Frequently asked
            <br />
            questions
          </h2>
        </div>
        <div className="lg:w-1/2">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="mb-4"
              >
                <AccordionTrigger className="text-xl font-semibold text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
}
