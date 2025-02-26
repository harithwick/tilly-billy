import { NextResponse } from "next/server";
import { apiRouteHandler } from "@/app/api/_handlers/route-handler";
import { getInvoices } from "@/app/api/_handlers/invoices_db";

export const GET = apiRouteHandler({
  authRequired: true,
  orgUuidRequired: true,
  handler: async (request, { supabase, activeOrgUuid }) => {
    return NextResponse.json({
      invoices: await getInvoices(supabase, activeOrgUuid!),
    });
  },
});
