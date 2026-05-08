"use client";

import Link from "next/link";
import { BookOpen, GraduationCap, Users } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import LangToggle from "@/components/LangToggle";

const t = {
  ar: {
    welcome: "مرحباً بك",
    subtitle: "اختر ملفك الشخصي للمتابعة",
    profTitle: "أستاذ / مشرف",
    profDesc: "إدارة الطلاب والحصص وفريق التدريس",
    profCta: "الدخول ←",
    parentTitle: "ولي أمر الطالب",
    parentDesc: "تابع تقدم طفلك وملاحظات الأساتذة",
    parentCta: "الدخول ←",
    back: "العودة إلى الصفحة الرئيسية →",
  },
  fr: {
    welcome: "Bienvenue",
    subtitle: "Choisissez votre profil pour continuer",
    profTitle: "Professeur / Administrateur",
    profDesc: "Gérez les élèves, les séances et l'équipe pédagogique",
    profCta: "Accéder →",
    parentTitle: "Parent d'élève",
    parentDesc: "Suivez les progrès et les commentaires pour votre enfant",
    parentCta: "Accéder →",
    back: "← Retour à l'accueil",
  },
};

export default function LoginSelect() {
  const { lang, dir } = useLanguage();
  const T = t[lang];

  return (
    <div className="min-h-screen bg-[#f5f0e8] flex flex-col items-center justify-center px-4 py-12" dir={dir}>
      <LangToggle />
      <Link href="/" className="flex items-center gap-3 mb-10">
        <div className="w-12 h-12 rounded-full bg-[#2d6a4f] flex items-center justify-center">
          <BookOpen size={22} className="text-[#c9a84c]" />
        </div>
        <div>
          <div className="font-bold text-xl text-[#2d6a4f] leading-none">
            {lang === "ar" ? "نور القرآن" : "Nur Al-Quran"}
          </div>
          <div className="text-[10px] text-[#c9a84c] tracking-widest uppercase mt-0.5">
            {lang === "ar" ? "مدرسة" : "École"}
          </div>
        </div>
      </Link>

      <h1 className="text-2xl font-bold text-[#1a1a1a] mb-2 text-center">{T.welcome}</h1>
      <p className="text-[#888] text-sm mb-10 text-center">{T.subtitle}</p>

      <div className="grid sm:grid-cols-2 gap-5 w-full max-w-lg">
        <Link
          href="/login/professor"
          className="group bg-white rounded-2xl p-8 border border-[#e8dfc8] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center gap-4 text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-[#2d6a4f]/10 flex items-center justify-center group-hover:bg-[#2d6a4f] transition-colors duration-300">
            <GraduationCap size={28} className="text-[#2d6a4f] group-hover:text-white transition-colors duration-300" />
          </div>
          <div>
            <div className="font-bold text-[#1a1a1a] text-lg leading-tight mb-2">{T.profTitle}</div>
            <p className="text-[#999] text-xs leading-relaxed">{T.profDesc}</p>
          </div>
          <span className="mt-auto text-xs font-semibold text-[#2d6a4f] group-hover:underline">{T.profCta}</span>
        </Link>

        <Link
          href="/login/parent"
          className="group bg-white rounded-2xl p-8 border border-[#e8dfc8] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center gap-4 text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-[#c9a84c]/10 flex items-center justify-center group-hover:bg-[#c9a84c] transition-colors duration-300">
            <Users size={28} className="text-[#c9a84c] group-hover:text-white transition-colors duration-300" />
          </div>
          <div>
            <div className="font-bold text-[#1a1a1a] text-lg leading-tight mb-2">{T.parentTitle}</div>
            <p className="text-[#999] text-xs leading-relaxed">{T.parentDesc}</p>
          </div>
          <span className="mt-auto text-xs font-semibold text-[#c9a84c] group-hover:underline">{T.parentCta}</span>
        </Link>
      </div>

      <Link href="/" className="mt-10 text-xs text-[#bbb] hover:text-[#555] transition-colors">
        {T.back}
      </Link>
    </div>
  );
}
