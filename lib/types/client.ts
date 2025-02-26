export interface Client {
  id: number;
  organizationId: string;
  name: string;
  email?: string;
  companyName?: string;
  phone?: string;
  website?: string;
  taxNumber?: string;
  billingEmail?: string;
  paymentTerms?: number;
  notes?: string;
  status: ClientStatus;
  createdAt: Date;
  updatedAt: Date;
  uuid: string;
  invoiceCount: number;
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export type ClientStatus = "active" | "inactive" | "archived";
