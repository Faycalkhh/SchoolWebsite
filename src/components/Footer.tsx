"use client";

import { BookOpen } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const navHrefs = ["#home", "#about", "#professors", "#facilities", "#students", "#contact"];

const socials = [
  {
    label: "Facebook",
    href: "#",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "#",
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "#",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.95C5.12 20 12 20 12 20s6.88 0 8.59-.47a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
        <polygon fill="#0f2318" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
      </svg>
    ),
  },
];

export default function Footer() {
  const { T, lang, dir } = useLanguage();

  const navLabels = [
    T.nav.home, T.nav.about, T.nav.professors,
    T.nav.facilities, T.nav.students, T.nav.contact,
  ];

  return (
    <footer className="bg-[#0f2318] text-white" dir={dir}>
      <div className="bg-[#2d6a4f] py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-white">{T.footer.ctaTitle}</h3>
            <p className="text-white/65 mt-1 text-sm">{T.footer.ctaDesc}</p>
          </div>
          <a
            href="#contact"
            className="shrink-0 px-8 py-3.5 rounded-full bg-[#c9a84c] text-white font-semibold text-sm hover:bg-[#b8943e] transition-colors shadow-lg"
          >
            {T.footer.ctaBtn}
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-full bg-[#2d6a4f] flex items-center justify-center">
                <BookOpen size={18} className="text-[#c9a84c]" />
              </div>
              <div>
                <div className="font-bold text-lg text-white leading-none">
                  {lang === "ar" ? "نور القرآن" : "Nur Al-Quran"}
                </div>
                <div className="text-[10px] text-[#c9a84c] tracking-widest uppercase">
                  {lang === "ar" ? "مدرسة" : "École"}
                </div>
              </div>
            </div>
            <p className="text-white/45 text-sm leading-relaxed mb-5">{T.footer.tagline}</p>
            <div className="flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center text-white/45 hover:text-[#c9a84c] hover:border-[#c9a84c]/40 transition-colors"
                >
                  {s.svg}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[#c9a84c] text-xs font-semibold uppercase tracking-widest mb-5">
              {T.footer.quickLinks}
            </h4>
            <ul className="space-y-2.5">
              {navLabels.map((label, i) => (
                <li key={label}>
                  <a
                    href={navHrefs[i]}
                    className="text-white/45 text-sm hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-[#c9a84c]/40 group-hover:bg-[#c9a84c] transition-colors" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[#c9a84c] text-xs font-semibold uppercase tracking-widest mb-5">
              {T.footer.programs}
            </h4>
            <ul className="space-y-2.5">
              {T.footer.programsList.map((program) => (
                <li key={program}>
                  <span className="text-white/45 text-sm flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-[#c9a84c]/40 shrink-0" />
                    {program}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[#c9a84c] text-xs font-semibold uppercase tracking-widest mb-5">
              {T.footer.newsletter}
            </h4>
            <p className="text-white/45 text-sm leading-relaxed mb-4">{T.footer.newsletterDesc}</p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder={T.footer.emailPh}
                className="flex-1 px-3 py-2.5 rounded-lg bg-white/8 border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#c9a84c]/50 transition-colors"
              />
              <button
                type="submit"
                className="px-3 py-2.5 rounded-lg bg-[#c9a84c] text-white text-sm font-bold hover:bg-[#b8943e] transition-colors"
              >
                →
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="border-t border-white/8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-white/25 text-xs">{T.footer.rights}</p>
          <p className="text-white/25 text-xs">{T.footer.bottom}</p>
        </div>
      </div>
    </footer>
  );
}
