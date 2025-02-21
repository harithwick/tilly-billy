import { NextResponse } from "next/server";
import { apiRouteHandler } from "@/app/api/_handlers/route-handler";
import { deleteProduct, getProduct } from "@/app/api/_handlers/products_db";
import { errorResponse } from "@/app/api/_handlers/error-response";
export const GET = apiRouteHandler({
  authRequired: true,
  orgUuidRequired: true,
  requiredParams: ["uuid"],
  handler: async (
    request,
    { supabaseUser, supabase, activeOrgUuid, params }
  ) => {
    try {
      return NextResponse.json(await getProduct(supabase, params!.uuid));
    } catch (error) {
      return errorResponse(error);
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
      let uuid = params!.uuid;
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
        return errorResponse(error);
      }

      return NextResponse.json(product);
    } catch (error) {
      return errorResponse(error);
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
      await deleteProduct(supabase, params!.uuid);
      return NextResponse.json({ message: "Product deleted successfully" });
    } catch (error) {
      return errorResponse(error);
    }
  },
});
