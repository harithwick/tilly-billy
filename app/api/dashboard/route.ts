import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import { setActiveOrganization } from "@/lib/utils/organizations";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  try {
    const supabase = await createSupabaseServerClient(cookies());
    const { searchParams } = new URL(request.url);
    let cookieStore = await cookies();
    let activeOrgUuid = cookieStore.get("activeOrgUuid")?.value;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (!activeOrgUuid) {
      await setActiveOrganization(supabase, user, cookieStore);
    }

    const { data: orgs, error: orgsError } = await supabase
      .from("view_organization_users")
      .select("*")
      .eq("supabase_uid", user.id)
      .order("created_at", { ascending: false });

    if (orgsError) {
      throw orgsError;
    }

    if (orgs && orgs.length === 0) {
      return NextResponse.redirect(new URL("/create-org", request.url));
    }

    return NextResponse.json({
      organizations: orgs,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
