import { Client, Organization, Product, AdjustmentItem } from "@/lib/types";
export interface StudioData {
  invoice?: {
    id: string;
    issueDate: string;
    paymentTerms: string;
    notes: string;
    terms: string;
    client: Client;
    products: Product[];
    feesAndAdjustments: AdjustmentItem[];
  };
  organization?: Organization;
  clients: Client[];
  products: Product[];
}

export const mapToStudioData = (rawData: any): StudioData => {
  return {
    invoice: rawData.invoice
      ? {
          id: rawData.invoice.id,
          issueDate: rawData.invoice.issueDate,
          paymentTerms: rawData.invoice.paymentTerms,
          notes: rawData.invoice.notes,
          terms: rawData.invoice.terms,
          client: rawData.invoice.client,
          products: Array.isArray(rawData.invoice.products)
            ? rawData.invoice.products
            : [],
          feesAndAdjustments: Array.isArray(rawData.invoice.feesAndAdjustments)
            ? rawData.invoice.feesAndAdjustments
            : [],
        }
      : undefined,
    organization: rawData.organization || undefined,
    clients: Array.isArray(rawData.clients) ? rawData.clients : [],
    products: Array.isArray(rawData.products) ? rawData.products : [],
  };
};
