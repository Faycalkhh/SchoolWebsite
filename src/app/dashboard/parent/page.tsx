"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BookOpen, LogOut, ChevronDown, ChevronUp, CheckCircle2, XCircle, Bell, ClipboardList } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import type { Lang } from "@/context/LanguageContext";
import { getStudentsByParent, getProfiles, getTopStudents, getAnnouncements, getExams, getExamResults, addExamResult } from "@/lib/store";
import type { Student, Session, Discipline, TopEntry, Announcement, Exam, ExamResult } from "@/lib/types";
import MemoMap from "@/components/MemoMap";

const t = {
  ar: {
    schoolName: "نور القرآن",
    role: "فضاء ولي الأمر",
    logout: "تسجيل الخروج",
    greeting: (name: string) => `مرحباً، ${name} 👋`,
    subtitle: (n: number) => n > 1 ? "هذا متابعة أطفالك." : "هذا متابعة طفلك.",
    noChildren: "لا يوجد طالب مرتبط بحسابك حالياً.",
    noChildrenHint: "تواصل مع المدرسة للمزيد من المعلومات.",
    ageSuffix: "سنة",
    presentLabel: "الحضور",
    sessions: (n: number) => `${n} حصة`,
    noSessions: "لم يتم تسجيل أي حصة بعد.",
    statSessions: "الحصص",
    statAttendance: "الحضور",
    statLastDisc: "آخر انضباط",
    sessionDetail: "تفاصيل الحصص",
    present: "حاضر",
    absent: "غائب",
    memo: "الحفظ:",
    topBadge: "من أفضل 3 طلاب الأسبوع",
    announcementsTitle: "إعلانات المدرسة",
    memoMapTitle: "خريطة الحفظ",
    examsTitle: "الاختبارات المتاحة",
    examsTakenTitle: "الاختبارات المنجزة",
    startExam: "ابدأ الاختبار",
    submitExam: "إرسال الإجابات",
    submitting: "جارٍ الإرسال...",
    cancelExam: "إلغاء",
    errAllAnswers: "يرجى الإجابة على جميع الأسئلة.",
    questions: (n: number) => `${n} سؤال`,
    scoreLabel: "النتيجة:",
    noExams: "لا توجد اختبارات متاحة حالياً.",
    disciplines: {
      excellent: "ممتاز", bon: "جيد", passable: "مقبول", insuffisant: "ضعيف",
    },
    levels: {
      "Débutant": "مبتدئ", "Intermédiaire": "متوسط", "Avancé": "متقدم", "Hifz": "حفظ",
    },
  },
  fr: {
    schoolName: "Nur Al-Quran",
    role: "Espace Parent",
    logout: "Déconnexion",
    greeting: (name: string) => `Bonjour, ${name} 👋`,
    subtitle: (n: number) => `Voici le suivi de ${n > 1 ? "vos enfants" : "votre enfant"}.`,
    noChildren: "Aucun élève associé à votre compte pour le moment.",
    noChildrenHint: "Contactez l'école pour plus d'informations.",
    ageSuffix: "ans",
    presentLabel: "présence",
    sessions: (n: number) => `${n} séance${n !== 1 ? "s" : ""}`,
    noSessions: "Aucune séance enregistrée pour le moment.",
    statSessions: "Séances",
    statAttendance: "Présence",
    statLastDisc: "Dernière discipline",
    sessionDetail: "Détail des séances",
    present: "Présent",
    absent: "Absent",
    memo: "Mémorisation :",
    topBadge: "Top 3 de la semaine",
    announcementsTitle: "Annonces de l'école",
    memoMapTitle: "Carte de mémorisation",
    examsTitle: "Examens disponibles",
    examsTakenTitle: "Examens passés",
    startExam: "Commencer l'examen",
    submitExam: "Envoyer les réponses",
    submitting: "Envoi en cours...",
    cancelExam: "Annuler",
    errAllAnswers: "Veuillez répondre à toutes les questions.",
    questions: (n: number) => `${n} question${n !== 1 ? "s" : ""}`,
    scoreLabel: "Score :",
    noExams: "Aucun examen disponible pour le moment.",
    disciplines: {
      excellent: "Excellent", bon: "Bon", passable: "Passable", insuffisant: "Insuffisant",
    },
    levels: {
      "Débutant": "Débutant", "Intermédiaire": "Intermédiaire", "Avancé": "Avancé", "Hifz": "Hifz",
    },
  },
};

