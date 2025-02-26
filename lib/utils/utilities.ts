import { clsx, type ClassValue } from "clsx";
import exp from "node:constants";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  return format(date, "MMM d, yyyy");
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function limitCharacters(text: string, limit: number): string {
  return text.length > limit ? `${text.slice(0, limit)}...` : text;
}

export function getInitials(name?: string): string {
  if (!name) return "";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("");
}

export function capitalizeWords(text?: string): string {
  if (!text) return "";
  return text
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
}

export function keysToCamelCase(obj: any): any {
  if (obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) =>
      typeof item === "object" && item !== null ? keysToCamelCase(item) : item
    );
  }

  const result: Record<string, any> = {};

  for (const [key, value] of Object.entries(obj)) {
    const camelKey = toCamelCase(key);
    result[camelKey] =
      value && typeof value === "object" ? keysToCamelCase(value) : value;
  }

  return result;
}
