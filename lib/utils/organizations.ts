import { createSupabaseServerClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { SupabaseClient } from "@supabase/supabase-js";

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
