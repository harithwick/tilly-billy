import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import { apiRouteHandler } from "@/lib/api/route-handler";

export const GET = apiRouteHandler({
  authRequired: true,
  orgUuidRequired: true,
  handler: async (request, { supabaseUser, supabase, activeOrgUuid }) => {
    try {
      const { data: organization, error } = await supabase
        .from("organizations")
        .select(
          `
        uuid,
        name,
        email,
        currency,
        created_at,
        updated_at,
        timezone,
        inv_prefix,
        logo_url
      `
        )
        .eq("uuid", activeOrgUuid)
        .single();

      if (error) {
        console.error("Error fetching organization settings:", error);
        return NextResponse.json(
          { error: "Failed to fetch organization settings" },
          { status: 500 }
        );
      }

      let formattedOrganization = {
        uuid: organization.uuid,
        name: organization.name,
        email: organization.email,
        currency: organization.currency,
        createdAt: organization.created_at,
        updatedAt: organization.updated_at,
        timezone: organization.timezone,
        invPrefix: organization.inv_prefix,
        logoUrl: organization.logo_url,
      };

      return NextResponse.json(formattedOrganization);
    } catch (error) {
      console.error("Error fetching organization settings:", error);
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
  handler: async (request, { supabaseUser, supabase, activeOrgUuid }) => {
    try {
      const json = await request.json();

      console.log("Updating organization settings:", json);
      const { data: organization, error } = await supabase
        .from("organizations")
        .update({
          name: json.name,
          email: json.email,
          timezone: json.timezone,
          inv_prefix: json.invPrefix,
          updated_at: new Date().toISOString(),
        })
        .eq("uuid", activeOrgUuid)
        .select()
        .single();

      if (error) {
        return NextResponse.json(
          { error: "Failed to update organization settings" },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("Error updating organization settings:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  },
});
