import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import { getOrganizationIdFromUuid } from "@/lib/utils/organizations";
import { apiRouteHandler } from "@/lib/api/route-handler";

export const GET = apiRouteHandler({
  authRequired: true,
  orgUuidRequired: false,
  handler: async (request, { supabaseUser, supabase, activeOrgUuid }) => {
    try {
      const { searchParams } = new URL(request.url);
      const invoiceId = searchParams.get("invoiceId");

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
      console.log("clients", clients);
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

      let invoice = null;
      if (invoiceId) {
        // Get invoice details if invoiceId is provided
        const { data: invoiceData, error: invoiceError } = await supabase
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
          .eq("id", invoiceId)
          .single();

        if (invoiceError) {
          return NextResponse.json(
            { error: "Failed to fetch invoice" },
            { status: 500 }
          );
        }

        invoice = invoiceData;
      }

      return NextResponse.json({
        organization,
        clients,
        products,
        invoice,
      });
    } catch (error) {
      console.error("Error in studio endpoint:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  },
});
