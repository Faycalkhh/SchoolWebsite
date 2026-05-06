"use client";

import Image from "next/image";
import AnimateIn from "./AnimateIn";
import { useLanguage } from "@/context/LanguageContext";

const students = [
  {
    rank: 1,
    ar: { name: "عائشة الراشدي", achievement: "أتمّت حفظ القرآن الكريم كاملاً" },
    fr: { name: "Aisha Al-Rashidi", achievement: "A mémorisé la totalité du Coran" },
    img: "https://i.pravatar.cc/300?img=44",
  },
  {
    rank: 2,
    ar: { name: "إبراهيم الفاروق", achievement: "الأول في مسابقة التجويد الأسبوعية" },
    fr: { name: "Ibrahim Al-Farouq", achievement: "1er au concours de Tajweed de la semaine" },
    img: "https://i.pravatar.cc/300?img=12",
  },
  {
    rank: 3,
    ar: { name: "زينب مصطفى", achievement: "أتمّت حفظ عشرة أجزاء" },
    fr: { name: "Zainab Mustafa", achievement: "A mémorisé dix Juz avec excellence" },
    img: "https://i.pravatar.cc/300?img=45",
  },
];

const podiumColors: Record<number, { block: string; border: string; badge: string }> = {
  1: { block: "bg-[#c9a84c]", border: "border-[#c9a84c]", badge: "bg-[#c9a84c]" },
  2: { block: "bg-[#2d6a4f]", border: "border-[#52b788]", badge: "bg-[#2d6a4f]" },
  3: { block: "bg-[#1a3a2c]", border: "border-[#2d6a4f]", badge: "bg-[#1a3a2c]" },
};

const podiumHeights: Record<number, string> = {
  1: "h-32 md:h-40",
  2: "h-20 md:h-28",
  3: "h-14 md:h-20",
};

const podiumOrder = [students[1], students[0], students[2]];

export default function TopStudents() {
  const { T, lang, dir } = useLanguage();

  return (
    <section id="students" className="py-24 lg:py-32 relative overflow-hidden" dir={dir}>
      <div className="absolute inset-0 bg-[#0f2318]" />
      <div className="absolute inset-0 opacity-40 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22%23c9a84c%22%20fill-opacity%3D%220.06%22%3E%3Cpath%20d%3D%22M30%200L60%2030L30%2060L0%2030Z%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E')]" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8">
        <AnimateIn>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#c9a84c]/40 mb-4">
              <span className="text-[#c9a84c] text-xs font-semibold tracking-widest">
                {T.students.badge}
              </span>
            </div>
            <div className="section-divider" />
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              {T.students.title}{" "}
              <span className="text-[#c9a84c]">{T.students.highlight}</span>
            </h2>
            <p className="text-white/50 mt-3 text-sm">{T.students.subtitle}</p>
          </div>
        </AnimateIn>

        <AnimateIn delay={0.15}>
          <div className="flex items-end justify-center gap-2 sm:gap-4 md:gap-8">
            {podiumOrder.map((student) => {
              const data = student[lang];
              const colors = podiumColors[student.rank];
              const blockH = podiumHeights[student.rank];
              const isFirst = student.rank === 1;

              return (
                <div key={student.rank} className="flex flex-col items-center w-[30%] max-w-[120px] sm:max-w-[140px] md:max-w-[192px]">
                  <div className="text-center mb-2 sm:mb-3 px-1 w-full">
                    <div
                      className={`relative mx-auto mb-2 rounded-full overflow-hidden border-4 ${colors.border} ${
                        isFirst ? "w-16 h-16 sm:w-24 sm:h-24 md:w-36 md:h-36" : "w-14 h-14 sm:w-20 sm:h-20 md:w-28 md:h-28"
                      }`}
                    >
                      <Image src={student.img} alt={data.name} fill className="object-cover" />
                    </div>
                    <p className={`text-white font-bold leading-tight mb-1 truncate ${isFirst ? "text-[11px] sm:text-sm md:text-base" : "text-[10px] sm:text-xs md:text-sm"}`}>
                      {data.name}
                    </p>
                    <p className="text-white/50 text-[9px] sm:text-[10px] md:text-xs leading-snug line-clamp-2">
                      {data.achievement}
                    </p>
                  </div>

                  <div
                    className={`w-full ${blockH} ${colors.block} rounded-t-xl flex flex-col items-center justify-center gap-1`}
                  >
                    <span className="text-white font-black text-xl sm:text-2xl md:text-3xl">{student.rank}</span>
                    {student.rank === 1 && (
                      <span className="text-white/70 text-[10px] tracking-widest">🥇</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="h-3 bg-[#c9a84c]/20 rounded-b-xl max-w-md mx-auto" />
        </AnimateIn>

        <AnimateIn delay={0.3}>
          <div className="mt-14 text-center">
            <p className="text-[#c9a84c]/80 text-lg italic">
              {T.students.quote}
            </p>
            <p className="text-white/35 text-sm mt-2">{T.students.quoteAuthor}</p>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
