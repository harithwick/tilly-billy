import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { apiRouteHandler } from "@/app/api/_handlers/route-handler";
import { revalidatePath } from "next/cache";
import {
  deleteInvoice,
  getInvoices,
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
    return NextResponse.json(
      await getInvoices(supabase, activeOrgUuid!, params!.uuid)
    );
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
    revalidatePath("/dashboard/invoices");
    revalidatePath(`/invoice/${params!.uuid}`);
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
    console.log("Deleting invoice with UUID:", params!.uuid);
    // Force revalidation with layout segments
    revalidatePath("/dashboard/invoices", "layout");
    revalidatePath(`/invoice/${params!.uuid}`, "layout");

    // You might also want to revalidate the page specifically
    revalidatePath("/dashboard/invoices", "page");
    revalidatePath(`/invoice/${params!.uuid}`, "page");
    return NextResponse.json({ message: "Invoice deleted" });
  },
});
