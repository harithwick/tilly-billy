import { NextResponse } from "next/server";
import { getOrganizationIdFromUuid } from "@/lib/utils/organizations";
import { apiRouteHandler } from "@/app/api/_handlers/route-handler";

export const GET = apiRouteHandler({
  authRequired: true,
  orgUuidRequired: false,
  handler: async (
    request,
    { supabaseUser, supabase, activeOrgUuid, params }
  ) => {
    try {
      const invoiceUuid = params!.uuid;

      const organizationId = await getOrganizationIdFromUuid(
        supabase,
        activeOrgUuid!
      );

      // Get organization details
      const { data: organization, error: orgError } = await supabase
        .from("organizations")
        .select("*")
        .eq("id", organizationId)
        .single();

      if (orgError) {
        return NextResponse.json(
          { error: "Failed to fetch organization details" },
          { status: 500 }
        );
      }

      // Get active clients
      const { data: clients, error: clientsError } = await supabase
        .from("clients")
        .select("*")
        .eq("org_id", organizationId)
        .eq("status", "active");

      if (clientsError) {
        return NextResponse.json(
          { error: "Failed to fetch clients" },
          { status: 500 }
        );
      }

      // Get active products
      const { data: products, error: productsError } = await supabase
        .from("products")
        .select("*")
        .eq("org_id", organizationId)
        .eq("status", "active");

      if (productsError) {
        return NextResponse.json(
          { error: "Failed to fetch products" },
          { status: 500 }
        );
      }

      // Get invoice details by UUID
      const { data: invoice, error: invoiceError } = await supabase
        .from("invoices")
        .select(
          `
          *,
          invoice_items (
            *,
            product:products (*)
          ),
          client:clients (*)
        `
        )
        .eq("uuid", invoiceUuid)
        .single();

      if (invoiceError) {
        return NextResponse.json(
          { error: "Invoice not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        organization,
        clients,
        products,
        invoice,
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
        value: adjustment.value,
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
