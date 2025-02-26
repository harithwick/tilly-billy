import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import { getOrganizationIdFromUuid } from "@/lib/utils/organizations";
import { apiRouteHandler } from "@/app/api/_handlers/route-handler";
import { errorResponse } from "@/app/api/_handlers/error-response";

export const GET = apiRouteHandler({
  authRequired: true,
  orgUuidRequired: false,
  handler: async (request, { supabaseUser, supabase, activeOrgUuid }) => {
    try {
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
        return errorResponse(orgError);
      }

      // Get active clients
      const { data: clients, error: clientsError } = await supabase
        .from("clients")
        .select("*")
        .eq("org_id", organizationId)
        .eq("status", "active");
      console.log("clients", clients);
      if (clientsError) {
        return errorResponse(clientsError);
      }

      // Get active products
      const { data: products, error: productsError } = await supabase
        .from("products")
        .select("*")
        .eq("org_id", organizationId)
        .eq("status", "active");

      if (productsError) {
        return errorResponse(productsError);
      }

      return NextResponse.json({
        organization,
        clients,
        products,
      });
    } catch (error) {
      return errorResponse(error);
    }
  },
});

export const POST = apiRouteHandler({
  authRequired: true,
  orgUuidRequired: false,
  handler: async (request, { supabaseUser, supabase, activeOrgUuid }) => {
    try {
      const data = await request.json();
      const organizationId = await getOrganizationIdFromUuid(
        supabase,
        activeOrgUuid!
      );

      console.log("data", data);
      // Start a Supabase transaction
      const { data: invoice, error: invoiceError } = await supabase
        .from("invoices")
        .insert({
          client_id: data.clientId,
          issue_date: data.issueDate,
          notes: data.notes,
          terms: data.terms,
          status: "draft", // You might want to make this configurable
        })
        .select()
        .single();

      if (invoiceError) {
        throw new Error(`Failed to create invoice: ${invoiceError.message}`);
      }

      // Insert invoice items
      const invoiceItems = data.items.map((item: any) => ({
        invoice_id: invoice.id,
        product_id: item.id,
        quantity: item.quantity,
        unit_price: item.rate,
        discount: item.discount,
        total_price: item.amount,
      }));

      const { error: itemsError } = await supabase
        .from("invoice_products")
        .insert(invoiceItems);

      if (itemsError) {
        throw new Error(
          `Failed to create invoice items: ${itemsError.message}`
        );
      }

      // Insert invoice adjustments
      const invoiceAdjustments = data.adjustments.map((adjustment: any) => ({
        invoice_id: invoice.id,
        name: adjustment.name,
        type: adjustment.isPercentage ? "percentage" : "currency",
        amount: adjustment.value,
      }));

      const { error: adjustmentsError } = await supabase
        .from("invoice_fees_adjustments")
        .insert(invoiceAdjustments);

      if (adjustmentsError) {
        throw new Error(
          `Failed to create invoice adjustments: ${adjustmentsError.message}`
        );
      }

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("Error creating invoice:", error);
      return NextResponse.json(
        {
          error:
            error instanceof Error ? error.message : "Failed to create invoice",
        },
        { status: 500 }
      );
    }
  },
});
