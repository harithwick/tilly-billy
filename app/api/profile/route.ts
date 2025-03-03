import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import { apiRouteHandler } from "@/app/api/_handlers/route-handler";
import { errorResponse } from "@/app/api/_handlers/error-response";
import { apiRequest } from "@/lib/utils/api-request";
import { HttpMethod } from "@/lib/utils/api-request";

export const GET = apiRouteHandler({
  authRequired: true,
  orgUuidRequired: false,
  handler: async (request, { supabaseUser, supabase, activeOrgUuid }) => {
    try {
      // const { data: subscription, error: subscriptionError } = await supabase
      //   .from("subscriptions")
      //   .select("*")
      //   .eq("user_id", user?.id)
      //   .eq("organization_id", activeOrgUuid);

      // if (!subscriptionError) {
      //   return NextResponse.json(
      //     { error: "Failed to fetch subscription" },
      //     { status: 401 }
      //   );
      // }

      return NextResponse.json({
        fullName: supabaseUser?.user_metadata?.name || "",
        email: supabaseUser?.email || "",
        // subscription: subscription,
      });
    } catch (error) {
      return errorResponse(error);
    }
  },
});

export const POST = apiRouteHandler({
  authRequired: true,
  orgUuidRequired: false,
  handler: async (request, { supabaseUser, supabase, activeOrgUuid }) => {
    try {
      const supabase = await createSupabaseServerClient(cookies());
      const { searchParams } = new URL(request.url);

      // get the active organization UUID from the cookie
      let cookieStore = await cookies();
      const activeOrgUuid = cookieStore.get("activeOrgUuid")?.value;

      const {
        data: { user },
      } = await supabase.auth.getUser();
      const json = await request.json();

      if (!user || !activeOrgUuid) {
        return errorResponse(new Error("Unauthorized"));
      }

      const { error } = await supabase.auth.updateUser({
        email: json.email,
        data: {
          name: json.fullName,
        },
      });

      if (error) {
        return errorResponse(error);
      }

      //Update the user metadata in the database
      const { error: updateUserMetadataError } = await supabase
        .from("users")
        .update({
          name: json.fullName,
        })
        .eq("supabase_uid", user?.id);

      if (updateUserMetadataError) {
        return errorResponse(updateUserMetadataError);
      }

      return NextResponse.json({ success: true });
    } catch (error) {
      return errorResponse(error);
    }
  },
});

export const DELETE = apiRouteHandler({
  authRequired: true,
  orgUuidRequired: false,
  handler: async (request, { supabaseUser, supabase, activeOrgUuid }) => {
    try {
      const { error } = await supabase.auth.admin.deleteUser(
        (await supabase.auth.getUser()).data.user?.id || ""
      );

      if (error) {
        return errorResponse(error);
      }

      // delete the user from the database
      const { error: deleteUserError } = await supabase
        .from("users")
        .delete()
        .eq("supabase_uid", supabaseUser!.id);

      if (deleteUserError) {
        return errorResponse(deleteUserError);
      }

      return NextResponse.json({ success: true });
    } catch (error) {
      return errorResponse(error);
    }
  },
});
