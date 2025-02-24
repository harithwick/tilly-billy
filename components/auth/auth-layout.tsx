"use client";
import { Pacifico } from "next/font/google";
import { Code2 } from "lucide-react";
import { GridSVG } from "@/lib/constants/grid-svg";
import { Card } from "../ui/card";
const pacifico = Pacifico({
  subsets: ["latin"],
  weight: ["400"],
});

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="mx-auto container mt-24 md:mt-32 mb-32">
      <GridSVG className="z-0 w-full h-full" />
      <div className="">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[440px]">
          <Card className="shadow-none md:shadow-lg p-8 bg-white z-10">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            </div>
            {children}
          </Card>
        </div>
      </div>
    </div>
  );
}
