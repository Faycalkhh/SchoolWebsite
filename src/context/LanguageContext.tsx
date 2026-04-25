"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import ar from "@/translations/ar";
import fr from "@/translations/fr";

export type Lang = "ar" | "fr";

const translations = { ar, fr };

interface LanguageCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  T: typeof ar;
  dir: "rtl" | "ltr";
}

const LanguageContext = createContext<LanguageCtx>({
  lang: "ar",
  setLang: () => {},
  T: ar,
  dir: "rtl",
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("ar");

  useEffect(() => {
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <LanguageContext.Provider
      value={{
        lang,
        setLang,
        T: translations[lang],
        dir: lang === "ar" ? "rtl" : "ltr",
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
