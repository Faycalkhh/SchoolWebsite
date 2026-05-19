import { NextRequest, NextResponse } from "next/server";
import { sendContactEmail } from "@/lib/email";

const SCHOOL_INBOX = process.env.SCHOOL_CONTACT_EMAIL ?? "faycalkh73@gmail.com";

export async function POST(req: NextRequest) {
  const { name, email, phone, message } = await req.json();
  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  await sendContactEmail({
    to:        SCHOOL_INBOX,
    fromName:  String(name),
    fromEmail: String(email),
    fromPhone: phone ? String(phone) : undefined,
    message:   String(message),
  });

  return NextResponse.json({ ok: true });
}