const DISC_CLS: Record<Discipline, string> = {
  excellent: "text-emerald-700 bg-emerald-50 border-emerald-200",
  bon: "text-blue-700 bg-blue-50 border-blue-200",
  passable: "text-amber-700 bg-amber-50 border-amber-200",
  insuffisant: "text-red-700 bg-red-50 border-red-200",
};

function attendanceRate(sessions: Session[]) {
  if (!sessions.length) return null;
  return Math.round((sessions.filter((s) => s.present).length / sessions.length) * 100);
}
function initials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}
function lastDiscipline(sessions: Session[]): Discipline | null {
  if (!sessions.length) return null;
  return [...sessions].sort((a, b) => b.date.localeCompare(a.date))[0].discipline;
}

const RANK_MEDALS: Record<1 | 2 | 3, string> = { 1: "🥇", 2: "🥈", 3: "🥉" };

export default function ParentDashboard() {
  const { user, loading: authLoading, logout } = useAuth();
  const { lang, dir, setLang } = useLanguage();
  const T = t[lang];
  const router = useRouter();

  const [children, setChildren] = useState<Student[]>([]);
  const [professorNames, setProfessorNames] = useState<Record<string, string>>({});
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [topStudents, setTopStudents] = useState<TopEntry[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [examResults, setExamResults] = useState<ExamResult[]>([]);
  const [takingExam, setTakingExam] = useState<{ examId: string; studentId: string } | null>(null);
  const [examAnswers, setExamAnswers] = useState<Record<string, string>>({});
  const [examSubmitErr, setExamSubmitErr] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push("/login"); return; }
    if (user.role !== "parent") { router.push("/login"); return; }
    (async () => {
      const [mine, profs, tops, anns, exs, results] = await Promise.all([
        getStudentsByParent(user.id),
        getProfiles(),
        getTopStudents(),
        getAnnouncements(),
        getExams(),
        getExamResults(),
      ]);
      setChildren(mine);
      if (mine.length > 0) setExpandedId(mine[0].id);
      const map: Record<string, string> = {};
      profs.forEach((p) => { map[p.id] = p.name; });
      setProfessorNames(map);
      setTopStudents(tops);
      setAnnouncements(anns);
      setExams(exs);
      setExamResults(results);
    })();
  }, [user, authLoading, router]);

  async function handleSubmitExam() {
    if (!takingExam) return;
    const exam = exams.find((e) => e.id === takingExam.examId);
    if (!exam) return;
    if (exam.questions.some((q) => !examAnswers[q.id])) { setExamSubmitErr(T.errAllAnswers); return; }
    setSubmitting(true);
    const correct = exam.questions.filter((q) => examAnswers[q.id] === q.correctOptionId).length;
    const score = Math.round((correct / exam.questions.length) * 100);
    const result: Omit<ExamResult, "id"> = {
      examId: exam.id,
      studentId: takingExam.studentId,
      answers: { ...examAnswers },
      score,
      correctCount: correct,
      totalCount: exam.questions.length,
      dateTaken: new Date().toISOString().split("T")[0],
    };
    await addExamResult(result);
    setExamResults((prev) => [...prev, { ...result, id: `res_${Date.now()}` }]);
    setTakingExam(null);
    setExamAnswers({});
    setExamSubmitErr("");
    setSubmitting(false);
  }

  function scoreColor(score: number) {
    if (score >= 70) return "text-emerald-700 bg-emerald-50 border-emerald-200";
    if (score >= 50) return "text-amber-700 bg-amber-50 border-amber-200";
    return "text-red-700 bg-red-50 border-red-200";
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#f5f0e8]" dir={dir}>
      <header className="bg-white border-b border-[#e8dfc8] sticky top-0 z-30 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 lg:px-8 py-3.5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#2d6a4f] flex items-center justify-center shrink-0">
              <BookOpen size={15} className="text-[#c9a84c]" />
            </div>
            <span className="font-bold text-[#2d6a4f] text-base hidden sm:block">{T.schoolName}</span>
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLang(lang === "ar" ? "fr" : "ar" as Lang)}
              className="px-2.5 py-1.5 rounded-lg border border-[#e8dfc8] text-xs font-semibold text-[#555] hover:bg-[#f5f0e8] transition-colors"
            >
              {lang === "ar" ? "FR" : "عر"}
            </button>
            <div className="hidden sm:block text-end">
              <div className="text-sm font-semibold text-[#1a1a1a]">{user.name}</div>
              <div className="text-xs text-[#c9a84c]">{T.role}</div>
            </div>
            <button
              onClick={() => { logout(); router.push("/"); }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-[#888] hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut size={15} />
              <span className="hidden sm:inline">{T.logout}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-[#1a1a1a]">{T.greeting(user.name.split(" ")[0])}</h1>
          <p className="text-sm text-[#888] mt-1">{T.subtitle(children.length)}</p>
        </div>

        {/* ── ANNOUNCEMENTS ── */}
        {announcements.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Bell size={15} className="text-[#c9a84c]" />
              <h2 className="text-sm font-bold text-[#1a1a1a]">{T.announcementsTitle}</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {announcements.map((ann) => (
                <div key={ann.id} className="bg-white rounded-2xl border border-[#e8dfc8] overflow-hidden flex shadow-sm">
                  {ann.image && (
                    <img src={ann.image} className="w-20 h-20 object-cover shrink-0" alt="" />
                  )}
                  <div className="p-4 min-w-0">
                    <div className="text-[10px] text-[#c9a84c] font-semibold mb-1">{ann.date}</div>
                    <div className="font-semibold text-[#1a1a1a] text-sm truncate">{ann.title}</div>
                    {ann.body && <p className="text-xs text-[#666] mt-1 line-clamp-2 leading-relaxed">{ann.body}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── CHILDREN ── */}
        {children.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-[#e8dfc8] shadow-sm">
            <BookOpen size={44} className="mx-auto mb-3 text-[#e8dfc8]" />
            <p className="text-sm text-[#aaa]">{T.noChildren}</p>
            <p className="text-xs text-[#ccc] mt-1">{T.noChildrenHint}</p>
          </div>
        ) : (
          <div className="space-y-5">
            {children.map((child) => {
              const sorted = [...child.sessions].sort((a, b) => b.date.localeCompare(a.date));
              const rate = attendanceRate(child.sessions);
              const lastDisc = lastDiscipline(child.sessions);
              const isExpanded = expandedId === child.id;
              const levelLabel = T.levels[child.level as keyof typeof T.levels] ?? child.level;
              const topEntry = topStudents.find((e) => e.studentId === child.id);

              return (
                <div key={child.id} className="bg-white rounded-2xl border border-[#e8dfc8] overflow-hidden shadow-sm">
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : child.id)}
                    className="w-full flex items-center justify-between p-5 text-start hover:bg-[#faf8f4] transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {child.photo ? (
                        <img src={child.photo} className="w-12 h-12 rounded-full object-cover shrink-0" alt="" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-[#c9a84c]/15 flex items-center justify-center text-[#c9a84c] font-bold text-sm shrink-0">
                          {initials(child.name)}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-[#1a1a1a]">{child.name}</span>
                          {topEntry && (
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700">
                              {RANK_MEDALS[topEntry.rank]} {T.topBadge}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-[#aaa] mt-0.5">
                          {levelLabel}{child.age > 0 ? ` · ${child.age} ${T.ageSuffix}` : ""}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="hidden sm:flex items-center gap-3 text-xs">
                        {rate !== null && (
                          <div className="text-end">
                            <div className="font-bold text-[#1a1a1a] text-base">{rate}%</div>
                            <div className="text-[#aaa]">{T.presentLabel}</div>
                          </div>
                        )}
                        {lastDisc && (
                          <span className={`px-2.5 py-1 rounded-full font-medium border text-xs ${DISC_CLS[lastDisc]}`}>
                            {T.disciplines[lastDisc]}
                          </span>
                        )}
                        <span className="text-[#ccc]">{T.sessions(child.sessions.length)}</span>
                      </div>
                      {isExpanded ? <ChevronUp size={16} className="text-[#bbb] shrink-0" /> : <ChevronDown size={16} className="text-[#bbb] shrink-0" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="border-t border-[#f0ead8] p-5 space-y-6">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <div className="bg-[#f5f0e8] rounded-xl p-4 text-center">
                          <div className="text-2xl font-bold text-[#2d6a4f]">{child.sessions.length}</div>
                          <div className="text-xs text-[#888] mt-0.5">{T.statSessions}</div>
                        </div>
                        <div className="bg-[#f5f0e8] rounded-xl p-4 text-center">
                          <div className="text-2xl font-bold text-[#2d6a4f]">{rate ?? "—"}%</div>
                          <div className="text-xs text-[#888] mt-0.5">{T.statAttendance}</div>
                        </div>
                        <div className="bg-[#f5f0e8] rounded-xl p-4 text-center col-span-2 sm:col-span-1">
                          <div className={`text-sm font-bold mt-1 ${lastDisc ? DISC_CLS[lastDisc].split(" ")[0] : "text-[#aaa]"}`}>
                            {lastDisc ? T.disciplines[lastDisc] : "—"}
                          </div>
                          <div className="text-xs text-[#888] mt-0.5">{T.statLastDisc}</div>
                        </div>
                      </div>

                      {/* ── EXAMS ── */}
                      {(() => {
                        const available = exams.filter((ex) => !examResults.some((r) => r.examId === ex.id && r.studentId === child.id));
                        const taken = examResults.filter((r) => r.studentId === child.id);
                        const isThisExamActive = takingExam?.studentId === child.id;
                        const activeExam = isThisExamActive ? exams.find((e) => e.id === takingExam?.examId) : null;
                        return (
                          <div>
                            {/* Taking exam inline form */}
                            {activeExam && (
                              <div className="bg-white rounded-2xl border border-[#e8dfc8] p-5 mb-4 shadow-sm">
                                <h4 className="text-sm font-bold text-[#1a1a1a] mb-4">{activeExam.title}</h4>
                                <div className="space-y-5">
                                  {activeExam.questions.map((q, qi) => (
                                    <div key={q.id}>
                                      <p className="text-sm font-semibold text-[#333] mb-2">{qi + 1}. {q.text}</p>
                                      <div className="space-y-2">
                                        {q.options.map((opt, oi) => {
                                          const labels = ["A", "B", "C", "D"];
                                          const selected = examAnswers[q.id] === opt.id;
                                          return (
                                            <button key={opt.id} type="button"
                                              onClick={() => { setExamAnswers({ ...examAnswers, [q.id]: opt.id }); setExamSubmitErr(""); }}
                                              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl border text-sm text-start transition-colors ${selected ? "bg-[#2d6a4f] text-white border-[#2d6a4f]" : "bg-[#faf8f4] border-[#e8dfc8] text-[#444] hover:border-[#2d6a4f]/40"}`}>
                                              <span className={`w-6 h-6 rounded-full shrink-0 text-xs font-bold flex items-center justify-center ${selected ? "bg-white/20 text-white" : "bg-[#2d6a4f]/10 text-[#2d6a4f]"}`}>{labels[oi]}</span>
                                              {opt.text}
                                            </button>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                {examSubmitErr && <p className="text-red-500 text-xs mt-3">{examSubmitErr}</p>}
                                <div className="flex gap-3 mt-5">
                                  <button onClick={handleSubmitExam} disabled={submitting} className="px-5 py-2.5 rounded-xl bg-[#2d6a4f] text-white text-sm font-semibold hover:bg-[#235a40] disabled:opacity-60 disabled:cursor-wait transition-colors">{submitting ? T.submitting : T.submitExam}</button>
                                  <button onClick={() => { setTakingExam(null); setExamAnswers({}); setExamSubmitErr(""); }} className="px-5 py-2.5 rounded-xl border border-[#e8dfc8] text-[#666] text-sm hover:bg-[#f5f0e8] transition-colors">{T.cancelExam}</button>
                                </div>
                              </div>
                            )}

                            {/* Available exams */}
                            {!activeExam && (
                              <div className="mb-4">
                                <div className="flex items-center gap-2 mb-3">
                                  <ClipboardList size={14} className="text-[#2d6a4f]" />
                                  <h4 className="text-sm font-semibold text-[#1a1a1a]">{T.examsTitle}</h4>
                                </div>
                                {available.length === 0 ? (
                                  <p className="text-xs text-[#ccc]">{T.noExams}</p>
                                ) : (
                                  <div className="space-y-2">
                                    {available.map((ex) => (
                                      <div key={ex.id} className="flex items-center justify-between bg-[#faf8f4] rounded-xl border border-[#e8dfc8] px-4 py-3">
                                        <div>
                                          <div className="text-sm font-semibold text-[#1a1a1a]">{ex.title}</div>
                                          <div className="text-xs text-[#aaa] mt-0.5">{T.questions(ex.questions.length)} · {ex.date}</div>
                                        </div>
                                        <button
                                          onClick={() => { setTakingExam({ examId: ex.id, studentId: child.id }); setExamAnswers({}); setExamSubmitErr(""); }}
                                          className="px-3 py-1.5 rounded-lg bg-[#2d6a4f] text-white text-xs font-semibold hover:bg-[#235a40] transition-colors whitespace-nowrap ms-3">
                                          {T.startExam}
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Taken exams */}
                            {taken.length > 0 && !activeExam && (
                              <div className="mb-4">
                                <h4 className="text-sm font-semibold text-[#1a1a1a] mb-3">{T.examsTakenTitle}</h4>
                                <div className="space-y-2">
                                  {taken.map((r) => {
                                    const ex = exams.find((e) => e.id === r.examId);
                                    return (
                                      <div key={r.id} className="flex items-center justify-between bg-[#faf8f4] rounded-xl border border-[#e8dfc8] px-4 py-3">
                                        <div>
                                          <div className="text-sm font-semibold text-[#1a1a1a]">{ex?.title ?? r.examId}</div>
                                          <div className="text-xs text-[#aaa] mt-0.5">{r.dateTaken}</div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ms-3 ${scoreColor(r.score)}`}>
                                          {r.correctCount}/{r.totalCount} — {r.score}%
                                        </span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })()}

                      {/* Session history */}
                      {child.sessions.length === 0 ? (
                        <p className="text-sm text-[#ccc] text-center py-6">{T.noSessions}</p>
                      ) : (
                        <div>
                          <h4 className="text-sm font-semibold text-[#1a1a1a] mb-3">{T.sessionDetail}</h4>
                          <div className="space-y-3">
                            {sorted.map((s) => (
                              <div key={s.id} className="rounded-xl border border-[#f0ead8] p-4 bg-[#faf8f4]">
                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                  <span className="text-xs font-semibold text-[#555]">{s.date}</span>
                                  <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${s.present ? "text-emerald-700 bg-emerald-50 border-emerald-200" : "text-red-700 bg-red-50 border-red-200"}`}>
                                    {s.present ? <><CheckCircle2 size={11} />{T.present}</> : <><XCircle size={11} />{T.absent}</>}
                                  </span>
                                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${DISC_CLS[s.discipline]}`}>
                                    {T.disciplines[s.discipline]}
                                  </span>
                                  {professorNames[s.professorId] && (
                                    <span className="text-xs text-[#aaa]">— {professorNames[s.professorId]}</span>
                                  )}
                                </div>
                                {s.memorization && (
                                  <div className="text-xs text-[#555] mb-1">
                                    <span className="font-semibold text-[#c9a84c]">{T.memo}</span>{" "}{s.memorization}
                                  </div>
                                )}
                                {s.comment && (
                                  <div className="text-xs text-[#666] italic border-s-2 border-[#c9a84c]/40 ps-3 mt-2">
                                    &ldquo;{s.comment}&rdquo;
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Memorization map (read-only) — at the bottom */}
                      {child.memorization && Object.keys(child.memorization).length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-[#1a1a1a] mb-3">{T.memoMapTitle}</h4>
                          <MemoMap value={child.memorization} editable={false} lang={lang} />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
