import { createSupabaseServerClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { NextResponse, NextRequest } from "next/server";
import { User } from "@supabase/supabase-js";

type ApiHandler = (
  request: NextRequest,
  context: {
    supabaseUser: User | null;
    supabase: any;
    activeOrgUuid: string | null;
    params: { [key: string]: string } | null;
  }
) => Promise<NextResponse>;
export function apiRouteHandler({
  authRequired = true,
  orgUuidRequired = true,
  requiredParams = [],
  handler,
}: {
  authRequired?: boolean;
  orgUuidRequired?: boolean;
  requiredParams?: string[];
  handler: ApiHandler;
}) {
  return async (request: NextRequest, context: any) => {
    try {
      const supabase = await createSupabaseServerClient(cookies());

      let cookieStore = await cookies();
      const activeOrgUuid = cookieStore.has("activeOrgUuid")
        ? cookieStore.get("activeOrgUuid")!.value
        : null;

      if (orgUuidRequired && !activeOrgUuid) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      let resolvedParams: { [key: string]: string } | null =
        context && context.params ? await context!.params : null;

      if (requiredParams.length > 0) {
        if (!resolvedParams) {
          return NextResponse.json(
            { error: "Missing required parameters" },
            { status: 400 }
          );
        }

        for (const param of requiredParams) {
          if (!resolvedParams[param]) {
            return NextResponse.json(
              { error: `Missing required parameter: ${param}` },
              { status: 400 }
            );
          }
        }
      }

      let user: User | null = null;
      if (authRequired) {
        const {
          data: { user: authUser },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !authUser) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        user = authUser;
      }

      const response = await handler(request, {
        supabaseUser: user,
        supabase,
        activeOrgUuid,
        params: null,
        // params: resolvedParams,
      });

      // Ensure a response is always returned
      if (!response) {
        return NextResponse.json(
          { error: "Handler did not return a response" },
          { status: 500 }
        );
      }

      return response;
    } catch (error) {
      console.error("API Error:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  };
}
