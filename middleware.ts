import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const authRequiredPaths = [
  "/dashboard",
  "/studio",
  "/create-studio",
  "/profile",
];

export async function middleware(request: NextRequest) {
  try {
    let supabaseResponse = NextResponse.next({
      request,
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              request.cookies.set(name, value)
            );
            supabaseResponse = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    // Do not run code between createServerClient and
    // supabase.auth.getUser(). A simple mistake could make it very hard to debug
    // issues with users being randomly logged out.

    // IMPORTANT: DO NOT REMOVE auth.getUser()

    const {
      data: { user },
    } = await supabase.auth.getUser();

    console.log("MIDDLEWARE PATH", request.nextUrl.pathname);
    console.log("MIDDLEWARE USER", user);

    // Check if the path requires the user to be logged in
    const requiresAuth = authRequiredPaths.some((path) =>
      request.nextUrl.pathname.startsWith(path)
    );

    // check if the path requires the user to be logged in
    if (!user && requiresAuth) {
      console.log("loggedRequiredPaths");
      // pass in the current URL so the user can be redirected back after logging in
      let currentUrlBase64 = Buffer.from(request.nextUrl.pathname).toString(
        "base64"
      );
      const url = request.nextUrl.clone();
      console.log("URL 1", url);
      url.pathname = "/login" + `?redirect=${currentUrlBase64}`;
      console.log("URL 2", url);
      return NextResponse.redirect(
        new URL("/login" + `?redirect=${currentUrlBase64}`, request.url)
      );
    }

    // IMPORTANT: You *must* return the supabaseResponse object as it is.
    // If you're creating a new response object with NextResponse.next() make sure to:
    // 1. Pass the request in it, like so:
    //    const myNewResponse = NextResponse.next({ request })
    // 2. Copy over the cookies, like so:
    //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
    // 3. Change the myNewResponse object to fit your needs, but avoid changing
    //    the cookies!
    // 4. Finally:
    //    return myNewResponse
    // If this is not done, you may be causing the browser and server to go out
    // of sync and terminate the user's session prematurely!

    return supabaseResponse;
  } catch (error) {
    console.error("Auth middleware error:", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - auth callback route
     */
    "/((?!_next/static|_next/image|favicon.ico|public|auth/callback).*)",
  ],
};
