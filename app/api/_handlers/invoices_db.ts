import { SupabaseClient } from "@supabase/supabase-js";
import { Invoice } from "@/lib/types/invoice";
import { keysToCamelCase } from "@/lib/utils/utilities";
import { getOrganization } from "./organization_db";

export async function getInvoice(supabase: SupabaseClient, uuid: string) {
  const { data: invoice, error: invoiceError } = await supabase
    .from("invoices")
    .select("*")
    .eq("uuid", uuid)
    .single();
  if (invoiceError) throw invoiceError;
  return keysToCamelCase(invoice);
}

export async function getInvoices(
  supabase: SupabaseClient,
  organizationUuid: string
) {
  const organization = await getOrganization(supabase, organizationUuid);
  const invoicePrefix = organization.invPrefix || "INV";

  const { data: invoices, error: invoicesError } = await supabase
    .from("view_organization_invoices")
    .select(
      `
      id,
      client_id,
      uuid,
      organization_uuid,
      status,
      issue_date,
      due_date,
      notes,
      created_at,
      updated_at,
      invoice_products (
        id,
        product_id,
        quantity,
        discount,
        total_price
      ),
      clients (
        name,
        uuid
      )
    `
    )
    .eq("organization_uuid", organizationUuid)
    .order("created_at", { ascending: false });

  if (invoicesError) throw invoicesError;

  const formattedInvoices = invoices.map((invoice: any) => {
    const total =
      invoice.invoice_products?.reduce(
        (sum: number, item: any) =>
          sum + (item.quantity * item.unit_price || 0),
        0
      ) || 0;

    const year = new Date(invoice.created_at).getFullYear();
    const invoiceNumber = `${invoicePrefix}-${year}-${invoice.id}`;

    return {
      id: invoice.id,
      clientId: invoice.client_id,
      uuid: invoice.uuid,
      organizationUUID: invoice.organization_uuid,
      status: invoice.status,
      issueDate: invoice.issue_date,
      dueDate: invoice.due_date,
      notes: invoice.notes,
      createdAt: invoice.created_at,
      updatedAt: invoice.updated_at,
      products: invoice.invoice_products,
      total,
      invoiceNumber,
      clientName: invoice.clients.name,
      clientUUID: invoice.clients.uuid,
    };
  });

  return formattedInvoices;
}

export async function getClientInvoices(
  supabase: SupabaseClient,
  organizationUuid: string,
  clientUuid: string
) {
  const organization = await getOrganization(supabase, organizationUuid);
  const invoicePrefix = organization.invPrefix || "INV";

  const { data: invoices, error: invoicesError } = await supabase
    .from("view_organization_invoices")
    .select(
      `
        id,
        client_id,
        uuid,
        organization_uuid,
        status,
        issue_date,
        due_date,
        notes,
        created_at,
        updated_at,
        invoice_products (
          id,
          product_id,
          quantity,
          discount,
          total_price
        ),
        clients (
          name,
          uuid
        )
      `
    )
    .eq("organization_uuid", organizationUuid)
    .eq("clients.uuid", clientUuid)
    .order("created_at", { ascending: false });

  if (invoicesError) throw invoicesError;

  const formattedInvoices = invoices.map((invoice: any) => {
    const total =
      invoice.invoice_products?.reduce(
        (sum: number, item: any) =>
          sum + (item.quantity * item.unit_price || 0),
        0
      ) || 0;

    const year = new Date(invoice.created_at).getFullYear();
    const invoiceNumber = `${invoicePrefix}-${year}-${invoice.id}`;

    return {
      id: invoice.id,
      clientId: invoice.client_id,
      uuid: invoice.uuid,
      organizationUUID: invoice.organization_uuid,
      status: invoice.status,
      issueDate: invoice.issue_date,
      dueDate: invoice.due_date,
      notes: invoice.notes,
      createdAt: invoice.created_at,
      updatedAt: invoice.updated_at,
      products: invoice.invoice_products,
      total,
      invoiceNumber,
      clientName: invoice.clients.name,
      clientUUID: invoice.clients.uuid,
    };
  });

  return formattedInvoices;
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
