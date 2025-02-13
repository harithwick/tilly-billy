import { SupabaseClient } from "@supabase/supabase-js";

export async function getProducts(supabase: SupabaseClient) {
  const { data, error } = await supabase.from("products").select("*");
  if (error) throw error;
  return data;
}

export async function getProduct(supabase: SupabaseClient, uuid: string) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("uuid", uuid);
  if (error) throw error;
  return data;
}
