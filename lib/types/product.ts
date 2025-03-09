export interface Product {
  id: string;
  organizationId: string;
  name: string;
  uuid: string;
  description?: string;
  price?: number;
  sku?: string;
  status: ProductStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type ProductStatus = "active" | "inactive" | "archived";

export const mapProduct = (raw: any): Product => ({
  id: raw.id,
  organizationId: raw.organizationId,
  name: raw.name,
  uuid: raw.uuid,
  description: raw.description,
  price: raw.price,
  sku: raw.sku,
  status: raw.status,
  createdAt: new Date(raw.createdAt),
  updatedAt: new Date(raw.updatedAt),
});
