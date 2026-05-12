import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function GET(req: NextRequest) {
  const to = new URL(req.url).searchParams.get("to");
  if (!to) return NextResponse.json({ error: "pass ?to=email@example.com" }, { status: 400 });

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: "RESEND_API_KEY not set" }, { status: 500 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const result = await resend.emails.send({
    from:    process.env.EMAIL_FROM ?? "Nur Al-Quran <onboarding@resend.dev>",
    to,
    subject: "Test from Nur Al-Quran",
    html:    "<p>If you see this, Resend is working.</p>",
  });

  return NextResponse.json(result);
}
