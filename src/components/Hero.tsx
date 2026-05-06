"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Hero() {
  const { T, dir } = useLanguage();

  const stats = [
    { value: "500+", label: T.hero.stat1 },
    { value: "15+", label: T.hero.stat2 },
    { value: "12", label: T.hero.stat3 },
  ];

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-start overflow-hidden" dir={dir}>
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/Landingimg.png')",
        }}
      />
      <div className="absolute inset-0 hero-overlay" />
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent opacity-70" />

      <div className="relative z-10 text-right px-5 sm:px-8 lg:px-20 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="flex justify-center mb-6"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#c9a84c]/40">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c]" />
            <span className="text-[#c9a84c] text-xs tracking-widest">{T.hero.badge}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c]" />
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-4"
        >
          {T.hero.title1}{" "}
          <span className="block text-[#c9a84c]">{T.hero.title2}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.65 }}
          className="text-white/75 text-base sm:text-lg max-w-xl mb-8 sm:mb-10"
        >
          {T.hero.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-start"
        >
          <a href="#about" className="px-8 py-4 rounded-full bg-[#c9a84c] text-white font-semibold hover:bg-[#b8943e] transition-colors shadow-lg">
            {T.hero.cta1}
          </a>
          <a href="#about" className="px-8 py-4 rounded-full border-2 border-white/50 text-white font-semibold hover:bg-white/10 transition-colors">
            {T.hero.cta2}
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="mt-10 sm:mt-16 grid grid-cols-3 gap-4 sm:gap-6 max-w-xs sm:max-w-sm"
        >
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-[#c9a84c] text-2xl sm:text-3xl font-bold">{s.value}</div>
              <div className="text-white/55 text-[10px] sm:text-xs uppercase tracking-widest mt-1">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 flex flex-col items-center gap-1"
      >
        <span className="text-xs tracking-widest">{T.hero.scroll}</span>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
          <ChevronDown size={18} />
        </motion.div>
      </motion.div>
    </section>
  );
}
