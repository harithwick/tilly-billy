export interface Client {
  id: string;
  organizationId: string;
  name: string;
  email?: string;
  company?: string;
  phone?: string;
  website?: string;
  vatNumber?: string;
  address: ClientAddress;
  billingEmail?: string;
  paymentTerms?: number;
  notes?: string;
  status: ClientStatus;
  createdAt: Date;
  updatedAt: Date;
  uuid: string;
  invoiceCount: number;
}

export interface ClientAddress {
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export type ClientStatus = "active" | "inactive" | "archived";
