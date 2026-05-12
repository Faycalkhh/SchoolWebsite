import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export async function GET() {
  const { data } = await adminSupabase
    .from("profiles")
    .select("name, specialty, bio, photo")
    .eq("role", "professor")
    .order("created_at");

  return NextResponse.json(data ?? []);
}
