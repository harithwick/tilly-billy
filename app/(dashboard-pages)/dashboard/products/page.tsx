"use client";

import { use, useRef, useState } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/lib/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/lib/components/ui/tabs";
import { Package, Plus, MoreVertical } from "lucide-react";
import { Button } from "@/lib/components/ui/button";
import { EmptyState } from "@/lib/components/empty-state";
import { CreateProductModal } from "@/lib/components/products/create-product-modal";
import { ConfirmDelete } from "@/lib/components/confirm-delete";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/lib/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/lib/components/ui/table";
import { useProducts } from "@/lib/hooks/use-products";
import { LoadingState } from "@/lib/components/loading-state";
import { cn, formatCurrency, capitalizeWords } from "@/lib/utils";
import { deleteProduct } from "@/lib/api/products";
import { Product } from "@/lib/types";
import { useRefreshStore } from "@/lib/stores/use-refresh-store";

export default function ProductsPage() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const { products, loading, error } = useProducts();
  const triggerRefresh = useRefreshStore((state) => state.triggerRefresh);

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-destructive">
        <p>Error loading products: {error}</p>
      </div>
    );
  }

  const handleDeleteClick = (productId: number) => {
    setSelectedProductId(productId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedProductId) return;

    try {
      await deleteProduct(selectedProductId.toString());
      toast.success("Product deleted successfully");
      triggerRefresh(); // Refresh products list
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete product"
      );
    } finally {
      setDeleteDialogOpen(false);
      setSelectedProductId(null);
    }
    // Handle delete logic here
    console.log("Deleting product:", selectedProductId);
    setDeleteDialogOpen(false);
    setSelectedProductId(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="mt-4 text-3xl font-bold tracking-tight">
            Products & Services
          </h2>
          <p className="text-muted-foreground">
            Manage your products and services.
          </p>
        </div>
        <Button onClick={() => setCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Product
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Products
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-muted-foreground">
              {products.filter((p) => p.status === "active").length} active
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                products
                  .filter((p) => p.status === "active" && p.price)
                  .reduce((sum, p) => sum + (p.price || 0), 0)
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              From{" "}
              {products.filter((p) => p.status === "active" && p.price).length}{" "}
              priced products
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Price</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                products
                  .filter((p) => p.status === "active" && p.price)
                  .reduce((sum, p) => sum + (p.price || 0), 0) /
                  Math.max(
                    products.filter((p) => p.status === "active" && p.price)
                      .length,
                    1
                  )
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Active products only
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
        </TabsList>

        {["active", "inactive", "archived"].map((status) => (
          <TabsContent key={status} value={status}>
            {products.filter((p) => p.status === status).length === 0 ? (
              <EmptyState
                icon={Package}
                title={`No ${status} products`}
                description={`Add a product or change the status of existing products to see them here.`}
                actionLabel="Add Product"
                onAction={() => setCreateModalOpen(true)}
              />
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead className="hidden md:table-cell">
                        Description
                      </TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead className="hidden md:table-cell">
                        SKU
                      </TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products
                      .filter((p) => p.status === status)
                      .map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>{product.name}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            {product.description || "-"}
                          </TableCell>
                          <TableCell>
                            {product.price
                              ? formatCurrency(product.price)
                              : "-"}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {product.sku || "-"}
                          </TableCell>
                          <TableCell>
                            <span
                              className={cn(
                                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                                product.status === "active" &&
                                  "bg-green-100 text-green-800",
                                product.status === "inactive" &&
                                  "bg-yellow-100 text-yellow-800",
                                product.status === "archived" &&
                                  "bg-gray-100 text-gray-800"
                              )}
                            >
                              {capitalizeWords(product.status)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedProduct(product);
                                    setCreateModalOpen(true);
                                  }}
                                >
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() =>
                                    handleDeleteClick(Number(product.id))
                                  }
                                >
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
      <CreateProductModal
        open={createModalOpen}
        onOpenChange={(open) => {
          setCreateModalOpen(open);
          if (!open) {
            setSelectedProduct(null);
          }
        }}
        product={selectedProduct || undefined}
      />
      <ConfirmDelete
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        title="Delete Product"
        description="Are you sure you want to delete this product? This action cannot be undone."
      />
    </div>
  );
}
