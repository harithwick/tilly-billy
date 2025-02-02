import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import { apiRouteHandler } from "@/lib/api/route-handler";

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
        return NextResponse.json(
          { error: "Failed to fetch organization" },
          { status: 500 }
        );
      }

      if (!organization) {
        return NextResponse.json(
          { error: "Organization not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(organization);
    } catch (error) {
      console.error("Error fetching organization:", error);
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
        return NextResponse.json(
          { error: "Failed to update organization" },
          { status: 500 }
        );
      }

      return NextResponse.json(organization);
    } catch (error) {
      console.error("Error updating organization:", error);
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
        return NextResponse.json(
          { error: "Failed to delete organization" },
          { status: 500 }
        );
      }

      return NextResponse.json({ message: "Organization deleted" });
    } catch (error) {
      console.error("Error deleting organization:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  },
});
