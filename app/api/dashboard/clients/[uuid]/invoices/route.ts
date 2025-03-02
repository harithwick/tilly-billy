import { getClientInvoices } from "@/app/api/_handlers/invoices_db";
import { NextRequest, NextResponse } from "next/server";
import { apiRouteHandler } from "@/app/api/_handlers/route-handler";

export const GET = apiRouteHandler({
  authRequired: true,
  orgUuidRequired: true,
  handler: async (
    request,
    { supabaseUser, supabase, activeOrgUuid, params }
  ) => {
    return NextResponse.json({
      invoices: await getClientInvoices(supabase, activeOrgUuid!, params!.uuid),
    });
  },
});
