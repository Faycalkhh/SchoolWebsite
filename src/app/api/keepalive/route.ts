import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

// Pings Supabase so the project stays active (avoids the 7-day pause on free tier).
// Triggered by Vercel cron every 5 days — see vercel.json.
export async function GET() {
  const { error } = await supabase.from("announcements").select("id").limit(1);
  if (error) {
    console.error("[keepalive]", error.message);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true, at: new Date().toISOString() });
}
