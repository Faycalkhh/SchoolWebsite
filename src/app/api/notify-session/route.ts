import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { sendSessionEmail } from "@/lib/email";

const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export async function POST(req: NextRequest) {
  const { studentId, professorId, date, present, discipline, memorization, comment, updated } = await req.json();

  const { data: student } = await adminSupabase
    .from("students")
    .select("name, parent_id")
    .eq("id", studentId)
    .single();

  if (!student) return NextResponse.json({ ok: false, reason: "student not found" });

  const [{ data: parent }, { data: professor }] = await Promise.all([
    adminSupabase.from("profiles").select("name, email").eq("id", student.parent_id).single(),
    adminSupabase.from("profiles").select("name").eq("id", professorId).single(),
  ]);

  if (!parent?.email) return NextResponse.json({ ok: false, reason: "parent email missing" });

  try {
    await sendSessionEmail({
      to:            parent.email,
      parentName:    parent.name ?? "",
      childName:     student.name,
      professorName: professor?.name ?? "—",
      date,
      present,
      discipline,
      memorization:  memorization ?? "",
      comment:       comment ?? "",
      updated:       Boolean(updated),
    });
  } catch (e) {
    console.error("[notify-session] send failed:", e);
    return NextResponse.json({ ok: false, reason: "email send failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
