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
