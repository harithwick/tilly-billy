export interface Invoice {
  id: string;
  organizationId: string;
  organizationUUID: string;
  clientId: string;
  clientName: string;
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
