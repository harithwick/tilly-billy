import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import { getOrganizationIdFromUuid } from "@/lib/utils/organizations";

export async function GET(request: Request) {
  try {
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

    const { data: clients, error } = await supabase
      .from("clients")
      .select(
        `
        id, name, email, status, created_at, org_id
      `
      )
      .eq("org_id", organizationId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to fetch clients" },
        { status: 500 }
      );
    }

    // Transform the data to include invoice count
    const transformedClients = clients.map((client) => ({
      ...client,
      invoice_count: 0,
    }));

    return NextResponse.json(transformedClients);
  } catch (error) {
    console.error("Error fetching clients:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
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
    const { ...data } = await request.json();

    // Get organization ID from UUID
    const { data: org, error: orgError } = await supabase
      .from("organizations")
      .select("id")
      .eq("uuid", activeOrgUuid)
      .single();

    if (orgError || !org) {
      console.error("Error finding organization:", orgError);
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 }
      );
    }

    const { data: client, error } = await supabase
      .from("clients")
      .insert([
        {
          organization_id: org.id,
          name: data.name,
          email: data.email || null,
          company: data.company || null,
          phone: data.phone || null,
          website: data.website || null,
          vat_number: data.vatNumber || null,
          billing_address: data.billingAddress || null,
          shipping_address: data.shippingAddress || null,
          payment_terms: data.paymentTerms || 30,
          notes: data.notes || null,
          status: data.status || "active",
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating client:", error);
      return NextResponse.json(
        { error: "Failed to create client" },
        { status: 500 }
      );
    }

    return NextResponse.json(client);
  } catch (error) {
    console.error("Error creating client:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
