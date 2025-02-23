import { createSupabaseServerClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { SupabaseClient } from "@supabase/supabase-js";

export async function setActiveOrganization(
  supabase: any,
  user: any,
  cookieStore: any
) {
  const { data: orgs, error: orgsError } = await supabase
    .from("view_organization_users")
    .select("supabase_uid, uuid")
    .eq("supabase_uid", user.id)
    .order("created_at", { ascending: false });

  if (orgsError) {
    throw orgsError;
  }

  if (orgs && orgs.length > 0) {
    console.log("SETTING ACTIVE ORG", orgs[0].uuid);
    cookieStore.set("activeOrgUuid", orgs[0].uuid, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
  }
}

export async function getOrganizationIdFromUuid(
  supabase: SupabaseClient,
  uuid: string
): Promise<number | null> {
  try {
    const { data, error } = await supabase
      .from("organizations")
      .select("id")
      .eq("uuid", uuid)
      .single();

    if (error) {
      console.error("Error fetching organization:", error);
      return null;
    }

    return data?.id || null;
  } catch (error) {
    console.error("Error in getOrganizationIdFromUuid:", error);
    return null;
  }
}

export async function getUserIdFromSupabaseId(
  supabase: SupabaseClient,
  uuid: string
): Promise<number | null> {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("id")
      .eq("supabase_uid", uuid)
      .single();

    if (error) {
      console.error("Error fetching user:", error);
      return null;
    }

    return data?.id || null;
  } catch (error) {
    console.error("Error in getOrganizationIdFromUuid:", error);
    return null;
  }
}
