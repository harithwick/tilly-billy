import { NextResponse } from "next/server";
import { apiRouteHandler } from "@/lib/api/route-handler";
import { getOrganizationIdFromUuid } from "@/lib/utils/organizations";

export const POST = apiRouteHandler({
  authRequired: true,
  orgUuidRequired: true,
  handler: async (request, { supabase, activeOrgUuid, params }) => {
    try {
      const id = params!.id;

      let orgId = await getOrganizationIdFromUuid(supabase, activeOrgUuid!);

      const { data: client, error } = await supabase
        .from("clients")
        .update({ status: "archived" })
        .eq("id", id)
        .eq("org_id", orgId)
        .select()
        .single();

      if (error) {
        return NextResponse.json(
          { error: "Failed to archive client" },
          { status: 500 }
        );
      }

      return NextResponse.json(client);
    } catch (error) {
      console.error("Error archiving client:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  },
});
