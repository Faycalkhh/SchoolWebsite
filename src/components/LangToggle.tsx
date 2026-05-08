"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function LangToggle() {
  const { lang, setLang } = useLanguage();
  return (
    <button
      onClick={() => setLang(lang === "ar" ? "fr" : "ar")}
      className="fixed top-4 right-4 z-50 text-xs font-semibold px-3 py-1.5 rounded-full border border-[#2d6a4f]/40 text-[#2d6a4f] bg-white/80 backdrop-blur hover:bg-[#2d6a4f] hover:text-white transition-colors"
      aria-label="Toggle language"
    >
      {lang === "ar" ? "FR" : "ع"}
    </button>
  );
}
