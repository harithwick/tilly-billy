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
    return NextResponse.json({ message: "Hello World" });
  },
});
