import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import { apiRouteHandler } from "@/lib/api/route-handler";
import { getOrganizationIdFromUuid } from "@/lib/utils/organizations";
export const GET = apiRouteHandler({
  authRequired: true,
  orgUuidRequired: true,
  requiredParams: ["uuid"],
  handler: async (
    request: Request,
    { supabaseUser, supabase, activeOrgUuid, params }
  ) => {
    try {
      let clientUuid = params!.uuid;
      let orgId = await getOrganizationIdFromUuid(supabase, activeOrgUuid!);
      const { data: client, error } = await supabase
        .from("clients")
        .select("*, invoices (*)")
        .eq("uuid", clientUuid)
        .eq("org_id", orgId)
        .single();

      if (error) {
        return NextResponse.json(
          { error: "Failed to fetch client" },
          { status: 500 }
        );
      }

      if (!client) {
        return NextResponse.json(
          { error: "Client not found" },
          { status: 404 }
        );
      }

      // const { data: invoices, error: invoicesError } = await supabase
      //   .from("invoices")
      //   .select("id, status")
      //   .eq("client_id", id);

      return NextResponse.json({ client });
    } catch (error) {
      console.error("Error fetching client:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  },
});

export const PATCH = apiRouteHandler({
  authRequired: true,
  orgUuidRequired: true,
  handler: async (
    request: Request,
    { supabaseUser, supabase, activeOrgUuid, params }
  ) => {
    try {
      const clientUuid = params!.uuid;
      let orgId = await getOrganizationIdFromUuid(supabase, activeOrgUuid!);

      const json = await request.json();
      console.log(json);
      const { data: client, error } = await supabase
        .from("clients")
        .update({
          name: json.name,
          email: json.email,
          company: json.company,
          phone: json.phone,
          website: json.website,
          vat_number: json.taxNumber,
          address: json.address,
          notes: json.notes,
          status: json.status,
        })
        .eq("uuid", clientUuid)
        .eq("org_id", orgId)
        .select()
        .single();

      if (error) {
        return NextResponse.json(
          { error: "Failed to update client" },
          { status: 500 }
        );
      }

      return NextResponse.json(client);
    } catch (error) {
      console.error("Error updating client:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  },
});

export const DELETE = apiRouteHandler({
  authRequired: true,
  orgUuidRequired: true,
  handler: async (
    request: Request,
    { supabaseUser, supabase, activeOrgUuid, params }
  ) => {
    try {
      const id = params!.id;

      const { data: invoices, error: checkError } = await supabase
        .from("invoices")
        .select("id")
        .eq("client_id", id)
        .limit(1);

      if (checkError) {
        return NextResponse.json(
          { error: "Failed to check client usage" },
          { status: 500 }
        );
      }

      if (invoices && invoices.length > 0) {
        return NextResponse.json(
          {
            error:
              "This client cannot be deleted because they have associated invoices. Please archive this client instead.",
          },
          { status: 400 }
        );
      }

      const { error } = await supabase.from("clients").delete().eq("id", id);

      if (error) {
        return NextResponse.json(
          { error: "Failed to delete client" },
          { status: 500 }
        );
      }

      return new NextResponse(null, { status: 204 });
    } catch (error) {
      console.error("Error deleting client:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  },
});
