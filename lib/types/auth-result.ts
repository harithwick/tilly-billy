import { NextResponse, NextRequest } from "next/server";
import { SupabaseClient } from "@supabase/supabase-js";

interface AuthResultSuccess {
  error: false;
  organizationId: number;
  supabase: SupabaseClient<any>;
  user: any; // Replace with a specific user type if available
}

interface AuthResultError {
  error: true;
  response: NextResponse;
}

export type AuthResult = AuthResultSuccess | AuthResultError;

export const mapAuthResultSuccess = (raw: any): AuthResultSuccess => ({
  error: false,
  organizationId: raw.organizationId,
  supabase: raw.supabase,
  user: raw.user,
});

export const mapAuthResultError = (raw: any): AuthResultError => ({
  error: true,
  response: raw.response,
});
