import { SupabaseClient } from "@supabase/supabase-js";
import { getOrganizationIdFromUuid } from "@/lib/utils/organizations";
export async function getProducts(supabase: SupabaseClient, orgUuid: string) {
  let orgId = await getOrganizationIdFromUuid(supabase, orgUuid);

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("org_id", orgId);
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

export async function deleteProduct(supabase: SupabaseClient, uuid: string) {
  // get the ID of the product
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("id")
    .eq("uuid", uuid)
    .single();
  if (productError) throw productError;

  // Check if product has any associated invoice items
  const { data: invoiceItems, error: checkError } = await supabase
    .from("invoice_products")
    .select("*")
    .eq("product_id", product.id);

  if (checkError) {
    throw checkError;
  }

  if (invoiceItems && invoiceItems.length > 0) {
    throw new Error(
      "This product cannot be deleted because it is used in one or more invoices. Please archive it instead."
    );
  }

  const { error } = await supabase.from("products").delete().eq("uuid", uuid);
  if (error) throw error;
}
