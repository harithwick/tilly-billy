import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import { apiRouteHandler } from "@/app/api/_handlers/route-handler";
import { errorResponse } from "@/app/api/_handlers/error-response";

export const GET = apiRouteHandler({
  authRequired: true,
  orgUuidRequired: true,
  requiredParams: ["uuid"],
  handler: async (
    request: Request,
    { supabaseUser, supabase, activeOrgUuid, params }
  ) => {
    try {
      const { data: organization, error } = await supabase
        .from("organizations")
        .select("*")
        .eq("uuid", params!.uuid)
        .single();

      if (error) {
        return errorResponse(error);
      }

      if (!organization) {
        return errorResponse(new Error("Organization not found"));
      }

      return NextResponse.json(organization);
    } catch (error) {
      return errorResponse(error);
    }
  },
});

export const PATCH = apiRouteHandler({
  authRequired: true,
  orgUuidRequired: true,
  requiredParams: ["uuid"],
  handler: async (
    request,
    { supabaseUser, supabase, activeOrgUuid, params }
  ) => {
    try {
      const json = await request.json();

      let uuid = params!.uuid;

      const { data: organization, error } = await supabase
        .from("organizations")
        .update({
          name: json.name,
          email: json.email,
          logo_url: json.logo_url,
          inv_prefix: json.inv_prefix,
          timezone: json.timezone,
          updated_at: new Date().toISOString(),
        })
        .eq("uuid", uuid)
        .select()
        .single();

      if (error) {
        return errorResponse(error);
      }

      return NextResponse.json(organization);
    } catch (error) {
      return errorResponse(error);
    }
  },
});

export const DELETE = apiRouteHandler({
  authRequired: true,
  orgUuidRequired: true,
  requiredParams: ["uuid"],
  handler: async (
    request,
    { supabaseUser, supabase, activeOrgUuid, params }
  ) => {
    try {
      let uuid = params!.uuid;

      const { data, error } = await supabase
        .from("organizations")
        .delete()
        .eq("uuid", uuid);

      if (error) {
        return errorResponse(error);
      }

      return NextResponse.json({ message: "Organization deleted" });
    } catch (error) {
      return errorResponse(error);
    }
  },
});
