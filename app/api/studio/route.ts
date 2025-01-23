import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import { getOrganizationIdFromUuid } from "@/lib/utils/organizations";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const invoiceId = searchParams.get("invoiceId");

    const supabase = await createSupabaseServerClient(cookies());

    // get the active organization UUID from the cookie
    let cookieStore = await cookies();
    const activeOrgUuid = cookieStore.get("activeOrgUuid")?.value;
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !activeOrgUuid) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    const organizationId = await getOrganizationIdFromUuid(
      supabase,
      activeOrgUuid
    );
    console.log("organizationId", organizationId);
    // Get active clients
    const { data: clients, error: clientsError } = await supabase
      .from("clients")
      .select("*")
      .eq("org_id", organizationId)
      .eq("status", "active");
    console.log("clients", clients);
    if (clientsError) {
      return NextResponse.json(
        { error: "Failed to fetch clients" },
        { status: 500 }
      );
    }

    // Get active products
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("*")
      .eq("org_id", organizationId)
      .eq("status", "active");

    if (productsError) {
      return NextResponse.json(
        { error: "Failed to fetch products" },
        { status: 500 }
      );
    }

    let invoice = null;
    if (invoiceId) {
      // Get invoice details if invoiceId is provided
      const { data: invoiceData, error: invoiceError } = await supabase
        .from("invoices")
        .select(
          `
          *,
          invoice_items (
            *,
            product:products (*)
          ),
          client:clients (*)
        `
        )
        .eq("id", invoiceId)
        .single();

      if (invoiceError) {
        return NextResponse.json(
          { error: "Failed to fetch invoice" },
          { status: 500 }
        );
      }

      invoice = invoiceData;
    }
    console.log(clients);
    console.log(products);
    console.log(invoice);
    return NextResponse.json({
      clients,
      products,
      invoice,
    });
  } catch (error) {
    console.error("Error in studio endpoint:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
