"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, Eye, EyeOff, Users } from "lucide-react";
import { signIn } from "@/lib/store";
import { useLanguage } from "@/context/LanguageContext";
import LangToggle from "@/components/LangToggle";

const t = {
  ar: {
    title: "فضاء ولي الأمر",
    subtitle: "تابع تقدم طفلك وملاحظات الأساتذة",
    emailLabel: "البريد الإلكتروني",
    emailPh: "parent@email.com",
    passLabel: "كلمة المرور",
    passPh: "••••••••",
    submit: "تسجيل الدخول",
    loading: "جارٍ الدخول...",
    error: "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
    demoTitle: "حساب تجريبي",
    demoEmail: "البريد:",
    demoPass: "كلمة المرور:",
    back: "→ تغيير الملف الشخصي",
  },
  fr: {
    title: "Espace Parent",
    subtitle: "Suivez les progrès et les commentaires pour votre enfant",
    emailLabel: "Adresse e-mail",
    emailPh: "parent@email.com",
    passLabel: "Mot de passe",
    passPh: "••••••••",
    submit: "Se connecter",
    loading: "Connexion en cours...",
    error: "Email ou mot de passe incorrect.",
    demoTitle: "Compte de démonstration",
    demoEmail: "Email :",
    demoPass: "Mot de passe :",
    back: "← Changer de profil",
  },
};

export default function ParentLogin() {
  const router = useRouter();
  const { lang, dir } = useLanguage();
  const T = t[lang];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const user = await signIn(email, password);
    if (!user || user.role !== "parent") {
      setError(T.error);
      setLoading(false);
      return;
    }
    router.push("/dashboard/parent");
  }

  const inputCls =
    "w-full px-4 py-3 rounded-xl border border-[#e8dfc8] bg-[#faf8f4] text-sm placeholder-[#bbb] focus:outline-none focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/10 transition-all";
  const labelCls =
    "block text-xs font-semibold text-[#555] uppercase tracking-wider mb-1.5";

  return (
    <div className="min-h-screen bg-[#f5f0e8] flex items-center justify-center px-4 py-12" dir={dir}>
      <LangToggle />
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-lg border border-[#e8dfc8] p-8">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-6 justify-center">
              <div className="w-10 h-10 rounded-full bg-[#2d6a4f] flex items-center justify-center">
                <BookOpen size={18} className="text-[#c9a84c]" />
              </div>
              <span className="font-bold text-[#2d6a4f] text-lg">
                {lang === "ar" ? "نور القرآن" : "Nur Al-Quran"}
              </span>
            </Link>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Users size={20} className="text-[#c9a84c]" />
              <h1 className="text-2xl font-bold text-[#1a1a1a]">{T.title}</h1>
            </div>
            <p className="text-[#999] text-sm">{T.subtitle}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={labelCls}>{T.emailLabel}</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={T.emailPh}
                className={inputCls}
                dir="ltr"
              />
            </div>

            <div>
              <label className={labelCls}>{T.passLabel}</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={T.passPh}
                  className={`${inputCls} pr-10`}
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#bbb] hover:text-[#555] transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-[#c9a84c] text-white font-semibold text-sm hover:bg-[#b8943e] transition-colors disabled:opacity-60 shadow-md mt-2"
            >
              {loading ? T.loading : T.submit}
            </button>
          </form>

          <div className="mt-6 p-4 rounded-xl bg-[#f5f0e8] border border-[#e8dfc8]">
            <p className="text-xs text-[#aaa] font-semibold mb-1.5">{T.demoTitle}</p>
            <p className="text-xs text-[#666]" dir="ltr">
              {T.demoEmail}{" "}
              <span className="font-mono font-medium text-[#c9a84c]">parent@nur.com</span>
            </p>
            <p className="text-xs text-[#666]" dir="ltr">
              {T.demoPass}{" "}
              <span className="font-mono font-medium text-[#c9a84c]">parent123</span>
            </p>
          </div>
        </div>

        <Link
          href="/login"
          className="block text-center mt-5 text-xs text-[#bbb] hover:text-[#555] transition-colors"
        >
          {T.back}
        </Link>
      </div>
    </div>
  );
}
