import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import { apiRouteHandler } from "@/app/api/_handlers/route-handler";
import { getOrganizationIdFromUuid } from "@/lib/utils/organizations";
import {
  getClient,
  deleteClient,
  updateClient,
} from "@/app/api/_handlers/clients_db";

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
    return NextResponse.json(
      await updateClient(supabase, params!.uuid, request.json(), activeOrgUuid!)
    );
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
