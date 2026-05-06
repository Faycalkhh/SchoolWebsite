import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export async function POST(req: NextRequest) {
  const { email, password, name, role, specialty } = await req.json();

  if (!email || !password || !name || !role) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const { data, error } = await adminSupabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) {
    if (error.message.includes("already been registered")) {
      const { data: profile } = await adminSupabase
        .from("profiles")
        .select("*")
        .eq("email", email)
        .single();
      return NextResponse.json({ user: profile });
    }
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const { data: profile, error: profileError } = await adminSupabase
    .from("profiles")
    .insert({ id: data.user.id, name, email, role, specialty: specialty ?? null })
    .select()
    .single();

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 400 });
  }

  return NextResponse.json({ user: profile });
}
