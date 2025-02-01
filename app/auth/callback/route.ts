import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  if (code) {
    const supabase = await createSupabaseServerClient(cookies());

    // Exchange the code for a session
    const {
      data: { user },
      error: sessionError,
    } = await supabase.auth.exchangeCodeForSession(code);

    if (sessionError) {
      return NextResponse.redirect(new URL("/auth/error", requestUrl.origin));
    }

    if (user) {
      // Check if user already exists in your users table
      const { data: existingUser, error: fetchError } = await supabase
        .from("users")
        .select()
        .eq("supabase_uid", user.id)
        .single();

      if (!existingUser) {
        const { error: insertError } = await supabase.from("users").insert([
          {
            supabase_uid: user.id,
            email: user.email,
            name: user.user_metadata.name,
          },
        ]);

        if (insertError) {
          return NextResponse.redirect(
            new URL("/auth/error", requestUrl.origin)
          );
        }
      }
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL("/dashboard", requestUrl.origin));
}
