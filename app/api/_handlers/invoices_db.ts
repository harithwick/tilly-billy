import { SupabaseClient } from "@supabase/supabase-js";
import { Invoice, InvoiceFeeAdjustment } from "@/lib/types/invoice";
import { keysToCamelCase } from "@/lib/utils/utilities";
import { getOrganization } from "./organization_db";

export async function toggleInvoicePaidStatus(
  supabase: SupabaseClient,
  uuid: string
) {
  // First get the current paid status
  const { data: currentInvoice, error: fetchError } = await supabase
    .from("invoices")
    .select("paid")
    .eq("uuid", uuid)
    .single();

  if (fetchError) throw fetchError;

  // Toggle the paid status
  const { data, error } = await supabase
    .from("invoices")
    .update({ paid: !currentInvoice.paid })
    .eq("uuid", uuid)
    .select();

  if (error) throw error;
  return data;
}

async function getInvoiceProducts(supabase: SupabaseClient, invoiceId: string) {
  const { data, error } = await supabase
    .from("invoice_products")
    .select(
      `
      id,
      product_id,
      quantity,
      discount,
      total_price,
      unit_price,
      products!inner (
        name,
        sku,
        description,
        price,
        status,
        created_at,
        updated_at
      )
    `
    )
    .eq("invoice_id", invoiceId);

  if (error) throw error;
  return data.map((item: any) => ({
    id: item.id,
    productId: item.product_id,
    quantity: item.quantity,
    discount: item.discount,
    totalPrice: item.total_price,
    unitPrice: item.unit_price,
    name: item.products.name,
    description: item.products.description,
    price: item.products.price,
    status: item.products.status,
    createdAt: item.products.created_at,
    updatedAt: item.products.updated_at,
  }));
}

async function getInvoiceFeesAndAdjustments(
  supabase: SupabaseClient,
  invoiceId: string
): Promise<InvoiceFeeAdjustment[]> {
  const { data, error } = await supabase
    .from("invoice_fees_adjustments")
    .select(
      `
      id,
      amount,
      type
    `
    )
    .eq("invoice_id", invoiceId);

  if (error) throw error;
  return data.map((item: any) => ({
    id: item.id,
    invoiceId: item.invoice_id,
    amount: item.amount,
    type: item.type,
  }));
}

function formatInvoice(
  invoice: any,
  invoiceProducts: any[],
  client: any,
  invoicePrefix: string,
  feesAndAdjustments: InvoiceFeeAdjustment[] = []
) {
  const subtotal =
    invoiceProducts?.reduce(
      (sum: number, item: any) => sum + (item.quantity * item.unit_price || 0),
      0
    ) || 0;

  // Calculate adjustments based on type
  const adjustmentsTotal = feesAndAdjustments.reduce(
    (sum: number, adjustment) => {
      if (adjustment.type === "percentage") {
        // For percentage adjustments, calculate based on subtotal
        return sum + subtotal * (adjustment.amount / 100);
      } else {
        // For currency adjustments, use the amount directly
        return sum + adjustment.amount;
      }
    },
    0
  );

  const total = subtotal + adjustmentsTotal;

  const year = new Date(invoice.created_at).getFullYear();
  const invoiceNumber = `${invoicePrefix}-${year}-${invoice.id}`;

  return {
    id: invoice.id,
    clientId: invoice.client_id,
    uuid: invoice.uuid,
    status: invoice.status,
    issueDate: invoice.issue_date,
    dueDate: invoice.due_date,
    notes: invoice.notes,
    createdAt: invoice.created_at,
    updatedAt: invoice.updated_at,
    products: invoiceProducts,
    feesAndAdjustments,
    subtotal,
    adjustmentsTotal,
    total,
    invoiceNumber,
    clientName: client.name,
    clientUUID: client.uuid,
    clientEmail: client.email,
    paid: invoice.paid,
  };
}

async function getInvoicesQuery(
  supabase: SupabaseClient,
  organizationId: number,
  invoiceUuid?: string
) {
  const baseQuery = supabase
    .from("invoices")
    .select(
      `
      id,
      client_id,
      uuid,
      status,
      issue_date,
      due_date,
      notes,
      paid,
      created_at,
      updated_at,
      clients!inner (
        org_id,
        name,
        uuid,
        email
      )
    `
    )
    .eq("clients.org_id", organizationId)
    .order("created_at", { ascending: false });

  if (invoiceUuid) {
    return await baseQuery.eq("uuid", invoiceUuid).single();
  }

  return await baseQuery;
}

export async function getInvoices(
  supabase: SupabaseClient,
  organizationUuid: string,
  invoiceUuid?: string
) {
  const organization = await getOrganization(supabase, organizationUuid);
  const invoicePrefix = organization.invPrefix || "INV";

  const invoicesData = await getInvoicesQuery(
    supabase,
    organization.id,
    invoiceUuid
  );

  console.log("invoicesData", invoicesData.data);

  // If single invoice was requested
  if (invoiceUuid) {
    const invoice = invoicesData.data as any;
    const products = await getInvoiceProducts(supabase, invoice!.id);
    const feesAndAdjustments = await getInvoiceFeesAndAdjustments(
      supabase,
      invoice!.id
    );
    return formatInvoice(
      invoice,
      products,
      {
        name: invoice!.clients.name,
        uuid: invoice!.clients.uuid,
        email: invoice!.clients.email,
      },
      invoicePrefix,
      feesAndAdjustments
    );
  }

  // If multiple invoices were requested
  const formattedInvoices = await Promise.all(
    (invoicesData.data as any[]).map(async (invoice: any) => {
      const products = await getInvoiceProducts(supabase, invoice.id);
      const feesAndAdjustments = await getInvoiceFeesAndAdjustments(
        supabase,
        invoice.id
      );
      return formatInvoice(
        invoice,
        products,
        {
          name: invoice.clients.name,
          uuid: invoice.clients.uuid,
          email: invoice.clients.email,
        },
        invoicePrefix,
        feesAndAdjustments
      );
    })
  );

  return formattedInvoices;
}

export async function getClientInvoices(
  supabase: SupabaseClient,
  organizationUuid: string,
  clientUuid: string
) {
  const organization = await getOrganization(supabase, organizationUuid);
  const invoicePrefix = organization.invPrefix || "INV";

  const { data: invoices, error } = await supabase
    .from("invoices")
    .select(
      `
      id,
      client_id,
      uuid,
      status,
      issue_date,
      due_date,
      notes,
      paid,
      created_at,
      updated_at,
      clients!inner (
        org_id,
        name,
        uuid
      )
    `
    )
    .eq("clients.org_id", organization.id)
    .eq("clients.uuid", clientUuid)
    .order("created_at", { ascending: false });

  if (error) throw error;

  const formattedInvoices = await Promise.all(
    invoices.map(async (invoice: any) => {
      const products = await getInvoiceProducts(supabase, invoice.id);
      const feesAndAdjustments = await getInvoiceFeesAndAdjustments(
        supabase,
        invoice.id
      );
      return formatInvoice(
        invoice,
        products,
        {
          name: invoice.clients.name,
          uuid: invoice.clients.uuid,
          email: invoice.clients.email,
        },
        invoicePrefix,
        feesAndAdjustments
      );
    })
  );

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
  console.log("Deleting invoice with UUID:", uuid);
  const { data: invoice, error: invoiceError } = await supabase
    .from("invoices")
    .delete()
    .eq("uuid", uuid);

  if (invoiceError) throw invoiceError;
}
