import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export async function GET() {
  const { data } = await adminSupabase
    .from("top_entries")
    .select("rank, students(name, level, photo)")
    .order("rank");

  if (!data) return NextResponse.json([]);

  return NextResponse.json(
    data.map((e) => {
      const s = e.students as { name: string; level: string; photo: string | null } | null;
      return { rank: e.rank, name: s?.name ?? "—", level: s?.level ?? "", photo: s?.photo ?? null };
    })
  );
}
