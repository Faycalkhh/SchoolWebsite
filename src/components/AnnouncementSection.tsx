"use client";

import { useState, useEffect } from "react";
import { Megaphone } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { getAnnouncements } from "@/lib/store";
import type { Announcement } from "@/lib/types";

const t = {
  ar: {
    title: "الإعلانات والأخبار",
    subtitle: "آخر الأحداث والإعلانات من مدرسة نور القرآن",
  },
  fr: {
    title: "Annonces & Actualités",
    subtitle: "Derniers événements et annonces de l'école Nur Al-Quran",
  },
};

export default function AnnouncementSection() {
  const { lang, dir } = useLanguage();
  const T = t[lang];
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    getAnnouncements().then((anns) => setAnnouncements(anns.slice(0, 6)));
  }, []);

  if (announcements.length === 0) return null;

  return (
    <section className="py-16 bg-white" dir={dir}>
      <div className="max-w-6xl mx-auto px-4 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-[#2d6a4f]/10 text-[#2d6a4f] px-4 py-1.5 rounded-full text-xs font-semibold mb-4">
            <Megaphone size={13} />
            {T.title}
          </div>
          <p className="text-[#888] text-sm">{T.subtitle}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {announcements.map((ann) => (
            <AnnouncementCard key={ann.id} ann={ann} lang={lang} />
          ))}
        </div>
      </div>
    </section>
  );
}

function AnnouncementCard({ ann, lang }: { ann: Announcement; lang: "ar" | "fr" }) {
  return (
    <div className="bg-[#faf8f4] rounded-2xl border border-[#e8dfc8] overflow-hidden flex flex-col">
      {ann.image && (
        <img src={ann.image} alt="" className="w-full h-44 object-cover" />
      )}
      {!ann.image && (
        <div className="w-full h-20 bg-[#2d6a4f]/5 flex items-center justify-center">
          <Megaphone size={28} className="text-[#2d6a4f]/20" />
        </div>
      )}
      <div className="p-5 flex flex-col flex-1">
        <span className="text-[10px] text-[#c9a84c] font-semibold tracking-wider uppercase mb-2">
          {ann.date}
        </span>
        <h3 className="font-bold text-[#1a1a1a] text-sm mb-2 leading-snug">{ann.title}</h3>
        {ann.body && (
          <p className="text-xs text-[#666] leading-relaxed line-clamp-3">{ann.body}</p>
        )}
      </div>
    </div>
  );
}
