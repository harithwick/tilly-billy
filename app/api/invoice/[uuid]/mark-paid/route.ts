import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { apiRouteHandler } from "@/app/api/_handlers/route-handler";
import { errorResponse } from "@/app/api/_handlers/error-response";
import { toggleInvoicePaidStatus } from "@/app/api/_handlers/invoices_db";
export const POST = apiRouteHandler({
  authRequired: true,
  orgUuidRequired: true,
  requiredParams: ["uuid"],
  handler: async (
    request,
    { supabaseUser, supabase, activeOrgUuid, params }
  ) => {
    try {
      await toggleInvoicePaidStatus(supabase, params!.uuid);
      return NextResponse.json({ message: "Invoice marked as paid" });
    } catch (error) {
      return errorResponse(error);
    }
  },
});
