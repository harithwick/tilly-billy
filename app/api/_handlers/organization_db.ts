import { SupabaseClient } from "@supabase/supabase-js";
import { keysToCamelCase } from "@/lib/utils/utilities";

export async function getOrganization(supabase: SupabaseClient, uuid: string) {
  const { data: organization, error: organizationError } = await supabase
    .from("organizations")
    .select("*")
    .eq("uuid", uuid)
    .single();

  if (organizationError) throw organizationError;
  return keysToCamelCase(organization);
}
