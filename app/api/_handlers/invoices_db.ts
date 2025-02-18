import { SupabaseClient } from "@supabase/supabase-js";
import { Invoice } from "@/lib/types/invoice";

export async function getInvoice(supabase: SupabaseClient, uuid: string) {
  const { data: invoice, error: invoiceError } = await supabase
    .from("invoices")
    .select("*")
    .eq("uuid", uuid)
    .single();
  if (invoiceError) throw invoiceError;
  return invoice;
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
  return invoice;
}

export async function updateInvoice(
  supabase: SupabaseClient,
  uuid: string,
  data: Partial<Invoice>
) {
  const { data: invoice, error: invoiceError } = await supabase
    .from("invoices")
    .update(data)
    .eq("uuid", uuid);

  if (invoiceError) throw invoiceError;
  return invoice;
}

export async function deleteInvoice(supabase: SupabaseClient, uuid: string) {
  const { data: invoice, error: invoiceError } = await supabase
    .from("invoices")
    .delete()
    .eq("uuid", uuid);

  if (invoiceError) throw invoiceError;
}
