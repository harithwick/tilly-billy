import { apiRouteHandler } from "@/app/api/_handlers/route-handler";
import { NextResponse } from "next/server";
import { errorResponse } from "@/app/api/_handlers/error-response";

export const GET = apiRouteHandler({
  authRequired: true,
  orgUuidRequired: true,
  handler: async (request, { supabaseUser, supabase, activeOrgUuid }) => {
    try {
      const { data: revenueData, error: revenueError } = await supabase
        .from("view_organization_invoices")
        .select(`*`)
        .eq("organization_uuid", activeOrgUuid);

      if (revenueError) {
        return errorResponse(revenueError);
      }

      return NextResponse.json({ revenueData });
    } catch (error) {
      return errorResponse(error);
    }
  },
});
