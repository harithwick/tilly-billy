import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import { apiRouteHandler } from "@/lib/api/route-handler";

export const GET = apiRouteHandler({
  authRequired: true,
  orgUuidRequired: true,
  requiredParams: ["uuid"],
  handler: async (
    request,
    { supabaseUser, supabase, activeOrgUuid, params }
  ) => {
    try {
      let uuid = params!.uuid;

      const { data: product, error } = await supabase
        .from("products")
        .select("*")
        .eq("uuid", uuid)
        .single();

      if (error) {
        return NextResponse.json(
          { error: "Failed to fetch product" },
          { status: 500 }
        );
      }

      if (!product) {
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  },
});

export const PATCH = apiRouteHandler({
  authRequired: true,
  orgUuidRequired: true,
  handler: async (
    request,
    { supabaseUser, supabase, activeOrgUuid, params }
  ) => {
    try {
      const { ...data } = await request.json();

      let uuid = params!.uuid;

      // get the active organization UUID from the cookie
      let cookieStore = await cookies();
      const activeOrgUuid = cookieStore.get("activeOrgUuid")?.value;
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user || !activeOrgUuid) {
        return NextResponse.redirect(new URL("/login", request.url));
      }
      const json = await request.json();

      console.log("updating json", json);

      const { data: product, error } = await supabase
        .from("products")
        .update({
          name: json.name,
          description: json.description,
          price: json.price,
          sku: json.sku,
          status: json.status,
          notes: json.notes,
        })
        .eq("uuid", uuid)
        .select()
        .single();

      if (error) {
        return NextResponse.json(
          { error: "Failed to update product" },
          { status: 500 }
        );
      }

      return NextResponse.json(product);
    } catch (error) {
      console.error("Error updating product:", error);
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
    request,
    { supabaseUser, supabase, activeOrgUuid, params }
  ) => {
    try {
      const id = params!.id;

      // Check if product has any associated invoice items
      const { data: invoiceItems, error: checkError } = await supabase
        .from("invoice_products")
        .select("id")
        .eq("product_id", id)
        .limit(1);

      if (checkError) {
        return NextResponse.json(
          { error: "Failed to check product usage" },
          { status: 500 }
        );
      }

      if (invoiceItems && invoiceItems.length > 0) {
        return NextResponse.json(
          {
            error:
              "This product cannot be deleted because it is used in one or more invoices. Please archive it instead.",
          },
          { status: 400 }
        );
      }

      const { error } = await supabase.from("products").delete().eq("id", id);

      if (error) {
        console.error("Error deleting product:", error);
        return NextResponse.json(
          { error: "Failed to delete product" },
          { status: 500 }
        );
      }

      return new NextResponse(null, { status: 204 });
    } catch (error) {
      console.error("Error deleting product:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  },
});
