import { apiRouteHandler } from "@/app/api/_handlers/route-handler";
import { NextResponse } from "next/server";
import { errorResponse } from "@/app/api/_handlers/error-response";
import { getOrganizationIdFromUuid } from "@/lib/utils/organizations";

export const GET = apiRouteHandler({
  authRequired: true,
  orgUuidRequired: true,
  handler: async (request, { supabaseUser, supabase, activeOrgUuid }) => {
    try {
      let orgId = await getOrganizationIdFromUuid(supabase, activeOrgUuid!);

      // Get revenue data
      const { data: revenueData, error: revenueError } = await supabase
        .from("view_organization_invoices")
        .select(`*`)
        .eq("organization_uuid", activeOrgUuid);

      if (revenueError) {
        return errorResponse(revenueError);
      }

      // Get client growth data
      const { data: clientData, error: clientError } = await supabase
        .from("clients")
        .select("created_at, status")
        .eq("org_id", orgId)
        .order("created_at", { ascending: true });

      if (clientError) {
        return errorResponse(clientError);
      }

      // Process client growth data by day
      const clientGrowthData = processClientGrowthData(clientData);

      return NextResponse.json({
        revenueData,
        clientGrowthData,
      });
    } catch (error) {
      return errorResponse(error);
    }
  },
});

function processClientGrowthData(clientData: any) {
  const dailyGrowth: any = {};

  // Initialize all dates in the range
  const startDate = new Date(
    Math.min(...clientData.map((c: any) => new Date(c.created_at)))
  );
  const endDate = new Date();

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateKey = d.toISOString().split("T")[0];
    dailyGrowth[dateKey] = {
      total: 0,
      active: 0,
    };
  }

  // Count clients for each day
  clientData.forEach((client: any) => {
    const date = new Date(client.created_at);
    const dateKey = date.toISOString().split("T")[0];

    if (!dailyGrowth[dateKey]) {
      dailyGrowth[dateKey] = {
        total: 0,
        active: 0,
      };
    }

    dailyGrowth[dateKey].total++;
    if (client.status === "active") {
      dailyGrowth[dateKey].active++;
    }
  });

  // Convert to cumulative numbers
  let runningTotal = 0;
  let runningActive = 0;

  // Convert to array format for charting with cumulative totals
  return Object.entries(dailyGrowth).map(([date, data]: [string, any]) => {
    runningTotal += data.total;
    runningActive += data.active;
    return {
      day: date,
      totalClients: runningTotal,
      activeClients: runningActive,
    };
  });
}
