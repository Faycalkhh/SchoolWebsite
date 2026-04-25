"use client";

import Image from "next/image";
import AnimateIn from "./AnimateIn";
import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    name: "Sister Khadija Mohammed",
    role: "Parent of a student",
    text: "Nur Al-Quran School has been a true blessing for our family. My daughter's recitation has improved tremendously, and more importantly, she has developed a genuine love for the Quran.",
    img: "https://i.pravatar.cc/150?img=41",
    stars: 5,
  },
  {
    name: "Brother Ahmed Al-Sayed",
    role: "Adult student",
    text: "I started as a complete beginner at age 35. The patience and dedication of the professors here made me feel welcome and capable. I am now memorizing my third Juz.",
    img: "https://i.pravatar.cc/150?img=17",
    stars: 5,
  },
  {
    name: "Sister Nour Farouk",
    role: "Parent of two students",
    text: "Both of my children attend Nur Al-Quran. The structured curriculum and warm atmosphere sets this school apart. We could not be happier with their progress.",
    img: "https://i.pravatar.cc/150?img=42",
    stars: 5,
  },
  {
    name: "Brother Tariq Hassan",
    role: "Student, Hifz program",
    text: "The Hifz program here is methodical and deeply supportive. Sheikh Abdullah's guidance has been invaluable. I am well on track to complete memorization by the end of the year.",
    img: "https://i.pravatar.cc/150?img=18",
    stars: 5,
  },
  {
    name: "Sister Amina Bello",
    role: "Parent of a student",
    text: "What I appreciate most is how the teachers connect Quranic learning to everyday life. My son came home last week explaining the meaning of the ayat he had learned. Masha'Allah.",
    img: "https://i.pravatar.cc/150?img=43",
    stars: 5,
  },
  {
    name: "Brother Yusuf Ibrahim",
    role: "Student, Tajweed class",
    text: "The digital learning resources combined with traditional teaching make Nur Al-Quran stand out. Ustaza Zainab is an incredible teacher with boundless patience.",
    img: "https://i.pravatar.cc/150?img=19",
    stars: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 lg:py-32 pattern-bg">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <AnimateIn>
          <div className="text-center mb-16">
            <p className="text-[#c9a84c] text-sm font-semibold uppercase tracking-widest mb-3">
              What People Say
            </p>
            <div className="section-divider" />
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-bold text-[#1a1a1a]">
              Voices from Our{" "}
              <span className="text-[#2d6a4f]">Community</span>
            </h2>
          </div>
        </AnimateIn>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <AnimateIn key={t.name} delay={i * 0.07}>
              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow duration-300 border border-[#f0ead8] relative">
                <div className="absolute top-5 right-5 text-[#c9a84c]/20">
                  <Quote size={40} fill="#c9a84c" />
                </div>

                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} size={14} className="text-[#c9a84c]" fill="#c9a84c" />
                  ))}
                </div>

                <p className="text-[#555] text-sm leading-relaxed mb-6 relative z-10">
                  &ldquo;{t.text}&rdquo;
                </p>

                <div className="flex items-center gap-3 pt-4 border-t border-[#f0ead8]">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0">
                    <Image src={t.img} alt={t.name} fill className="object-cover" />
                  </div>
                  <div>
                    <div className="font-semibold text-[#1a1a1a] text-sm">{t.name}</div>
                    <div className="text-[#888] text-xs">{t.role}</div>
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
