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
