import { createSupabaseServerClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { NextResponse, NextRequest } from "next/server";
import { User } from "@supabase/supabase-js";
type ApiHandler = (
  request: NextRequest,
  context: {
    user: User | null;
    supabase: any;
    activeOrgUuid: string | null;
  }
) => Promise<NextResponse> | NextResponse;

export function apiRouteHandler({
  authRequired = true,
  handler,
}: {
  authRequired?: boolean;
  handler: ApiHandler;
}) {
  return async (request: NextRequest) => {
    try {
      const supabase = await createSupabaseServerClient(cookies());

      let cookieStore = await cookies();

      const activeOrgUuid = cookieStore.has("activeOrgUuid")
        ? cookieStore.get("activeOrgUuid")!.value
        : null;

      let user: User | null = null;

      if (authRequired) {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
      }

      return handler(request, {
        user,
        supabase,
        activeOrgUuid,
      });
    } catch (error) {
      console.error("API Error:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  };
}
