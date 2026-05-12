import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export async function POST(req: NextRequest) {
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  // Look up the profile to know if it's a professor
  const { data: target } = await adminSupabase
    .from("profiles")
    .select("id, role, email")
    .eq("id", id)
    .single();

  // If deleting a professor, reassign their sessions/exams to the admin first
  // (otherwise the FK constraint blocks the delete)
  if (target?.role === "professor") {
    const { data: admin } = await adminSupabase
      .from("profiles")
      .select("id")
      .eq("email", "prof@nur.com")
      .single();

    if (!admin) {
      return NextResponse.json({ error: "Admin account (prof@nur.com) not found" }, { status: 400 });
    }

    if (admin.id === id) {
      return NextResponse.json({ error: "Cannot delete the admin account" }, { status: 400 });
    }

    const [sessionsRes, examsRes] = await Promise.all([
      adminSupabase.from("sessions").update({ professor_id: admin.id }).eq("professor_id", id),
      adminSupabase.from("exams").update({ professor_id: admin.id }).eq("professor_id", id),
    ]);

    if (sessionsRes.error) return NextResponse.json({ error: `Reassign sessions failed: ${sessionsRes.error.message}` }, { status: 400 });
    if (examsRes.error)    return NextResponse.json({ error: `Reassign exams failed: ${examsRes.error.message}` },    { status: 400 });
  }

  // Delete from auth.users — cascades to profiles via ON DELETE CASCADE
  const { error } = await adminSupabase.auth.admin.deleteUser(id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ ok: true });
}
