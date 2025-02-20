"use client";

import { useState, useEffect } from "react";
import { Product } from "@/lib/types";
import { useRefreshStore } from "@/lib/stores/use-refresh-store";
import { apiRequest, HttpMethod } from "@/lib/utils/api-request";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const refreshTrigger = useRefreshStore((state) => state.refreshTrigger);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const data = await apiRequest<Product[]>(
          "/api/dashboard/products",
          HttpMethod.GET
        );
        setProducts(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch products"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [refreshTrigger]);

  return { products, loading, error };
}
