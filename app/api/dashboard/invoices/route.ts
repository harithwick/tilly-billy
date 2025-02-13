import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import { apiRouteHandler } from "@/app/api/_handlers/route-handler";

export const GET = apiRouteHandler({
  authRequired: true,
  orgUuidRequired: true,
  handler: async (request, { supabaseUser, supabase, activeOrgUuid }) => {
    try {
      const { data: organizations, error } = await supabase
        .from("organizations")
        .select(
          `
        id,
        name,
        uuid,
        inv_prefix,
        email,
        logo_url,
        currency
      `
        )
        .eq("uuid", activeOrgUuid)
        .single();

      if (error) {
        console.error("Error fetching organizations:", error);
        return NextResponse.json(
          { error: "Failed to fetch organizations" },
          { status: 500 }
        );
      }

      let invoicePrefix = organizations.inv_prefix || "INV";

      // First get all invoices
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
        updated_at
      `
        )
        .eq("organization_uuid", activeOrgUuid)
        .order("created_at", { ascending: false });

      if (invoicesError) {
        console.error("Error fetching invoices:", invoicesError);
        return NextResponse.json(
          { error: "Failed to fetch invoices" },
          { status: 500 }
        );
      }

      let fromattedInvoices = invoices.map((invoice: any) => {
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
        };
      });

      // For each invoice, get its products and calculate totals
      const invoicesWithProducts = await Promise.all(
        fromattedInvoices.map(async (invoice: any) => {
          const { data: products, error: productsError } = await supabase
            .from("invoice_products")
            .select(
              `
            quantity,
            unit_price,
            discount,
            total_price,
            products (
              name,
              description,
              sku
            )
          `
            )
            .eq("invoice_id", invoice.id);

          if (productsError) {
            console.error("Error fetching invoice products:", productsError);
            return invoice;
          }

          const total =
            products?.reduce(
              (sum: any, item: any) => sum + (item.total_price || 0),
              0
            ) || 0;
          const year = new Date(invoice.createdAt).getFullYear();

          const invoiceNumber = `${invoicePrefix}-${year}-${invoice.id}`;

          return {
            ...invoice,
            products,
            total: 100,
            invoiceNumber: invoiceNumber,
            clientName: "client_name",
          };
        })
      );

      // console.log("invoicesWithProducts", invoicesWithProducts);

      return NextResponse.json({ invoices: invoicesWithProducts });
    } catch (error) {
      console.error("Error in GET /api/dashboard/invoices:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  },
});
