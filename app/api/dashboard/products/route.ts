import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import { get } from "http";
import { getOrganizationIdFromUuid } from "@/lib/utils/organizations";
import { apiRouteHandler } from "@/app/api/_handlers/route-handler";
import { getProducts } from "@/app/api/_handlers/products_db";

export const GET = apiRouteHandler({
  authRequired: true,
  orgUuidRequired: true,
  handler: async (request, { supabaseUser, supabase, activeOrgUuid }) => {
    try {
      return NextResponse.json(await getProducts(supabase));
    } catch (error) {
      console.error("Error fetching products:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  },
});

export const POST = apiRouteHandler({
  authRequired: true,
  orgUuidRequired: true,
  handler: async (request, { supabaseUser, supabase, activeOrgUuid }) => {
    try {
      const { data } = await request.json();

      const organizationId = await getOrganizationIdFromUuid(
        supabase,
        activeOrgUuid!
      );

      if (!organizationId) {
        return NextResponse.json(
          { error: "Organization not found" },
          { status: 404 }
        );
      }

      console.log("Creating product:", data);

      const { data: product, error } = await supabase
        .from("products")
        .insert([
          {
            org_id: organizationId,
            name: data.name,
            description: data.description || null,
            price: data.price ? parseFloat(data.price) : null,
            sku: data.sku || null,
            status: data.status || "active",
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Error creating product:", error);
        return NextResponse.json(
          { error: "Failed to create product" },
          { status: 500 }
        );
      }

      console.log("Product created:", product);
      return NextResponse.json(product);
    } catch (error) {
      console.error("Error creating product:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  },
});
