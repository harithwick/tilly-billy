import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { apiRouteHandler } from "@/app/api/_handlers/route-handler";
import { errorResponse } from "@/app/api/_handlers/error-response";

export const POST = apiRouteHandler({
  authRequired: true,
  orgUuidRequired: true,
  handler: async (request, { supabaseUser, supabase, activeOrgUuid }) => {
    try {
      const formData = await request.formData();
      const invoiceId = formData.get("invoiceId") as string;

      if (!invoiceId) {
        return errorResponse(new Error("Invoice ID is required"));
      }

      const { data: invoice, error: invoiceError } = await supabase
        .from("invoices")
        .update({
          isPaid: true,
          paidAt: new Date(),
        })
        .eq("id", invoiceId);

      if (invoiceError) {
        return errorResponse(invoiceError);
      }

      return NextResponse.json({ message: "Invoice marked as paid" });
    } catch (error) {
      return errorResponse(error);
    }
  },
});
