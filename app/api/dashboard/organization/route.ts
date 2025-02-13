import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";
import {
  getUserIdFromSupabaseId,
  getOrganizationIdFromUuid,
} from "@/lib/utils/organizations";
import { apiRouteHandler } from "@/app/api/_handlers/route-handler";
import { errorResponse } from "@/app/api/_handlers/error-response";

export const POST = apiRouteHandler({
  authRequired: true,
  orgUuidRequired: false,
  handler: async (request, { supabaseUser, supabase, activeOrgUuid }) => {
    try {
      let userId = await getUserIdFromSupabaseId(supabase, supabaseUser!.id);

      if (!userId) {
        return errorResponse(new Error("Failed to get user id"));
      }

      const json = await request.json();
      const { name, email, logo, currency, timezone } = json;

      console.log("CURRENT USER userId", userId);
      // Call the `create_organization` function
      const { data, error } = await supabase.rpc("create_organization", {
        p_currency: currency,
        p_email: email,
        p_logo: logo ?? null,
        p_name: name,
        p_timezone: timezone,
        p_user_id: userId,
      });

      if (error) {
        console.error("Error calling create_organization function:", error);
        return errorResponse(error);
      }
      let cookieStore = await cookies();

      // add the new organization to the cookie
      cookieStore.set("activeOrgUuid", data.uuid);

      return NextResponse.json(data);
    } catch (error) {
      console.error("Error creating organization:", error);
      return errorResponse(error);
    }
  },
});
