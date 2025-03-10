import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import { apiRouteHandler } from "@/app/api/_handlers/route-handler";

export const GET = apiRouteHandler({
  authRequired: true,
  orgUuidRequired: true,
  handler: async (
    request,
    { supabaseUser, supabase, activeOrgUuid, params }
  ) => {
    try {
      const uuid = params!.uuid;

      const { data: invoice, error: invoiceError } = await supabase
        .from("invoices")
        .select(
          `
        id,
        client_id,
        uuid,
        issue_date,
        due_date,
        notes,
        created_at,
        updated_at
      `
        )
        .eq("uuid", uuid)
        .single();

      if (invoiceError) {
        return NextResponse.json(
          { error: "Failed to fetch invoice" },
          { status: 500 }
        );
      }

      if (!invoice) {
        return NextResponse.json(
          { error: "Invoice not found" },
          { status: 404 }
        );
      }

      // Get invoice products
      const { data: products, error: productsError } = await supabase
        .from("invoice_products")
        .select(
          `
        id,
        product_id,
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
        return NextResponse.json(
          { error: "Failed to fetch invoice products" },
          { status: 500 }
        );
      }

      // const total = products.reduce(
      //   (sum, item) => sum + (item.total_price || 0),
      //   0
      // );

      return NextResponse.json({
        ...invoice,
        products,
        total: 0,
      });
    } catch (error) {
      console.error("Error fetching invoice:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  },
});

export const DELETE = apiRouteHandler({
  authRequired: true,
  orgUuidRequired: true,
  handler: async (
    request: Request,
    { supabaseUser, supabase, activeOrgUuid, params }
  ) => {
    try {
      const uuid = params!.uuid;

      // get the active organization UUID from the cookie
      let cookieStore = await cookies();
      const activeOrgUuid = cookieStore.get("activeOrgUuid")?.value;
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user || !activeOrgUuid) {
        return NextResponse.redirect(new URL("/login", request.url));
      }

      // get the invoice id from the uuid
      const { data: invoiceId, error: invoiceIdError } = await supabase
        .from("invoices")
        .select("id")
        .eq("uuid", uuid)
        .single();

      if (invoiceIdError) {
        return NextResponse.json(
          { error: "Failed to fetch invoice id" },
          { status: 500 }
        );
      }

      let id = invoiceId!.id;

      // Delete invoice products first (cascade will handle this, but being explicit)
      const { error: productsError } = await supabase
        .from("invoice_products")
        .delete()
        .eq("invoice_id", id);
      if (productsError) {
        return NextResponse.json(
          { error: "Failed to delete invoice products" },
          { status: 500 }
        );
      }

      // Delete the invoice
      const { error: invoiceError } = await supabase
        .from("invoices")
        .delete()
        .eq("id", id);

      if (invoiceError) {
        return NextResponse.json(
          { error: "Failed to delete invoice" },
          { status: 500 }
        );
      }

      return new NextResponse(null, { status: 204 });
    } catch (error) {
      console.error("Error deleting invoice:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  },
});
