import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import { apiRouteHandler } from "@/app/api/_handlers/route-handler";
import { getOrganizationIdFromUuid } from "@/lib/utils/organizations";
import { getClient, deleteClient } from "@/app/api/_handlers/clients_db";
import { errorResponse } from "@/app/api/_handlers/error-response";

export const GET = apiRouteHandler({
  authRequired: true,
  orgUuidRequired: true,
  requiredParams: ["uuid"],
  handler: async (
    request: Request,
    { supabaseUser, supabase, activeOrgUuid, params }
  ) => NextResponse.json(await getClient(supabase, params!.uuid, true)),
});

export const PATCH = apiRouteHandler({
  authRequired: true,
  orgUuidRequired: true,
  handler: async (
    request: Request,
    { supabaseUser, supabase, activeOrgUuid, params }
  ) => {
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
      return errorResponse(error);
    }

    return NextResponse.json(client);
  },
});

export const DELETE = apiRouteHandler({
  authRequired: true,
  orgUuidRequired: true,
  requiredParams: ["uuid"],
  handler: async (
    request: Request,
    { supabaseUser, supabase, activeOrgUuid, params }
  ) => {
    await deleteClient(supabase, params!.uuid);
    return new NextResponse(null, { status: 204 });
  },
});
