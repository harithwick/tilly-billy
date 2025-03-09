export interface Invoice {
  id: string;
  uuid: string;
  organizationId: string;
  organizationUUID: string;
  organizationName: string;
  clientId: string;
  clientUUID: string;
  clientName: string;
  clientEmail: string;
  invoiceNumber: string;
  status: InvoiceStatus;
  issueDate: Date;
  dueDate: Date;
  paid: boolean;
  products: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  notes?: string;
  terms?: string;
  createdAt: Date;
  updatedAt: Date;
  feesAndAdjustments?: InvoiceFeeAdjustment[];
  adjustmentsTotal?: number;
}

export interface InvoiceItem {
  id: string;
  invoiceId: string;
  productId?: string;
  quantity: number;
  discount: number;
  totalPrice: number;
  unitPrice: number;
  name: string;
  description: string;
  price: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export type InvoiceStatus =
  | "draft"
  | "sent"
  | "paid"
  | "overdue"
  | "cancelled"
  | "pending";

export type InvoiceFeeAdjustmentType = "currency" | "percentage";

export interface InvoiceFeeAdjustment {
  id: number | null;
  amount: number;
  type: InvoiceFeeAdjustmentType;
}

export const mapInvoice = (raw: any): Invoice => ({
  id: raw.id,
  uuid: raw.uuid,
  organizationId: raw.organizationId,
  organizationUUID: raw.organizationUUID,
  organizationName: raw.organizationName,
  clientId: raw.clientId,
  clientUUID: raw.clientUUID,
  clientName: raw.clientName,
  clientEmail: raw.clientEmail,
  invoiceNumber: raw.invoiceNumber,
  status: raw.status,
  issueDate: new Date(raw.issueDate),
  dueDate: new Date(raw.dueDate),
  paid: raw.paid,
  products: Array.isArray(raw.products) ? raw.products.map(mapInvoiceItem) : [],
  subtotal: raw.subtotal,
  tax: raw.tax,
  total: raw.total,
  notes: raw.notes,
  terms: raw.terms,
  createdAt: new Date(raw.createdAt),
  updatedAt: new Date(raw.updatedAt),
  feesAndAdjustments: Array.isArray(raw.feesAndAdjustments)
    ? raw.feesAndAdjustments.map(mapInvoiceFeeAdjustment)
    : undefined,
  adjustmentsTotal: raw.adjustmentsTotal,
});

export const mapInvoiceItem = (raw: any): InvoiceItem => ({
  id: raw.id,
  invoiceId: raw.invoiceId,
  productId: raw.productId,
  quantity: raw.quantity,
  discount: raw.discount,
  totalPrice: raw.totalPrice,
  unitPrice: raw.unitPrice,
  name: raw.name,
  description: raw.description,
  price: raw.price,
  status: raw.status,
  createdAt: new Date(raw.createdAt),
  updatedAt: new Date(raw.updatedAt),
});

export const mapInvoiceFeeAdjustment = (raw: any): InvoiceFeeAdjustment => ({
  id: raw.id,
  amount: raw.amount,
  type: raw.type,
});
