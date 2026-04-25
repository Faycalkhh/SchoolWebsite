"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, BookOpen } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Navbar() {
  const { T, lang, setLang, dir } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: T.nav.home, href: "#home" },
    { label: T.nav.about, href: "#about" },
    { label: T.nav.professors, href: "#professors" },
    { label: T.nav.facilities, href: "#facilities" },
    { label: T.nav.students, href: "#students" },
    { label: T.nav.contact, href: "#contact" },
  ];

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-[#e8dfc8]" : "bg-transparent"
      }`}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      dir={dir}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between py-4">
        <a href="#home" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-[#2d6a4f] flex items-center justify-center shrink-0">
            <BookOpen size={18} className="text-[#c9a84c]" />
          </div>
          <div className="leading-tight">
            <span className={`font-bold text-lg block leading-none ${scrolled ? "text-[#2d6a4f]" : "text-white"}`}>
              {lang === "ar" ? "نور القرآن" : "Nur Al-Quran"}
            </span>
            <span className="text-[10px] tracking-widest uppercase text-[#c9a84c]">
              {lang === "ar" ? "مدرسة" : "École"}
            </span>
          </div>
        </a>

        <nav className="hidden md:flex items-center gap-7">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-[#c9a84c] ${
                scrolled ? "text-[#1a1a1a]" : "text-white/90"
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => setLang(lang === "ar" ? "fr" : "ar")}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors duration-200 ${
              scrolled
                ? "border-[#2d6a4f] text-[#2d6a4f] hover:bg-[#2d6a4f] hover:text-white"
                : "border-white/50 text-white hover:bg-white/15"
            }`}
          >
            {lang === "ar" ? "FR" : "ع"}
          </button>
          <a
            href="/login"
            className="px-5 py-2.5 rounded-full bg-[#c9a84c] text-white text-sm font-semibold hover:bg-[#b8943e] transition-colors shadow-sm"
          >
            {lang === "ar" ? "دخول" : "Connexion"}
          </a>
        </div>

        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => setLang(lang === "ar" ? "fr" : "ar")}
            className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
              scrolled ? "border-[#2d6a4f] text-[#2d6a4f]" : "border-white/50 text-white"
            }`}
          >
            {lang === "ar" ? "FR" : "ع"}
          </button>
          <button onClick={() => setOpen(!open)} className={scrolled ? "text-[#1a1a1a]" : "text-white"}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-[#e8dfc8] overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-[#1a1a1a] text-sm font-medium py-1 hover:text-[#2d6a4f]"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="/login"
                onClick={() => setOpen(false)}
                className="mt-1 text-center px-5 py-2.5 rounded-full bg-[#c9a84c] text-white text-sm font-semibold"
              >
                {lang === "ar" ? "دخول" : "Connexion"}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
