import Link from "next/link";
import { ArrowRight, Github } from "lucide-react";
import { Button } from "@/lib/components/ui/button";
import { BackgroundBeams } from "@/lib/components/ui/background-beams";

export default function OpenSource() {
  return (
    <section>
      <div className=" my-20 mx-auto max-w-5xl rounded-none md:rounded-3xl h-[40rem] w-full bg-neutral-950 relative flex flex-col items-center justify-center antialiased">
        <div className="absolute inset-0">
          <BackgroundBeams />
        </div>
        <div className="max-w-2xl mx-auto p-4 z-10">
          <h1 className="relative z-10 text-4xl md:text-7xl  bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600 text-center font-sans font-bold">
            Proudly Open Source
          </h1>
          <p className="text-neutral-500 mt-5 max-w-lg mx-auto my-2 text-lg text-center relative z-10">
            We believe in the power of community and collaboration. Join us in
            building the future of invoicing.
          </p>
          <div className="mt-8 flex gap-4 justify-center z-100">
            <Link href="/dashboard">
              <Button size="lg" className="h-12 px-8  z-100" variant="outline">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link
              href="https://github.com/yourusername/indie-invoicer"
              target="_blank"
            >
              <Button size="lg" variant="outline" className="h-12 px-8">
                <Github className="mr-2 h-5 w-5 z-100" />
                View Repo
              </Button>
            </Link>
          </div>
        </div>
        {/* <BackgroundBeams /> */}
      </div>
    </section>
  );
}
