import { SupabaseClient } from "@supabase/supabase-js";
import { Invoice } from "@/lib/types/invoice";
import { keysToCamelCase } from "@/lib/utils/utilities";

export async function getInvoice(supabase: SupabaseClient, uuid: string) {
  const { data: invoice, error: invoiceError } = await supabase
    .from("invoices")
    .select("*")
    .eq("uuid", uuid)
    .single();
  if (invoiceError) throw invoiceError;
  return keysToCamelCase(invoice);
}

export async function getClientInvoices(
  supabase: SupabaseClient,
  clientUuid: string
) {
  const { data: clientInvoices, error: invoicesError } = await supabase
    .from("clients")
    .select("*, invoices (*)")
    .eq("uuid", clientUuid)
    .single();

  if (invoicesError) throw invoicesError;
  return keysToCamelCase(clientInvoices.invoices);
}

export async function createInvoice(
  supabase: SupabaseClient,
  data: Partial<Invoice>
) {
  const { data: invoice, error: invoiceError } = await supabase
    .from("invoices")
    .insert(data)
    .select()
    .single();
  if (invoiceError) throw invoiceError;
  return keysToCamelCase(invoice);
}

export async function updateInvoice(
  supabase: SupabaseClient,
  uuid: string,
  data: Partial<Invoice>
) {
  const { data: invoice, error: invoiceError } = await supabase
    .from("invoices")
    .update(data)
    .eq("uuid", uuid)
    .select();

  if (invoiceError) throw invoiceError;
  return keysToCamelCase(invoice);
}

export async function deleteInvoice(supabase: SupabaseClient, uuid: string) {
  const { data: invoice, error: invoiceError } = await supabase
    .from("invoices")
    .delete()
    .eq("uuid", uuid);

  if (invoiceError) throw invoiceError;
}
