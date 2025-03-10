import { NextResponse } from "next/server";
import { apiRouteHandler } from "@/app/api/_handlers/route-handler";
import { archiveClient } from "@/app/api/_handlers/clients_db";
import { errorResponse } from "@/app/api/_handlers/error-response";

export const POST = apiRouteHandler({
  authRequired: true,
  orgUuidRequired: true,
  handler: async (
    request,
    { supabaseUser, supabase, activeOrgUuid, params }
  ) => {
    try {
      console.log("unarchiving client", params!.uuid);
      return NextResponse.json(
        await archiveClient(supabase, params!.uuid, false)
      );
    } catch (error) {
      return errorResponse(error);
    }
  },
});
