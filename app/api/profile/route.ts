import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import { apiRouteHandler } from "@/lib/api/route-handler";

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
      console.error("Error fetching user profile:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
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
        return NextResponse.json(
          { error: "Failed to fetch user" },
          { status: 401 }
        );
      }

      const { error } = await supabase.auth.updateUser({
        email: json.email,
        data: {
          name: json.fullName,
        },
      });

      if (error) {
        return NextResponse.json(
          { error: "Failed to update profile" },
          { status: 500 }
        );
      }

      //Update the user metadata in the database
      const { error: updateUserMetadataError } = await supabase
        .from("users")
        .update({
          name: json.fullName,
        })
        .eq("supabase_uid", user?.id);

      if (updateUserMetadataError) {
        return NextResponse.json(
          { error: "Failed to update user metadata" },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("Error updating profile:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
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
        return NextResponse.json(
          { error: "Failed to delete account" },
          { status: 500 }
        );
      }

      // delete the user from the database
      const { error: deleteUserError } = await supabase
        .from("users")
        .delete()
        .eq("supabase_uid", supabaseUser!.id);

      if (deleteUserError) {
        return NextResponse.json(
          { error: "Failed to delete account" },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("Error deleting account:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  },
});
