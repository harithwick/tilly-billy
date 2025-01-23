import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";

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

    // Get total revenue (sum of paid invoices)
    const { data: revenueData, error: revenueError } = await supabase
      .from("view_organization_invoices")
      .select(`*`)
      .eq("organization_uuid", activeOrgUuid);

    if (revenueError) {
      console.error("Error fetching revenue data:", revenueError);
      return NextResponse.json(
        { error: "Failed to fetch revenue data" },
        { status: 500 }
      );
    }

    return NextResponse.json({ revenueData });
  } catch (error) {
    console.error("Error fetching dashboard metrics:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
