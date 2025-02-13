import { apiRouteHandler } from "@/app/api/_handlers/route-handler";
import { NextResponse } from "next/server";

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
        console.error("Error fetching revenue data:", revenueError);
        return NextResponse.json(
          { error: "Failed to fetch revenue data" },
          { status: 500 }
        );
      }

      return NextResponse.json({ revenueData });
    } catch (error) {
      console.error("Error fetching dashboard metrics:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  },
});
