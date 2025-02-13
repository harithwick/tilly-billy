import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { apiRouteHandler } from "@/app/api/_handlers/route-handler";

export const POST = apiRouteHandler({
  authRequired: true,
  orgUuidRequired: true,
  handler: async (request, { supabaseUser, supabase, activeOrgUuid }) => {
    try {
      const formData = await request.formData();
      const invoiceId = formData.get("invoiceId") as string;

      if (!invoiceId) {
        return NextResponse.json(
          { error: "Invoice ID is required" },
          { status: 400 }
        );
      }

      const { data: invoice, error: invoiceError } = await supabase
        .from("invoices")
        .update({
          isPaid: true,
          paidAt: new Date(),
        })
        .eq("id", invoiceId);

      if (invoiceError) {
        return NextResponse.json(
          { error: "Failed to mark invoice as paid" },
          { status: 500 }
        );
      }

      return NextResponse.json({ message: "Invoice marked as paid" });
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to mark invoice as paid" },
        { status: 500 }
      );
    }
  },
});
