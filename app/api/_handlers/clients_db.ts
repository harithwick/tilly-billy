//This file calls the client's DB' functions and returns the data

import { SupabaseClient } from "@supabase/supabase-js";
export async function getClients(
  supabase: SupabaseClient,
  withInvoices: boolean = false
) {
  const { data, error } = await supabase
    .from("clients")
    .select(withInvoices ? "*, invoices (*)" : "*");
  if (error) throw error;
  return data;
}

export async function getClient(
  supabase: SupabaseClient,
  uuid: string,
  withInvoices: boolean = false
) {
  const { data, error } = await supabase
    .from("clients")
    .select(withInvoices ? "*, invoices (*)" : "*")
    .eq("uuid", uuid)
    .single();
  if (error) throw error;
  return data;
}

export async function archiveClient(
  supabase: SupabaseClient,
  uuid: string,
  archive: boolean = true
) {
  const { data, error } = await supabase
    .from("clients")
    .update({ status: archive ? "archived" : "active" })
    .eq("uuid", uuid)
    .single();
  if (error) throw error;
  return data;
}
