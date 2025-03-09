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

export const mapClient = (raw: any): Client => ({
  id: raw.id,
  organizationId: raw.organizationId,
  name: raw.name,
  email: raw.email,
  companyName: raw.companyName,
  phone: raw.phone,
  website: raw.website,
  taxNumber: raw.taxNumber,
  billingEmail: raw.billingEmail,
  paymentTerms: raw.paymentTerms,
  notes: raw.notes,
  status: raw.status,
  createdAt: new Date(raw.createdAt),
  updatedAt: new Date(raw.updatedAt),
  uuid: raw.uuid,
  invoiceCount: raw.invoiceCount,
  street: raw.street,
  city: raw.city,
  state: raw.state,
  postalCode: raw.postalCode,
  country: raw.country,
});
