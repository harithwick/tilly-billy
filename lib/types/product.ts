export interface Product {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  price?: number;
  sku?: string;
  status: ProductStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ProductStatus = 'active' | 'inactive' | 'archived';