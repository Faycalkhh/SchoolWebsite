"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { SURAHS, JUZ_SURAHS, countMemorized, type SurahStatus } from "@/lib/quran";

const STATUS_CYCLE: SurahStatus[] = ["not_started", "in_progress", "memorized", "needs_revision"];

const STATUS_CLS: Record<SurahStatus, string> = {
  not_started:    "bg-gray-100 text-gray-400 border-gray-200",
  in_progress:    "bg-amber-50 text-amber-700 border-amber-300",
  memorized:      "bg-emerald-50 text-emerald-700 border-emerald-300",
  needs_revision: "bg-red-50 text-red-600 border-red-300",
};

const JUZ_BAR_CLS: Record<SurahStatus, string> = {
  not_started:    "bg-gray-200",
  in_progress:    "bg-amber-400",
  memorized:      "bg-emerald-500",
  needs_revision: "bg-red-400",
};

const tMap = {
  ar: {
    juz: (n: number) => `الجزء ${n}`,
    total: (n: number) => `${n} / 114 سورة محفوظة`,
    legend: "المفتاح",
    statuses: {
      not_started:    "لم يبدأ",
      in_progress:    "جارٍ الحفظ",
      memorized:      "محفوظ",
      needs_revision: "يحتاج مراجعة",
    },
    clickHint: "انقر على السورة لتغيير حالتها",
  },
  fr: {
    juz: (n: number) => `Juz ${n}`,
    total: (n: number) => `${n} / 114 sourates mémorisées`,
    legend: "Légende",
    statuses: {
      not_started:    "Non commencé",
      in_progress:    "En cours",
      memorized:      "Mémorisé",
      needs_revision: "À réviser",
    },
    clickHint: "Cliquez sur une sourate pour changer son état",
  },
};

interface Props {
  value: Record<number, SurahStatus>;
  editable?: boolean;
  onChange?: (updated: Record<number, SurahStatus>) => void;
  lang: "ar" | "fr";
}

function getStatus(memo: Record<number, SurahStatus>, n: number): SurahStatus {
  return memo[n] ?? "not_started";
}

export default function MemoMap({ value, editable = false, onChange, lang }: Props) {
  const T = tMap[lang];
  const [openJuz, setOpenJuz] = useState<number[]>([30]);

  const memorizedCount = countMemorized(value);
  const totalPct = Math.round((memorizedCount / 114) * 100);

  function cycleStatus(n: number) {
    if (!editable || !onChange) return;
    const cur = getStatus(value, n);
    const next = STATUS_CYCLE[(STATUS_CYCLE.indexOf(cur) + 1) % STATUS_CYCLE.length];
    onChange({ ...value, [n]: next });
  }

  function toggleJuz(juzNum: number) {
    setOpenJuz((prev) =>
      prev.includes(juzNum) ? prev.filter((j) => j !== juzNum) : [...prev, juzNum]
    );
  }

  return (
    <div className="space-y-4" dir={lang === "ar" ? "rtl" : "ltr"}>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-[#2d6a4f]">{T.total(memorizedCount)}</span>
            <span className="text-xs text-[#aaa]">{totalPct}%</span>
          </div>
          <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${totalPct}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 items-center text-xs">
        <span className="text-[#aaa] font-semibold">{T.legend} :</span>
        {(["not_started", "in_progress", "memorized", "needs_revision"] as SurahStatus[]).map((s) => (
          <span key={s} className={`px-2 py-0.5 rounded-full border font-medium ${STATUS_CLS[s]}`}>
            {T.statuses[s]}
          </span>
        ))}
      </div>

      {editable && (
        <p className="text-[10px] text-[#bbb] italic">{T.clickHint}</p>
      )}

      <div className="space-y-2">
        {JUZ_SURAHS.map((surahs, idx) => {
          const juzNum = idx + 1;
          const isOpen = openJuz.includes(juzNum);
          const juzMemo = surahs.filter((s) => getStatus(value, s.n) === "memorized").length;
          const juzPct = Math.round((juzMemo / surahs.length) * 100);

          return (
            <div key={juzNum} className="border border-[#e8dfc8] rounded-xl overflow-hidden">
              <button
                onClick={() => toggleJuz(juzNum)}
                className="w-full flex items-center justify-between px-4 py-2.5 bg-[#faf8f4] hover:bg-[#f5f0e8] transition-colors text-start"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs font-bold text-[#2d6a4f] shrink-0">{T.juz(juzNum)}</span>
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden shrink-0">
                      <div
                        className="h-full bg-emerald-400 rounded-full transition-all"
                        style={{ width: `${juzPct}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-[#aaa] shrink-0">{juzMemo}/{surahs.length}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="hidden sm:flex gap-0.5">
                    {surahs.map((s) => (
                      <div
                        key={s.n}
                        className={`w-2 h-2 rounded-sm ${JUZ_BAR_CLS[getStatus(value, s.n)]}`}
                      />
                    ))}
                  </div>
                  {isOpen ? <ChevronUp size={14} className="text-[#bbb]" /> : <ChevronDown size={14} className="text-[#bbb]" />}
                </div>
              </button>

              {isOpen && (
                <div className="p-3 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-1.5">
                  {surahs.map((s) => {
                    const status = getStatus(value, s.n);
                    return (
                      <button
                        key={s.n}
                        onClick={() => cycleStatus(s.n)}
                        disabled={!editable}
                        className={`rounded-lg border px-2 py-1.5 text-center transition-colors ${STATUS_CLS[status]} ${editable ? "hover:opacity-75 cursor-pointer" : "cursor-default"}`}
                        title={`${lang === "ar" ? s.ar : s.fr} — ${T.statuses[status]}`}
                      >
                        <div className="text-[10px] font-bold">{s.n}</div>
                        <div className="text-[10px] leading-tight mt-0.5 truncate">
                          {lang === "ar" ? s.ar : s.fr}
                        </div>
                        <div className="text-[9px] opacity-60 mt-0.5">{s.ayahs}v</div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
