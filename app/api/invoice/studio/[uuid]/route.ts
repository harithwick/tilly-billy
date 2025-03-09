import { NextResponse } from "next/server";
import { getOrganizationIdFromUuid } from "@/lib/utils/organizations";
import { apiRouteHandler } from "@/app/api/_handlers/route-handler";
import { getInvoices } from "@/app/api/_handlers/invoices_db";
import { getClients } from "@/app/api/_handlers/clients_db";
import { getProducts } from "@/app/api/_handlers/products_db";
import { getOrganization } from "@/app/api/_handlers/organization_db";
export const GET = apiRouteHandler({
  authRequired: true,
  orgUuidRequired: false,
  handler: async (
    request,
    { supabaseUser, supabase, activeOrgUuid, params }
  ) => {
    try {
      const invoiceUuid = params!.uuid;

      let organization = await getOrganization(supabase, activeOrgUuid!);

      let invoiceDetails = await getInvoices(
        supabase,
        activeOrgUuid!,
        invoiceUuid
      );

      let clientDetails = await getClients(supabase, false, activeOrgUuid!);

      let productDetails = await getProducts(supabase, activeOrgUuid!);

      return NextResponse.json({
        ...organization,
        clients: clientDetails,
        products: productDetails,
        invoice: invoiceDetails,
      });
    } catch (error) {
      console.error("Error in studio/[uuid] endpoint:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  },
});

export const POST = apiRouteHandler({
  authRequired: true,
  orgUuidRequired: false,
  requiredParams: ["uuid"],
  handler: async (
    request,
    { supabaseUser, supabase, activeOrgUuid, params }
  ) => {
    // const { uuid } = params;

    return NextResponse.json({ message: "Hello World" });
  },
});

export const DELETE = apiRouteHandler({
  authRequired: true,
  orgUuidRequired: false,
  requiredParams: ["uuid"],
  handler: async (
    request,
    { supabaseUser, supabase, activeOrgUuid, params }
  ) => {
    // const { uuid } = params;

    return NextResponse.json({ message: "Hello World" });
  },
});

export const PUT = apiRouteHandler({
  authRequired: true,
  orgUuidRequired: false,
  handler: async (
    request,
    { supabaseUser, supabase, activeOrgUuid, params }
  ) => {
    try {
      const { uuid } = params!;
      const data = await request.json();

      // First, fetch the existing invoice to get its ID
      const { data: existingInvoice, error: fetchError } = await supabase
        .from("invoices")
        .select("id")
        .eq("uuid", uuid)
        .single();

      if (fetchError || !existingInvoice) {
        throw new Error("Invoice not found");
      }

      // Update the invoice
      const { error: invoiceError } = await supabase
        .from("invoices")
        .update({
          client_id: data.clientId,
          invoice_number: data.invoiceNumber,
          issue_date: data.issueDate,
          payment_terms: data.paymentTerms,
          notes: data.notes,
          terms: data.terms,
          subtotal: data.subtotal,
          total: data.total,
        })
        .eq("id", existingInvoice.id);

      if (invoiceError) {
        throw new Error(`Failed to update invoice: ${invoiceError.message}`);
      }

      // Delete existing items and adjustments
      await supabase
        .from("invoice_items")
        .delete()
        .eq("invoice_id", existingInvoice.id);

      await supabase
        .from("invoice_fees_adjustments")
        .delete()
        .eq("invoice_id", existingInvoice.id);

      // Insert new items
      const invoiceItems = data.items.map((item: any) => ({
        invoice_id: existingInvoice.id,
        product_id: item.id,
        description: item.description,
        quantity: item.quantity,
        rate: item.rate,
        discount: item.discount,
        amount: item.amount,
      }));

      const { error: itemsError } = await supabase
        .from("invoice_items")
        .insert(invoiceItems);

      if (itemsError) {
        throw new Error(
          `Failed to update invoice items: ${itemsError.message}`
        );
      }

      // Insert new adjustments
      const invoiceAdjustments = data.adjustments.map((adjustment: any) => ({
        invoice_id: existingInvoice.id,
        name: adjustment.name,
        type: adjustment.isPercentage ? "percentage" : "currency",
        value: adjustment.amount,
      }));

      const { error: adjustmentsError } = await supabase
        .from("invoice_fees_adjustments")
        .insert(invoiceAdjustments);

      if (adjustmentsError) {
        throw new Error(
          `Failed to update invoice adjustments: ${adjustmentsError.message}`
        );
      }

      // Fetch the updated invoice with all related data
      const { data: updatedInvoice, error: fetchUpdatedError } = await supabase
        .from("invoices")
        .select(
          `
          *,
          invoice_items (*),
          invoice_fees_adjustments (*),
          client:clients (*)
        `
        )
        .eq("id", existingInvoice.id)
        .single();

      if (fetchUpdatedError) {
        throw new Error(
          `Failed to fetch updated invoice: ${fetchUpdatedError.message}`
        );
      }

      return NextResponse.json({ success: true, invoice: updatedInvoice });
    } catch (error) {
      console.error("Error updating invoice:", error);
      return NextResponse.json(
        {
          error:
            error instanceof Error ? error.message : "Failed to update invoice",
        },
        { status: 500 }
      );
    }
  },
});
