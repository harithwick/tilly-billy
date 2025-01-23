import { Client, Product, Invoice } from "@/lib/types";

export interface StudioData {
  clients: Client[];
  products: Product[];
  invoice: Invoice | null;
}

export interface StudioParams {
  activeOrgUuid: string;
  invoiceId?: string;
}
