"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/lib/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/lib/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/lib/components/ui/popover";
import { CreateProductModal } from "./create-product-modal";
import { Product } from "@/lib/types";

interface ProductSelectorProps {
  products: Product[];
  onProductSelect: (product: Product) => void;
}

export function ProductSelector({
  products,
  onProductSelect,
}: ProductSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [createModalOpen, setCreateModalOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [search, setSearch] = React.useState("");

  const filteredProducts = React.useMemo(() => {
    if (!search) return products;
    const searchLower = search.toLowerCase();
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower)
    );
  }, [search]);

  const selectedProduct = React.useMemo(
    () => products.find((product) => product.id.toString() === value),
    [value]
  );

  const handleSelect = React.useCallback(
    (currentValue: string) => {
      setValue(currentValue);
      const product = products.find((p) => p.id.toString() === currentValue);
      if (product) {
        onProductSelect(product);
      }
      setOpen(false);
    },
    [onProductSelect]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a product"
          className="w-full justify-between font-normal"
        >
          {selectedProduct ? (
            <span className="flex items-center">
              <span className="font-medium">{selectedProduct.name}</span>
              <span className="ml-2 text-muted-foreground">
                (${selectedProduct.price?.toFixed(2)})
              </span>
            </span>
          ) : (
            "Select a product..."
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command>
          <CommandInput
            placeholder="Search products..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>
              <div className="py-6 text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  No products found.
                </p>
                <Button
                  size="sm"
                  onClick={() => {
                    setOpen(false);
                    setCreateModalOpen(true);
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Product
                </Button>
              </div>
            </CommandEmpty>
            <CommandGroup heading="Products">
              {filteredProducts.map((product) => (
                <CommandItem
                  key={product.id}
                  value={product.id.toString()}
                  onSelect={handleSelect}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === product.id.toString()
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col">
                    <span>{product.name}</span>
                    <span className="text-sm text-muted-foreground">
                      ${product.price?.toFixed(2)} - {product.description}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
