"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils/utilities";
import { Check } from "lucide-react";

interface TemplateCardProps {
  name: string;
  description: string;
  image: string;
  selected?: boolean;
  onClick?: () => void;
}

export function TemplateCard({
  name,
  description,
  image,
  selected,
  onClick,
}: TemplateCardProps) {
  return (
    <Card
      className={cn(
        "relative cursor-pointer overflow-hidden transition-all hover:ring-2 hover:ring-primary/50",
        selected && "ring-2 ring-primary"
      )}
      onClick={onClick}
    >
      {selected && (
        <div className="absolute right-2 top-2 z-10 rounded-full bg-primary p-1">
          <Check className="h-4 w-4 text-primary-foreground" />
        </div>
      )}
      <div className="aspect-[16/9] overflow-hidden">
        <img src={image} alt={name} className="h-full w-full object-cover" />
      </div>
      <div className="p-4">
        <h3 className="font-medium">{name}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </Card>
  );
}
