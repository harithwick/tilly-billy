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
