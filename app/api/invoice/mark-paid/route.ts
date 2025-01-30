import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient(cookies());
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
}
