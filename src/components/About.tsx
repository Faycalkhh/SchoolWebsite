"use client";

import Image from "next/image";
import AnimateIn from "./AnimateIn";
import { CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function About() {
  const { T, dir } = useLanguage();

  return (
    <section id="about" className="py-24 lg:py-32 bg-white" dir={dir}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-[2fr_3fr] gap-12 items-center">
          {/* Image */}
          <AnimateIn direction="left">
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[3/4]">
                <Image
                  src="https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&q=80"
                  alt="Students learning Quran"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a3a2c]/40 to-transparent" />
              </div>

              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-5 max-w-[190px]">
                <div className="text-[#c9a84c] text-3xl font-bold">{T.about.floatNum}</div>
                <div className="text-[#1a1a1a] text-sm font-semibold mt-0.5">{T.about.floatLabel}</div>
                <div className="text-[#888] text-xs mt-1 leading-snug">{T.about.floatDesc}</div>
              </div>
              <div className="absolute -top-4 -left-4 w-full h-full rounded-3xl border-2 border-[#c9a84c]/20 -z-10" />
            </div>
          </AnimateIn>

          {/* Text */}
          <AnimateIn direction="right" delay={0.1}>
            <div>
              <p className="text-[#c9a84c] text-sm font-semibold uppercase tracking-widest mb-3">
                {T.about.label}
              </p>
              <div className="section-divider-left" />
              <h2 className="text-4xl md:text-5xl font-bold text-[#1a1a1a] leading-tight mb-6">
                {T.about.title}{" "}
                <span className="text-[#2d6a4f]">{T.about.highlight}</span>
              </h2>
              <p className="text-[#666] leading-relaxed mb-8">
                {T.about.desc}
              </p>

              <div className="space-y-3 mb-8">
                {T.about.values.map((v) => (
                  <div key={v} className="flex items-start gap-3">
                    <CheckCircle2 className="text-[#2d6a4f] mt-0.5 shrink-0" size={18} />
                    <span className="text-[#555] text-sm">{v}</span>
                  </div>
                ))}
              </div>

              <a
                href="#professors"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#2d6a4f] text-white font-semibold text-sm hover:bg-[#235a40] transition-colors shadow-md"
              >
                {T.about.cta}
              </a>
            </div>
          </AnimateIn>
        </div>
      </div>
    </section>
  );
}
