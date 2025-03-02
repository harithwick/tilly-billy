import { NextResponse, NextRequest } from "next/server";
import { apiRouteHandler } from "@/app/api/_handlers/route-handler";
import { archiveClient } from "@/app/api/_handlers/clients_db";

export const POST = apiRouteHandler({
  authRequired: true,
  orgUuidRequired: true,
  requiredParams: ["uuid"],
  handler: async (
    request,
    { supabaseUser, supabase, activeOrgUuid, params }
  ) => {
    try {
      return NextResponse.json(await archiveClient(supabase, params!.uuid));
    } catch (error) {
      console.error("Error archiving client:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  },
});
