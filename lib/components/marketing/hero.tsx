import Link from "next/link";
import { ArrowRight, Github } from "lucide-react";
import { Button } from "@/lib/components/ui/button";
import { BackgroundBeams } from "@/lib/components/ui/background-beams";

export function Hero() {
  return (
    <section className="container flex mb-32 mt-32 min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 mx-auto">
      <div className="absolute inset-0 z-0">
        <BackgroundBeams />
      </div>
      <div className="flex max-w-[980px] flex-col items-center gap-4 text-center z-10 ">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
          Open Source
          <br />
          <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Invoice Generator
          </span>
        </h1>
        <p className="max-w-[700px] text-gray-500 md:text-xl">
          An invoicing tool built specifically for freelancers and indie
          developers. Create, manage, and track invoices with ease.
        </p>
        <div className="mt-4 flex gap-4">
          <Link href="/dashboard">
            <Button size="lg" className="h-12 px-8">
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link
            href="https://github.com/yourusername/indie-invoicer"
            target="_blank"
          >
            <Button size="lg" variant="outline" className="h-12 px-8">
              <Github className="mr-2 h-5 w-5" />
              View Repo
            </Button>
          </Link>
        </div>
        <div className="mt-16 w-full max-w-6xl">
          <div className="relative aspect-[16/9] overflow-hidden rounded-lg">
            <img
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426"
              alt="Dashboard preview"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
