"use client";

import { Button } from "@/components/ui/button";
import { GoogleIcon } from "@/lib/constants/custom-icons";

interface SocialButtonProps {
  children: React.ReactNode;
  icon: React.ReactNode | "google";
  onClick: () => void;
}

export function SocialButton({ children, icon, onClick }: SocialButtonProps) {
  return (
    <Button
      variant="outline"
      type="button"
      className="w-full"
      onClick={onClick}
    >
      {icon === "google" ? (
        <GoogleIcon />
      ) : (
        <span className="mr-2">{icon}</span>
      )}
      {children}
    </Button>
  );
}
