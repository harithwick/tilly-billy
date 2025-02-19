//This file calls the client's DB' functions and returns the data

import { SupabaseClient } from "@supabase/supabase-js";
import { getOrganizationIdFromUuid } from "@/lib/utils/organizations";

export async function getClients(
  supabase: SupabaseClient,
  withInvoices: boolean = false,
  orgUuid: string
) {
  const orgId = await getOrganizationIdFromUuid(supabase, orgUuid);
  console.log("orgId", orgId);
  const { data, error } = await supabase
    .from("clients")
    .select(withInvoices ? "*, invoices (*)" : "*")
    .eq("org_id", orgId);
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

export async function deleteClient(supabase: SupabaseClient, uuid: string) {
  // get the clientId from the uuid
  const { data: client, error: clientError } = await supabase
    .from("clients")
    .select("id")
    .eq("uuid", uuid)
    .single();

  if (clientError) {
    throw clientError;
  }

  const { data: invoices, error: checkError } = await supabase
    .from("invoices")
    .select("id")
    .eq("client_id", client?.id)
    .limit(1);

  if (checkError) {
    throw checkError;
  }

  if (invoices && invoices.length > 0) {
    throw new Error(
      "This client cannot be deleted because they have associated invoices. Please archive this client instead."
    );
  }

  const { error: deleteError } = await supabase
    .from("clients")
    .delete()
    .eq("uuid", uuid);

  if (deleteError) {
    throw deleteError;
  }
}
