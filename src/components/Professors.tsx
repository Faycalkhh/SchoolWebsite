"use client";

import { useEffect, useState } from "react";
import AnimateIn from "./AnimateIn";
import { useLanguage } from "@/context/LanguageContext";

type Prof = { name: string; specialty: string | null; bio: string | null; photo: string | null };

function Avatar({ name, photo }: { name: string; photo: string | null }) {
  if (photo) {
    const src = photo.startsWith("data:") ? photo : `data:image/jpeg;base64,${photo}`;
    return <img src={src} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />;
  }
  const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div className="w-full h-full bg-[#2d6a4f] flex items-center justify-center">
      <span className="text-white font-bold text-3xl">{initials}</span>
    </div>
  );
}

export default function Professors() {
  const { T, dir } = useLanguage();
  const [professors, setProfessors] = useState<Prof[]>([]);

  useEffect(() => {
    fetch("/api/professors-public").then((r) => r.json()).then(setProfessors);
  }, []);

  return (
    <section id="professors" className="py-24 lg:py-32 pattern-bg" dir={dir}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <AnimateIn>
          <div className="text-center mb-16">
            <p className="text-[#c9a84c] text-sm font-semibold uppercase tracking-widest mb-3">
              {T.professors.label}
            </p>
            <div className="section-divider" />
            <h2 className="text-4xl md:text-5xl font-bold text-[#1a1a1a]">
              {T.professors.title}{" "}
              <span className="text-[#2d6a4f]">{T.professors.highlight}</span>
            </h2>
            <p className="text-[#777] mt-4 max-w-md mx-auto text-sm leading-relaxed">
              {T.professors.subtitle}
            </p>
          </div>
        </AnimateIn>

        {professors.length === 0 ? (
          <p className="text-center text-[#999] text-sm py-12">—</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {professors.map((prof, i) => (
              <AnimateIn key={prof.name} delay={i * 0.1}>
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 group">
                  <div className="relative h-56 overflow-hidden">
                    <Avatar name={prof.name} photo={prof.photo} />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/60 to-transparent pointer-events-none" />
                    {prof.specialty && (
                      <div className="absolute bottom-3 left-3 right-3">
                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#c9a84c] text-white text-xs font-semibold">
                          {prof.specialty}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-[#1a1a1a] mb-1.5">{prof.name}</h3>
                    {prof.bio && <p className="text-[#777] text-sm leading-relaxed">{prof.bio}</p>}
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
