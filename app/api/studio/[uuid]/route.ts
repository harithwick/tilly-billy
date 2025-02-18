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
    const { uuid } = params;

    return NextResponse.json({ message: "Hello World" });
  },
});
