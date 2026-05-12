import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const FROM   = process.env.EMAIL_FROM ?? "Nur Al-Quran <onboarding@resend.dev>";
const APP    = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

const resend = apiKey ? new Resend(apiKey) : null;

async function send(to: string, subject: string, html: string) {
  if (!resend) { console.warn("[email] RESEND_API_KEY not set, skipping send to", to); return; }
  try {
    await resend.emails.send({ from: FROM, to, subject, html });
  } catch (err) {
    console.error("[email] send failed:", err);
  }
}

// ── Welcome email when admin creates an account ──────────────
export async function sendWelcomeEmail(opts: {
  to: string;
  name: string;
  password: string;
  role: "professor" | "parent";
}) {
  const loginUrl = `${APP}/login/${opts.role}`;
  const subject  = "Bienvenue à Nur Al-Quran — أهلاً بكم في نور القرآن";

  const html = `
<div style="font-family:Cairo,Arial,sans-serif;max-width:560px;margin:auto;padding:32px;background:#faf8f4;color:#1a1a1a;">
  <div style="text-align:center;padding:24px 0;border-bottom:2px solid #c9a84c;">
    <h1 style="color:#2d6a4f;margin:0;font-size:28px;">Nur Al-Quran</h1>
    <p style="color:#c9a84c;margin:6px 0 0;font-size:12px;letter-spacing:2px;">ÉCOLE CORANIQUE</p>
  </div>

  <div style="padding:32px 0;">
    <h2 style="color:#2d6a4f;margin:0 0 16px;">Bienvenue ${opts.name}</h2>
    <p style="line-height:1.6;color:#555;">
      Votre compte ${opts.role === "professor" ? "professeur" : "parent"} a été créé. Voici vos identifiants :
    </p>

    <div style="background:white;border:1px solid #e8dfc8;border-radius:12px;padding:20px;margin:20px 0;">
      <div style="margin-bottom:10px;"><strong style="color:#777;font-size:12px;">EMAIL</strong><br/><span style="font-family:monospace;color:#2d6a4f;">${opts.to}</span></div>
      <div><strong style="color:#777;font-size:12px;">MOT DE PASSE</strong><br/><span style="font-family:monospace;color:#2d6a4f;">${opts.password}</span></div>
    </div>

    <p style="color:#777;font-size:13px;line-height:1.6;">
      Veuillez changer votre mot de passe lors de votre première connexion.
    </p>

    <div style="text-align:center;margin:32px 0;">
      <a href="${loginUrl}" style="display:inline-block;background:#2d6a4f;color:white;padding:14px 32px;border-radius:24px;text-decoration:none;font-weight:600;">Se connecter</a>
    </div>
  </div>

  <div style="padding:16px 0;border-top:1px solid #e8dfc8;text-align:center;color:#999;font-size:12px;">
    Nur Al-Quran — مدرسة نور القرآن
  </div>
</div>`;

  await send(opts.to, subject, html);
}

// ── Notify parent when a new session is logged for their child ──
export async function sendSessionEmail(opts: {
  to: string;
  parentName: string;
  childName: string;
  professorName: string;
  date: string;
  present: boolean;
  discipline: string;
  memorization: string;
  comment: string;
}) {
  const subject = `Nouvelle séance pour ${opts.childName}`;
  const loginUrl = `${APP}/login/parent`;

  const html = `
<div style="font-family:Cairo,Arial,sans-serif;max-width:560px;margin:auto;padding:32px;background:#faf8f4;color:#1a1a1a;">
  <div style="text-align:center;padding:24px 0;border-bottom:2px solid #c9a84c;">
    <h1 style="color:#2d6a4f;margin:0;font-size:24px;">Nur Al-Quran</h1>
  </div>

  <div style="padding:24px 0;">
    <p style="color:#555;line-height:1.6;">Assalamu alaykum ${opts.parentName},</p>
    <p style="color:#555;line-height:1.6;">
      Une nouvelle séance vient d'être enregistrée pour <strong style="color:#2d6a4f;">${opts.childName}</strong>
      par <strong>${opts.professorName}</strong>.
    </p>

    <div style="background:white;border:1px solid #e8dfc8;border-radius:12px;padding:20px;margin:20px 0;">
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <tr><td style="padding:6px 0;color:#777;width:120px;">Date</td><td style="color:#1a1a1a;">${opts.date}</td></tr>
        <tr><td style="padding:6px 0;color:#777;">Présence</td><td style="color:${opts.present ? "#2d6a4f" : "#c0392b"};font-weight:600;">${opts.present ? "Présent" : "Absent"}</td></tr>
        <tr><td style="padding:6px 0;color:#777;">Discipline</td><td style="color:#1a1a1a;text-transform:capitalize;">${opts.discipline}</td></tr>
        ${opts.memorization ? `<tr><td style="padding:6px 0;color:#777;">Mémorisation</td><td style="color:#1a1a1a;">${opts.memorization}</td></tr>` : ""}
        ${opts.comment ? `<tr><td style="padding:6px 0;color:#777;vertical-align:top;">Commentaire</td><td style="color:#1a1a1a;">${opts.comment}</td></tr>` : ""}
      </table>
    </div>

    <div style="text-align:center;margin:24px 0;">
      <a href="${loginUrl}" style="display:inline-block;background:#2d6a4f;color:white;padding:12px 28px;border-radius:24px;text-decoration:none;font-weight:600;font-size:14px;">Voir le tableau de bord</a>
    </div>
  </div>

  <div style="padding:16px 0;border-top:1px solid #e8dfc8;text-align:center;color:#999;font-size:12px;">
    Nur Al-Quran — مدرسة نور القرآن
  </div>
</div>`;

  await send(opts.to, subject, html);
}
