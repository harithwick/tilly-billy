import { Metadata } from "next";
import { ContactForm } from "@/lib/components/marketing/contact-form";
import { GridSVG } from "@/lib/constants/grid-svg";
export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with our team",
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight mb-8">Contact Us</h1>
        <GridSVG className="max-h-80" />
        <div className="grid gap-8 mb-12">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
            <p className="text-muted-foreground mb-4">
              Have questions? We'd love to hear from you. Send us a message and
              we'll respond as soon as possible. Alternatively, you can email us
              at
              <a href="mailto:support@tillybilly.co">
                <b>support@tillybilly.co</b>
              </a>
            </p>
          </div>
        </div>

        <ContactForm />
      </div>
    </div>
  );
}
