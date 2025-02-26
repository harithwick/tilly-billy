//This file calls the client's DB' functions and returns the data

import { SupabaseClient, User } from "@supabase/supabase-js";
import {
  getOrganizationIdFromUuid,
  getUserIdFromSupabaseId,
} from "@/lib/utils/organizations";
import { keysToCamelCase } from "@/lib/utils/utilities";
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
  return keysToCamelCase(data);
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
  return keysToCamelCase(data);
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

function structureClientData(data: any) {
  console.log("data", data);
  return {
    name: data.name,
    email: data.email,
    company_name: data.companyName || null,
    phone: data.phone || null,
    website: data.website || null,
    tax_number: data.taxNumber || null,
    status: data.status || "active",
    country: data.country || null,
    city: data.city || null,
    street: data.street || null,
    state: data.state || null,
    postal_code: data.postalCode || null,
  };
}

export async function createClient(
  supabase: SupabaseClient,
  data: any,
  activeOrgUuid: string,
  supabaseUser: User
) {
  const organizationId = await getOrganizationIdFromUuid(
    supabase,
    activeOrgUuid!
  );

  // get the user id from the user object
  const userId = await getUserIdFromSupabaseId(supabase, supabaseUser!.id);

  const { data: client, error } = await supabase
    .from("clients")
    .insert([
      {
        ...structureClientData(data),
        org_id: organizationId,
        created_by: userId,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return keysToCamelCase(client);
}

export async function updateClient(
  supabase: SupabaseClient,
  uuid: string,
  data: any,
  activeOrgUuid: string
) {
  const clientUuid = uuid;
  let orgId = await getOrganizationIdFromUuid(supabase, activeOrgUuid!);

  const { data: client, error } = await supabase
    .from("clients")
    .update(structureClientData(data))
    .eq("uuid", clientUuid)
    .eq("org_id", orgId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  console.log("client", client);

  return keysToCamelCase(client);
}
