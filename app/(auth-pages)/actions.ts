"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Console } from "console";

export async function loginWithEmail(
  email: string,
  password: string,
  currentURL: string
) {
  let redirectUrl = "/dashboard";
  let loginError = null;
  try {
    const supabase = await createSupabaseServerClient(cookies());
    const loginDetails = {
      email: email,
      password: password,
    };
    console.log("loginDetails", loginDetails);

    const { data, error } = await supabase.auth.signInWithPassword(
      loginDetails
    );

    if (error) {
      console.log("signInWithPassword", error);
      loginError = error;
    } else if (!error) {
      // Get user's organizations
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (!error && user) {
        const { data: orgs } = await supabase
          .from("view_organizations_users")
          .select("supabase_uid")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (orgs?.supabase_uid) {
          // Set active org UUID in cookie
          let cookieStore = await cookies();
          cookieStore.set("activeOrgUuid", orgs.supabase_uid, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
          });
        }
      }
    }
  } catch (error) {
    console.log("ACTIONS ERROR", error);
  } finally {
    if (loginError) {
      if (loginError.message) {
        redirectUrl = "/login?error=" + loginError.message;
      } else {
        redirectUrl = "/login?error=Error Occured";
      }
    } else {
      // check fi there are any query params for redirect
      const { searchParams } = new URL(currentURL);
      const redirectBase64 = searchParams.get("redirect");

      if (redirectBase64) {
        redirectUrl = Buffer.from(redirectBase64, "base64").toString();
      } else {
        redirectUrl = "/dashboard";
      }
    }
  }
  console.log("REDIRECTING TO", redirectUrl);
  redirect(redirectUrl);
}

export async function signupWithEmail(
  email: string,
  password: string,
  name: string
) {
  const supabase = await createSupabaseServerClient(cookies());

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: email,
    password: password,
    options: {
      data: {
        name: name,
      },
    },
  };

  const { error: signUpError } = await supabase.auth.signUp(data);

  if (signUpError) {
    redirect("/signup?error=" + signUpError.message);
    return;
  }

  const {
    data: { user },
    error: getUserError,
  } = await supabase.auth.getUser();

  if (getUserError) {
    redirect("/signup?error=" + getUserError.message);
    return;
  }

  // create a user in the database
  const { data: userData, error: userError } = await supabase
    .from("users")
    .insert({
      supabase_uid: user?.id,
      name: name,
      email: email,
    });

  if (userError) {
    redirect("/signup?error=" + userError.message);
    return;
  }

  redirect("/login?message=Signup successful. Please login.");
}
