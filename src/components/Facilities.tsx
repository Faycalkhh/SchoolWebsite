"use client";

import Image from "next/image";
import AnimateIn from "./AnimateIn";
import { useLanguage } from "@/context/LanguageContext";

const images = [
  "https://images.unsplash.com/photo-1519817650390-64a93db51149?w=600&q=75",
  "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&q=75",
  "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=75",
  "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600&q=75",
];

export default function Facilities() {
  const { T, dir } = useLanguage();

  return (
    <section id="facilities" className="py-24 lg:py-32 bg-white" dir={dir}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <AnimateIn>
          <div className="text-center mb-16">
            <p className="text-[#c9a84c] text-sm font-semibold uppercase tracking-widest mb-3">
              {T.facilities.label}
            </p>
            <div className="section-divider" />
            <h2 className="text-4xl md:text-5xl font-bold text-[#1a1a1a]">
              {T.facilities.title}{" "}
              <span className="text-[#2d6a4f]">{T.facilities.highlight}</span>
            </h2>
            <p className="text-[#777] mt-4 max-w-md mx-auto text-sm">{T.facilities.subtitle}</p>
          </div>
        </AnimateIn>

        <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {T.facilities.items.slice(0, 4).map((item, i) => (
            <AnimateIn key={item.title} delay={i * 0.07}>
              <div className="group rounded-2xl overflow-hidden border border-[#f0ead8] hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={images[i]}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5 flex items-start gap-3">
                  <div className="w-1 h-8 rounded-full bg-[#c9a84c] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-[#1a1a1a] mb-1 text-sm">{item.title}</h3>
                    <p className="text-[#888] text-xs leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </div>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
