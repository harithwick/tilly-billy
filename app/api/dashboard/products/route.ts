import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import { get } from "http";
import { getOrganizationIdFromUuid } from "@/lib/utils/organizations";

export async function GET(request: Request) {
  try {
    const supabase = await createSupabaseServerClient(cookies());
    const { searchParams } = new URL(request.url);

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

    const { data: products, error } = await supabase
      .from("products")
      .select(
        `
        id,
        name,
        description,
        price,
        sku,
        status,
        created_at,
        updated_at
      `
      )
      .eq("org_id", organizationId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to fetch products" },
        { status: 500 }
      );
    }

    console.log("Products fetched:", products);
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient(cookies());
    const { searchParams } = new URL(request.url);

    // get the active organization UUID from the cookie
    let cookieStore = await cookies();
    const activeOrgUuid = cookieStore.get("activeOrgUuid")?.value;
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !activeOrgUuid) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const { data } = await request.json();

    const organizationId = await getOrganizationIdFromUuid(
      supabase,
      activeOrgUuid
    );

    if (!organizationId) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 }
      );
    }

    console.log("Creating product:", data);

    const { data: product, error } = await supabase
      .from("products")
      .insert([
        {
          org_id: organizationId,
          name: data.name,
          description: data.description || null,
          price: data.price ? parseFloat(data.price) : null,
          sku: data.sku || null,
          status: data.status || "active",
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating product:", error);
      return NextResponse.json(
        { error: "Failed to create product" },
        { status: 500 }
      );
    }

    console.log("Product created:", product);
    return NextResponse.json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
