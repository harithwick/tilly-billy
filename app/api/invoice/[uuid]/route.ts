import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { apiRouteHandler } from "@/app/api/_handlers/route-handler";
import { errorResponse } from "@/app/api/_handlers/error-response";
import {
  deleteInvoice,
  getInvoice,
  updateInvoice,
} from "@/app/api/_handlers/invoices_db";

export const GET = apiRouteHandler({
  authRequired: true,
  orgUuidRequired: true,
  requiredParams: ["uuid"],
  handler: async (
    request,
    { supabaseUser, supabase, activeOrgUuid, params }
  ) => {
    return NextResponse.json(await getInvoice(supabase, params!.uuid));
  },
});

export const POST = apiRouteHandler({
  authRequired: true,
  orgUuidRequired: true,
  requiredParams: ["uuid"],
  handler: async (
    request,
    { supabaseUser, supabase, activeOrgUuid, params }
  ) => {
    const invoice = await updateInvoice(
      supabase,
      params!.uuid,
      await request.json()
    );
    return NextResponse.json(invoice);
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
    await deleteInvoice(supabase, params!.uuid);
    return NextResponse.json({ message: "Invoice deleted" });
  },
});
