import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import {
  getOrganizationIdFromUuid,
  getUserIdFromSupabaseId,
} from "@/lib/utils/organizations";
import { apiRouteHandler } from "@/lib/api/route-handler";

export const GET = apiRouteHandler({
  authRequired: true,
  orgUuidRequired: true,
  handler: async (
    request: Request,
    { supabaseUser, supabase, activeOrgUuid }
  ) => {
    const organizationId = await getOrganizationIdFromUuid(
      supabase,
      activeOrgUuid!
    );

    const { data: clients, error } = await supabase
      .from("clients")
      .select(
        `
      id, name, email, status, created_at, org_id, uuid, invoices (
        id
      )
    `
      )
      .eq("org_id", organizationId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error("Failed to fetch clients");
    }

    // Transform the data to include invoice count
    const transformedClients = clients.map((client: any) => ({
      ...client,
      invoice_count: client.invoices.length,
    }));

    return NextResponse.json(transformedClients);
  },
});

export const POST = apiRouteHandler({
  authRequired: true,
  orgUuidRequired: true,
  handler: async (request, { supabaseUser, supabase, activeOrgUuid }) => {
    try {
      const { ...data } = await request.json();

      const organizationId = await getOrganizationIdFromUuid(
        supabase,
        activeOrgUuid!
      );

      // get the user id from the user object
      const userId = await getUserIdFromSupabaseId(supabase, supabaseUser!.id);

      console.log(data);

      const { data: client, error } = await supabase
        .from("clients")
        .insert([
          {
            org_id: organizationId,
            name: data.name,
            email: data.email,
            company_name: data.company || null,
            phone: data.phone || null,
            website: data.website || null,
            tax_number: data.vatNumber || null,
            status: data.status || "active",
            created_by: userId,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Error creating client:", error);
        return NextResponse.json(
          { error: "Failed to create client" },
          { status: 500 }
        );
      }

      return NextResponse.json(client);
    } catch (error) {
      console.error("Error creating client:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  },
});
