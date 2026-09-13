import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const FROM   = process.env.EMAIL_FROM ?? "École Coranique El-Yajouri <onboarding@resend.dev>";
const APP    = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

const resend = apiKey ? new Resend(apiKey) : null;

/**
 * Escapes user-supplied text before it is interpolated into an HTML email.
 * Everything here reaches a real inbox, and the contact form is public, so no
 * value from outside this module may be trusted as markup.
 */
function esc(value: string): string {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Throws on any failure, so callers can report it instead of assuming success. */
async function send(to: string, subject: string, html: string): Promise<void> {
  if (!resend) throw new Error("RESEND_API_KEY is not set");

  // The Resend SDK reports API failures in `error` rather than throwing, so an
  // unverified sending domain, a revoked key or a rate limit all look exactly
  // like success unless this is checked explicitly.
  const { error } = await resend.emails.send({ from: FROM, to, subject, html });
  if (error) throw new Error(`${error.name}: ${error.message}`);
}

// ── Welcome email when admin creates an account ──────────────
export async function sendWelcomeEmail(opts: {
  to: string;
  name: string;
  password: string;
  role: "professor" | "parent";
}) {
  const loginUrl = `${APP}/login/${opts.role}`;
  const subject  = "Vos identifiants — École Coranique El-Yajouri";

  const html = `
<div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:24px;background:#faf8f4;color:#1a1a1a;">

  <div style="text-align:center;padding:20px 0;border-bottom:2px solid #c9a84c;">
    <h1 style="color:#2d6a4f;margin:0;font-size:22px;">École Coranique El-Yajouri</h1>
  </div>

  <div style="padding:24px 0;">
    <p style="font-size:16px;color:#1a1a1a;margin:0 0 8px;">Bonjour ${esc(opts.name)},</p>
    <p style="line-height:1.5;color:#555;margin:0 0 20px;">
      Votre compte a été créé. Voici vos identifiants :
    </p>

    <table style="width:100%;background:white;border:1px solid #e8dfc8;border-radius:10px;border-collapse:separate;border-spacing:0;">
      <tr>
        <td style="padding:14px 18px;border-bottom:1px solid #f0ead8;">
          <div style="color:#999;font-size:11px;letter-spacing:1px;">EMAIL</div>
          <div style="font-family:Consolas,monospace;color:#2d6a4f;font-size:15px;font-weight:600;margin-top:4px;">${esc(opts.to)}</div>
        </td>
      </tr>
      <tr>
        <td style="padding:14px 18px;">
          <div style="color:#999;font-size:11px;letter-spacing:1px;">MOT DE PASSE</div>
          <div style="font-family:Consolas,monospace;color:#2d6a4f;font-size:18px;font-weight:700;margin-top:4px;letter-spacing:2px;">${esc(opts.password)}</div>
        </td>
      </tr>
    </table>

    <div style="text-align:center;margin:24px 0;">
      <a href="${loginUrl}" style="display:inline-block;background:#2d6a4f;color:white;padding:12px 32px;border-radius:20px;text-decoration:none;font-weight:600;font-size:14px;">Se connecter</a>
    </div>

    <p style="color:#888;font-size:12px;line-height:1.5;margin:20px 0 0;text-align:center;">
      Conservez ce mot de passe en sécurité. En cas d'oubli, contactez l'administration de l'école.
    </p>
  </div>

  <div style="padding:14px 0;border-top:1px solid #e8dfc8;text-align:center;color:#bbb;font-size:11px;">
    École Coranique El-Yajouri · مدرسة القرآن لمسجد عبد القادر الياجوري
  </div>

</div>`;

  await send(opts.to, subject, html);
}

// ── Contact form on the landing page ─────────────────────────
export async function sendContactEmail(opts: {
  to: string;
  fromName: string;
  fromEmail: string;
  fromPhone?: string;
  message: string;
}) {
  const subject = `Nouveau message de ${opts.fromName} — École Coranique El-Yajouri`;
  const html = `
<div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;padding:24px;background:#faf8f4;color:#1a1a1a;">
  <div style="text-align:center;padding:20px 0;border-bottom:2px solid #c9a84c;">
    <h1 style="color:#2d6a4f;margin:0;font-size:22px;">Nouveau message</h1>
    <p style="color:#c9a84c;margin:6px 0 0;font-size:11px;letter-spacing:2px;">FORMULAIRE DE CONTACT</p>
  </div>

  <div style="padding:24px 0;">
    <table style="width:100%;background:white;border:1px solid #e8dfc8;border-radius:10px;border-collapse:separate;border-spacing:0;">
      <tr><td style="padding:12px 16px;border-bottom:1px solid #f0ead8;width:90px;color:#999;font-size:12px;">Nom</td><td style="padding:12px 16px;border-bottom:1px solid #f0ead8;color:#1a1a1a;font-weight:600;">${esc(opts.fromName)}</td></tr>
      <tr><td style="padding:12px 16px;border-bottom:1px solid #f0ead8;color:#999;font-size:12px;">Email</td><td style="padding:12px 16px;border-bottom:1px solid #f0ead8;color:#2d6a4f;"><a href="mailto:${esc(encodeURI(opts.fromEmail))}" style="color:#2d6a4f;text-decoration:none;">${esc(opts.fromEmail)}</a></td></tr>
      ${opts.fromPhone ? `<tr><td style="padding:12px 16px;border-bottom:1px solid #f0ead8;color:#999;font-size:12px;">Téléphone</td><td style="padding:12px 16px;border-bottom:1px solid #f0ead8;color:#1a1a1a;">${esc(opts.fromPhone)}</td></tr>` : ""}
      <tr><td style="padding:12px 16px;color:#999;font-size:12px;vertical-align:top;">Message</td><td style="padding:12px 16px;color:#1a1a1a;line-height:1.5;white-space:pre-wrap;">${esc(opts.message)}</td></tr>
    </table>
  </div>

  <div style="padding:14px 0;border-top:1px solid #e8dfc8;text-align:center;color:#bbb;font-size:11px;">
    Reçu via le formulaire de contact · École Coranique El-Yajouri
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
  /** True when a professor corrected an already-notified session. */
  updated?: boolean;
}) {
  const subject = opts.updated
    ? `Séance mise à jour pour ${opts.childName}`
    : `Nouvelle séance pour ${opts.childName}`;
  const loginUrl = `${APP}/login/parent`;

  // The parent has already been emailed about this session, so say plainly that
  // the details changed rather than looking like a duplicate notification.
  const intro = opts.updated
    ? `Les détails de la séance du <strong>${esc(opts.date)}</strong> pour
       <strong style="color:#2d6a4f;">${esc(opts.childName)}</strong> ont été mis à jour
       par <strong>${esc(opts.professorName)}</strong>. Voici les informations corrigées :`
    : `Une nouvelle séance vient d'être enregistrée pour
       <strong style="color:#2d6a4f;">${esc(opts.childName)}</strong>
       par <strong>${esc(opts.professorName)}</strong>.`;

  const html = `
<div style="font-family:Cairo,Arial,sans-serif;max-width:560px;margin:auto;padding:32px;background:#faf8f4;color:#1a1a1a;">
  <div style="text-align:center;padding:24px 0;border-bottom:2px solid #c9a84c;">
    <h1 style="color:#2d6a4f;margin:0;font-size:22px;">École Coranique El-Yajouri</h1>
  </div>

  <div style="padding:24px 0;">
    <p style="color:#555;line-height:1.6;">Assalamu alaykum ${esc(opts.parentName)},</p>
    <p style="color:#555;line-height:1.6;">${intro}</p>

    <div style="background:white;border:1px solid #e8dfc8;border-radius:12px;padding:20px;margin:20px 0;">
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <tr><td style="padding:6px 0;color:#777;width:120px;">Date</td><td style="color:#1a1a1a;">${esc(opts.date)}</td></tr>
        <tr><td style="padding:6px 0;color:#777;">Présence</td><td style="color:${opts.present ? "#2d6a4f" : "#c0392b"};font-weight:600;">${opts.present ? "Présent" : "Absent"}</td></tr>
        <tr><td style="padding:6px 0;color:#777;">Discipline</td><td style="color:#1a1a1a;text-transform:capitalize;">${esc(opts.discipline)}</td></tr>
        ${opts.memorization ? `<tr><td style="padding:6px 0;color:#777;">Mémorisation</td><td style="color:#1a1a1a;">${esc(opts.memorization)}</td></tr>` : ""}
        ${opts.comment ? `<tr><td style="padding:6px 0;color:#777;vertical-align:top;">Commentaire</td><td style="color:#1a1a1a;">${esc(opts.comment)}</td></tr>` : ""}
      </table>
    </div>

    <div style="text-align:center;margin:24px 0;">
      <a href="${loginUrl}" style="display:inline-block;background:#2d6a4f;color:white;padding:12px 28px;border-radius:24px;text-decoration:none;font-weight:600;font-size:14px;">Voir le tableau de bord</a>
    </div>
  </div>

  <div style="padding:16px 0;border-top:1px solid #e8dfc8;text-align:center;color:#999;font-size:12px;">
    École Coranique El-Yajouri — مدرسة القرآن لمسجد عبد القادر الياجوري
  </div>
</div>`;

  await send(opts.to, subject, html);
}
