import { NextResponse } from "next/server";
import { apiRouteHandler } from "@/app/api/_handlers/route-handler";
import { archiveClient } from "@/app/api/_handlers/clients_db";

export const POST = apiRouteHandler({
  authRequired: true,
  orgUuidRequired: true,
  handler: async (request, { supabase, activeOrgUuid, params }) => {
    try {
      return NextResponse.json(
        await archiveClient(supabase, params!.uuid, false)
      );
    } catch (error) {
      console.error("Error unarchiving client:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  },
});
