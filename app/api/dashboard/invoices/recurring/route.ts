import { NextResponse } from "next/server";
import { apiRouteHandler } from "@/app/api/_handlers/route-handler";
import {
  createRecurringInvoice,
  deleteRecurringInvoice,
  getRecurringInvoices,
  updateRecurringInvoice,
} from "@/app/api/_handlers/invoices_db";

export const GET = apiRouteHandler({
  authRequired: true,
  orgUuidRequired: true,
  handler: async (request, { supabase }) => {
    const { searchParams } = new URL(request.url);
    const recurringInvoiceId = searchParams.get("id");

    return NextResponse.json({
      recurringInvoices: await getRecurringInvoices(
        supabase,
        recurringInvoiceId ? parseInt(recurringInvoiceId) : undefined
      ),
    });
  },
});

export const POST = apiRouteHandler({
  authRequired: true,
  orgUuidRequired: true,
  handler: async (request, { supabase }) => {
    const data = await request.json();
    return NextResponse.json({
      recurringInvoice: await createRecurringInvoice(supabase, data),
    });
  },
});

export const PUT = apiRouteHandler({
  authRequired: true,
  orgUuidRequired: true,
  handler: async (request, { supabase }) => {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Recurring invoice ID is required" },
        { status: 400 }
      );
    }

    const data = await request.json();
    return NextResponse.json({
      recurringInvoice: await updateRecurringInvoice(
        supabase,
        parseInt(id),
        data
      ),
    });
  },
});

export const DELETE = apiRouteHandler({
  authRequired: true,
  orgUuidRequired: true,
  handler: async (request, { supabase }) => {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Recurring invoice ID is required" },
        { status: 400 }
      );
    }

    await deleteRecurringInvoice(supabase, parseInt(id));
    return NextResponse.json({ success: true });
  },
});
