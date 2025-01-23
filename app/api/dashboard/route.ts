import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  try {
    const supabase = await createSupabaseServerClient(cookies());
    const { searchParams } = new URL(request.url);
    let cookieStore = await cookies();
    let activeOrgUuid = cookieStore.get("activeOrgUuid")?.value;

    const { data: organizations, error } = await supabase
      .from("organizations")
      .select(
        `
        id,
        name,
        uuid,
        email,
        logo_url,
        currency
      `
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching organizations:", error);
      return NextResponse.json(
        { error: "Failed to fetch organizations" },
        { status: 500 }
      );
    }

    if (organizations && organizations[0].uuid && !activeOrgUuid) {
      // Set active org UUID in cookie
      let cookieStore = await cookies();

      // check if the cookie store is already set within the cookie

      cookieStore.set("activeOrgUuid", organizations[0].uuid, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });
    }

    return NextResponse.json({
      organizations,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
