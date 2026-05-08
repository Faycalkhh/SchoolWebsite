"use client";

import Image from "next/image";
import AnimateIn from "./AnimateIn";
import { useLanguage } from "@/context/LanguageContext";

const professors = [
  {
    ar: { name: "الشيخ عبد الله الرحمان", specialty: "التجويد والقراءات", bio: "حامل إجازة في القراءات العشر، خبرة تجاوز ٢٠ عاماً." },
    fr: { name: "Sheikh Abdullah Rahman", specialty: "Tajweed & Qira'at", bio: "Titulaire d'une Ijazah, plus de 20 ans d'expérience." },
    img: "/MustaphaChikh.jpeg",
  },
  {
    ar: { name: "الشيخ ميمون محمد", specialty: "الحفظ والمراجعة", bio: "حافظة للقرآن الكريم، تُرشد الطلاب في مسيرة الحفظ بأسلوب متميز." },
    fr: { name: "Sheikh Maimun Muhammad", specialty: "Hifz & Mémorisation", bio: "Hafiza du Coran, guide les étudiants dans leur parcours de mémorisation." },
    img: "/Prof3.jpeg",
  },
  {
    ar: { name: "الشيخ عبو عبد الله", specialty: "اللغة العربية", bio: "متخصص في اللغة العربية الكلاسيكية واللغة القرآنية." },
    fr: { name: "Sheikh Abou abdellah", specialty: "Langue Arabe", bio: "Spécialiste en arabe classique et en langue coranique." },
    img: "/Prof2.jpeg",
  },
];

export default function Professors() {
  const { T, lang, dir } = useLanguage();

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

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {professors.map((prof, i) => {
            const data = prof[lang];
            return (
              <AnimateIn key={data.name} delay={i * 0.1}>
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 group">
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={prof.img}
                      alt={data.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/60 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#c9a84c] text-white text-xs font-semibold">
                        {data.specialty}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-[#1a1a1a]">{data.name}</h3>
                  </div>
                </div>
              </AnimateIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
