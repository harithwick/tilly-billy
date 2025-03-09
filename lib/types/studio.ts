import { Client, Product, Invoice, Organization } from "@/lib/types";

export interface StudioData {
  clients: Client[];
  products: Product[];
  invoice: Invoice | null;
  organization: Organization | null;
}

export interface StudioParams {
  activeOrgUuid: string;
  invoiceId?: string;
}

export const mapStudioData = (raw: any): StudioData => ({
  clients: Array.isArray(raw.clients) ? raw.clients : [],
  products: Array.isArray(raw.products) ? raw.products : [],
  invoice: raw.invoice || null,
  organization: raw.organization || null,
});

export const mapStudioParams = (raw: any): StudioParams => ({
  activeOrgUuid: raw.activeOrgUuid,
  invoiceId: raw.invoiceId,
});
