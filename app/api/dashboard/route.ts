import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import { setActiveOrganization } from "@/lib/utils/organizations";
import { redirect } from "next/navigation";
import { apiRouteHandler } from "@/app/api/_handlers/route-handler";

export const GET = apiRouteHandler({
  authRequired: true,
  orgUuidRequired: false,
  handler: async (request, { supabaseUser, supabase, activeOrgUuid }) => {
    try {
      let cookieStore = await cookies();

      if (!activeOrgUuid) {
        await setActiveOrganization(supabase, supabaseUser, cookieStore);
      }

      const { data: orgs, error: orgsError } = await supabase
        .from("view_organization_users")
        .select("*")
        .eq("supabase_uid", supabaseUser!.id)
        .order("created_at", { ascending: false });

      if (orgsError) {
        throw orgsError;
      }

      if (orgs && orgs.length === 0) {
        return NextResponse.redirect(new URL("/create-org", request.url));
      }

      return NextResponse.json({
        organizations: orgs,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  },
});
