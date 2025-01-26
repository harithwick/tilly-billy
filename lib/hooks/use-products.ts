"use client";

import { useState, useEffect, useRef } from "react";
import { Product } from "@/lib/types";
import { useRefreshStore } from "@/lib/stores/use-refresh-store";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const refreshTrigger = useRefreshStore((state) => state.refreshTrigger);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const url = new URL("/api/dashboard/products", window.location.origin);
        const response = await fetch(url, {
          cache: "force-cache",
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch products"
        );
      } finally {
        setLoading(false); // Only stop loader on initial load
      }
    }

    fetchProducts();
  }, [refreshTrigger]);

  return { products, loading, error };
}
