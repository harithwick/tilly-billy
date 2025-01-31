import { Button } from "@/lib/components/ui/button";
import { ArrowRight, Code2, DollarSign, Github, Zap } from "lucide-react";
import Link from "next/link";
import { ContainerScroll } from "@/lib/components/ui/container-scroll-animation";
import OpenSource from "@/lib/components/marketing/open-source";
import {
  Carousel,
  Card,
} from "@/lib/components/marketing/apple-cards-carousel";
import { Hero } from "@/lib/components/marketing/hero";
import { BackgroundBeams } from "@/lib/components/ui/background-beams";
import SiteHeader from "@/components/ui/site-header";
import CallToAction1 from "@/lib/components/marketing/call-to-action-1";
import FeaturesSectionDemo from "@/lib/components/marketing/features-section-demo-3";

export const metadata = {
  title: "Tilly Billy - Open SourceInvoice Generator",
  description:
    "Tilly Billy is an open source invoice generator that helps you create invoices for your clients.",
  openGraph: {
    title: "Tilly Billy - Open SourceInvoice Generator",
    description:
      "Tilly Billy is an open source invoice generator that helps you create invoices for your clients.",
    // images: ["/path-to-og-image.jpg"],
  },
};

export default function Home() {
  const cards = data.map((card, index) => (
    <Card key={card.src} card={card} index={index} />
  ));
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <Hero />
      {/* <FeaturesSectionDemo /> */}
      <Carousel items={cards} />
      <CallToAction1 />
      <OpenSource />
    </div>
  );
}

const data = [
  {
    category: "Artificial Intelligence",
    title: "You can do more with AI.",
    src: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=3556&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <p>asdfasdf</p>,
  },
  {
    category: "Productivity",
    title: "Enhance your productivity.",
    src: "https://images.unsplash.com/photo-1531554694128-c4c6665f59c2?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <p>asdfasdf</p>,
  },
  {
    category: "Product",
    title: "Launching the new Apple Vision Pro.",
    src: "https://images.unsplash.com/photo-1713869791518-a770879e60dc?q=80&w=2333&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <p>asdfasdf</p>,
  },

  {
    category: "Product",
    title: "Maps for your iPhone 15 Pro Max.",
    src: "https://images.unsplash.com/photo-1599202860130-f600f4948364?q=80&w=2515&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <p>asdfasdf</p>,
  },
  {
    category: "iOS",
    title: "Photography just got better.",
    src: "https://images.unsplash.com/photo-1602081957921-9137a5d6eaee?q=80&w=2793&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <p>asdfasdf</p>,
  },
  {
    category: "Hiring",
    title: "Hiring for a Staff Software Engineer",
    src: "https://images.unsplash.com/photo-1511984804822-e16ba72f5848?q=80&w=2048&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <p>asdfasdf</p>,
  },
];
