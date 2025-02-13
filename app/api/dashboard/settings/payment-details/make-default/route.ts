import { NextResponse } from "next/server";
import { apiRouteHandler } from "@/app/api/_handlers/route-handler";
import { getOrganizationIdFromUuid } from "@/lib/utils/organizations";

export const POST = apiRouteHandler({
  authRequired: true,
  orgUuidRequired: true,
  handler: async (request, { supabase, activeOrgUuid }) => {
    try {
      const { id } = await request.json();

      if (!id) {
        return NextResponse.json(
          { error: "Payment detail ID is required" },
          { status: 400 }
        );
      }

      const orgId = await getOrganizationIdFromUuid(supabase, activeOrgUuid!);

      // Verify the payment detail belongs to the organization
      const { data: existingDetail } = await supabase
        .from("payment_details")
        .select("id")
        .eq("id", id)
        .eq("org_id", orgId)
        .single();

      if (!existingDetail) {
        return NextResponse.json(
          { error: "Payment detail not found" },
          { status: 404 }
        );
      }

      // unset the current default payment detail
      const { error: unsetDefaultError } = await supabase
        .from("payment_details")
        .update({ default: false })
        .eq("org_id", orgId)
        .eq("default", true);

      const { error: updateError } = await supabase
        .from("payment_details")
        .update({ default: true })
        .eq("id", id);

      if (updateError || unsetDefaultError) {
        console.error(
          "Error setting default payment detail:",
          updateError,
          unsetDefaultError
        );
        return NextResponse.json(
          { error: "Failed to set default payment detail" },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("Error setting default payment detail:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  },
});
