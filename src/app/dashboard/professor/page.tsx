"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BookOpen, LogOut, Plus, ChevronDown, ChevronUp,
  Users, GraduationCap, Search, X, CheckCircle,
  Pencil, Trash2, ChevronLeft, ChevronRight, Trophy,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import type { Lang } from "@/context/LanguageContext";
import { getStudents, saveStudents, getUsers, saveUsers, getTopStudents, saveTopStudents } from "@/lib/store";
import type { Student, Session, User, Discipline, Level, TopEntry } from "@/lib/types";

const t = {
  ar: {
    schoolName: "نور القرآن",
    professor: "أستاذ",
    logout: "تسجيل الخروج",
    tabStudents: "الطلاب",
    tabProfessors: "الأساتذة",
    tabTop3: "أفضل 3",
    toastSession: "تم تسجيل الحصة بنجاح.",
    toastStudent: "تم إضافة الطالب بنجاح.",
    toastProf: "تم إضافة الأستاذ بنجاح.",
    toastDeleted: "تم الحذف بنجاح.",
    toastEdited: "تم تعديل بيانات الطالب بنجاح.",
    toastTop3: "تم حفظ أفضل 3 طلاب للأسبوع.",
    errRequired: "يرجى ملء جميع الحقول الإلزامية.",
    errEmail: "هذا البريد الإلكتروني مستخدم بالفعل.",
    confirmDelete: "هل أنت متأكد من الحذف؟",
    confirmYes: "نعم، احذف",
    searchPh: "البحث عن طالب...",
    addStudent: "إضافة طالب",
    newStudent: "طالب جديد",
    editTitle: "تعديل بيانات الطالب",
    editLabel: "تعديل",
    deleteLabel: "حذف",
    fieldName: "الاسم الكامل *",
    fieldAge: "العمر",
    fieldLevel: "المستوى",
    fieldParentName: "اسم ولي الأمر *",
    fieldParentEmail: "البريد الإلكتروني لولي الأمر *",
    parentHint: "إذا لم يكن لولي الأمر حساب، سيتم إنشاؤه تلقائياً (كلمة المرور الافتراضية: parent123).",
    photoUpload: "صورة الطالب",
    save: "حفظ",
    cancel: "إلغاء",
    noStudents: "لم يُعثر على طالب.",
    parentLabel: "ولي الأمر:",
    sessions: (n: number) => `${n} حصة`,
    attendanceLabel: "الحضور:",
    sessionHistory: "سجل الحصص",
    noSessions: "لم يتم تسجيل أي حصة.",
    colDate: "التاريخ",
    colAttendance: "الحضور",
    colDiscipline: "الانضباط",
    colMemo: "الحفظ",
    colComment: "الملاحظة",
    present: "حاضر",
    absent: "غائب",
    newSession: "حصة جديدة",
    fieldDate: "التاريخ",
    fieldPresence: "الحضور",
    fieldDiscipline: "الانضباط",
    fieldMemo: "الحفظ / المراجعة",
    memoPh: "مثال: الفاتحة (1-7)",
    fieldComment: "ملاحظة الأستاذ",
    commentPh: "الملاحظات، نقاط التحسين...",
    saveSession: "تسجيل الحصة",
    addSession: "إضافة حصة",
    addProf: "إضافة أستاذ",
    newProf: "أستاذ جديد",
    fieldEmail: "البريد الإلكتروني *",
    fieldPassword: "كلمة المرور *",
    fieldSpecialty: "التخصص",
    specialtyPh: "التجويد، الحفظ، اللغة العربية...",
    yourAccount: "حسابك",
    ageSuffix: "سنة",
    prevPage: "السابق",
    nextPage: "التالي",
    top3Title: "أفضل 3 طلاب للأسبوع",
    rank1: "المركز الأول 🥇",
    rank2: "المركز الثاني 🥈",
    rank3: "المركز الثالث 🥉",
    top3Save: "حفظ الاختيار",
    top3None: "— لا أحد —",
    disciplines: {
      excellent: "ممتاز",
      bon: "جيد",
      passable: "مقبول",
      insuffisant: "ضعيف",
    },
    levels: {
      "Débutant": "مبتدئ",
      "Intermédiaire": "متوسط",
      "Avancé": "متقدم",
      "Hifz": "حفظ",
    },
  },
  fr: {
    schoolName: "Nur Al-Quran",
    professor: "Professeur",
    logout: "Déconnexion",
    tabStudents: "Élèves",
    tabProfessors: "Professeurs",
    tabTop3: "Top 3",
    toastSession: "Séance enregistrée avec succès.",
    toastStudent: "Élève ajouté avec succès.",
    toastProf: "Professeur ajouté avec succès.",
    toastDeleted: "Supprimé avec succès.",
    toastEdited: "Informations modifiées avec succès.",
    toastTop3: "Top 3 de la semaine enregistré.",
    errRequired: "Veuillez remplir tous les champs obligatoires.",
    errEmail: "Cet email est déjà utilisé.",
    confirmDelete: "Confirmer la suppression ?",
    confirmYes: "Oui, supprimer",
    searchPh: "Rechercher un élève...",
    addStudent: "Ajouter un élève",
    newStudent: "Nouvel élève",
    editTitle: "Modifier les informations",
    editLabel: "Modifier",
    deleteLabel: "Supprimer",
    fieldName: "Nom complet *",
    fieldAge: "Âge",
    fieldLevel: "Niveau",
    fieldParentName: "Nom du parent *",
    fieldParentEmail: "Email du parent *",
    parentHint: "Si ce parent n'a pas encore de compte, un compte sera créé automatiquement (mot de passe par défaut : parent123).",
    photoUpload: "Photo de l'élève",
    save: "Enregistrer",
    cancel: "Annuler",
    noStudents: "Aucun élève trouvé.",
    parentLabel: "Parent :",
    sessions: (n: number) => `${n} séance${n !== 1 ? "s" : ""}`,
    attendanceLabel: "Présence :",
    sessionHistory: "Historique des séances",
    noSessions: "Aucune séance enregistrée.",
    colDate: "Date",
    colAttendance: "Présence",
    colDiscipline: "Discipline",
    colMemo: "Mémorisation",
    colComment: "Commentaire",
    present: "Présent",
    absent: "Absent",
    newSession: "Nouvelle séance",
    fieldDate: "Date",
    fieldPresence: "Présence",
    fieldDiscipline: "Discipline",
    fieldMemo: "Mémorisation / Révision",
    memoPh: "Ex : Al-Fatiha (1-7)",
    fieldComment: "Commentaire du professeur",
    commentPh: "Observations, points à améliorer...",
    saveSession: "Enregistrer la séance",
    addSession: "Ajouter une séance",
    addProf: "Ajouter un professeur",
    newProf: "Nouveau professeur",
    fieldEmail: "Email *",
    fieldPassword: "Mot de passe *",
    fieldSpecialty: "Spécialité",
    specialtyPh: "Tajweed, Hifz, Langue Arabe...",
    yourAccount: "Votre compte",
    ageSuffix: "ans",
    prevPage: "Précédent",
    nextPage: "Suivant",
    top3Title: "Top 3 élèves de la semaine",
    rank1: "1ère place 🥇",
    rank2: "2ème place 🥈",
    rank3: "3ème place 🥉",
    top3Save: "Enregistrer le choix",
    top3None: "— Aucun —",
    disciplines: {
      excellent: "Excellent",
      bon: "Bon",
      passable: "Passable",
      insuffisant: "Insuffisant",
    },
    levels: {
      "Débutant": "Débutant",
      "Intermédiaire": "Intermédiaire",
      "Avancé": "Avancé",
      "Hifz": "Hifz",
    },
  },
};

const DISC_CLS: Record<Discipline, string> = {
  excellent: "text-emerald-700 bg-emerald-50 border-emerald-200",
  bon: "text-blue-700 bg-blue-50 border-blue-200",
  passable: "text-amber-700 bg-amber-50 border-amber-200",
  insuffisant: "text-red-700 bg-red-50 border-red-200",
};

const LEVELS: Level[] = ["Débutant", "Intermédiaire", "Avancé", "Hifz"];
const PAGE_SIZE = 8;

const INPUT =
  "w-full px-3.5 py-2.5 rounded-xl border border-[#e8dfc8] bg-white text-sm placeholder-[#bbb] focus:outline-none focus:border-[#2d6a4f] focus:ring-2 focus:ring-[#2d6a4f]/10 transition-all";
const LABEL =
  "block text-xs font-semibold text-[#555] uppercase tracking-wider mb-1.5";

async function resizeToBase64(file: File): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 200;
      canvas.height = 200;
      const ctx = canvas.getContext("2d")!;
      const size = Math.min(img.width, img.height);
      const ox = (img.width - size) / 2;
      const oy = (img.height - size) / 2;
      ctx.drawImage(img, ox, oy, size, size, 0, 0, 200, 200);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.7));
    };
    img.src = url;
  });
}

function attendanceRate(sessions: Session[]) {
  if (!sessions.length) return "—";
  return `${Math.round((sessions.filter((s) => s.present).length / sessions.length) * 100)}%`;
}
function initials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

const emptySession = () => ({
  date: new Date().toISOString().split("T")[0],
  present: true,
  discipline: "bon" as Discipline,
  memorization: "",
  comment: "",
});
const emptyStudent = () => ({
  name: "", age: "", level: "Débutant" as Level,
  parentEmail: "", parentName: "", photo: "",
});
const emptyProf = () => ({ name: "", email: "", password: "", specialty: "" });

export default function ProfessorDashboard() {
  const { user, logout } = useAuth();
  const { lang, dir, setLang } = useLanguage();
  const T = t[lang];
  const router = useRouter();

  const [students, setStudents] = useState<Student[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [topStudents, setTopStudents] = useState<TopEntry[]>([]);
  const [topForm, setTopForm] = useState<{ r1: string; r2: string; r3: string }>({ r1: "", r2: "", r3: "" });

  const [tab, setTab] = useState<"students" | "professors" | "top3">("students");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showNewSession, setShowNewSession] = useState<string | null>(null);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showAddProf, setShowAddProf] = useState(false);
  const [sessionForm, setSessionForm] = useState(emptySession());
  const [studentForm, setStudentForm] = useState(emptyStudent());
  const [profForm, setProfForm] = useState(emptyProf());
  const [studentErr, setStudentErr] = useState("");
  const [profErr, setProfErr] = useState("");
  const [toast, setToast] = useState("");

  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ name: string; age: string; level: Level; photo: string }>({ name: "", age: "", level: "Débutant", photo: "" });
  const [deletingStudentId, setDeletingStudentId] = useState<string | null>(null);
  const [deletingProfId, setDeletingProfId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) { router.push("/login"); return; }
    if (user.role !== "professor") { router.push("/login"); return; }
    setStudents(getStudents());
    setUsers(getUsers());
    const tops = getTopStudents();
    setTopStudents(tops);
    const form = { r1: "", r2: "", r3: "" };
    tops.forEach((e) => {
      if (e.rank === 1) form.r1 = e.studentId;
      else if (e.rank === 2) form.r2 = e.studentId;
      else if (e.rank === 3) form.r3 = e.studentId;
    });
    setTopForm(form);
  }, [user, router]);

  useEffect(() => { setPage(0); }, [search]);

  function refresh() { setStudents(getStudents()); setUsers(getUsers()); }
  function flash(msg: string) { setToast(msg); setTimeout(() => setToast(""), 3500); }

  function handleAddSession(studentId: string) {
    const updated = students.map((s) => {
      if (s.id !== studentId) return s;
      const newSession: Session = { id: `ss_${Date.now()}`, ...sessionForm, professorId: user!.id };
      return { ...s, sessions: [...s.sessions, newSession] };
    });
    saveStudents(updated);
    setStudents(updated);
    setShowNewSession(null);
    setSessionForm(emptySession());
    flash(T.toastSession);
  }

  function handleAddStudent() {
    setStudentErr("");
    const { name, parentEmail, parentName } = studentForm;
    if (!name.trim() || !parentEmail.trim() || !parentName.trim()) { setStudentErr(T.errRequired); return; }
    const allUsers = getUsers();
    let parent = allUsers.find((u) => u.email === parentEmail);
    let updatedUsers = allUsers;
    if (!parent) {
      parent = { id: `u_${Date.now()}`, name: parentName, email: parentEmail, password: "parent123", role: "parent" };
      updatedUsers = [...allUsers, parent];
      saveUsers(updatedUsers);
    }
    saveStudents([...getStudents(), {
      id: `s_${Date.now()}`,
      name: studentForm.name,
      age: Number(studentForm.age) || 0,
      level: studentForm.level,
      parentId: parent.id,
      sessions: [],
      photo: studentForm.photo || undefined,
    }]);
    refresh();
    setStudentForm(emptyStudent());
    setShowAddStudent(false);
    flash(T.toastStudent);
  }

  function handleEditStudent() {
    if (!editingStudentId) return;
    const updated = students.map((s) => {
      if (s.id !== editingStudentId) return s;
      return { ...s, name: editForm.name, age: Number(editForm.age) || 0, level: editForm.level, photo: editForm.photo || undefined };
    });
    saveStudents(updated);
    setStudents(updated);
    setEditingStudentId(null);
    flash(T.toastEdited);
  }

  function handleDeleteStudent(id: string) {
    const updated = students.filter((s) => s.id !== id);
    saveStudents(updated);
    setStudents(updated);
    setDeletingStudentId(null);
    if (expandedId === id) setExpandedId(null);
    if (editingStudentId === id) setEditingStudentId(null);
    flash(T.toastDeleted);
  }

  function handleAddProf() {
    setProfErr("");
    const { name, email, password } = profForm;
    if (!name.trim() || !email.trim() || !password.trim()) { setProfErr(T.errRequired); return; }
    const allUsers = getUsers();
    if (allUsers.find((u) => u.email === email)) { setProfErr(T.errEmail); return; }
    saveUsers([...allUsers, { id: `u_${Date.now()}`, name, email, password, role: "professor", specialty: profForm.specialty }]);
    refresh();
    setProfForm(emptyProf());
    setShowAddProf(false);
    flash(T.toastProf);
  }

  function handleDeleteProf(id: string) {
    const updated = users.filter((u) => u.id !== id);
    saveUsers(updated);
    setUsers(updated);
    setDeletingProfId(null);
    flash(T.toastDeleted);
  }

  function handleSaveTop3() {
    const entries: TopEntry[] = [];
    if (topForm.r1) entries.push({ rank: 1, studentId: topForm.r1 });
    if (topForm.r2) entries.push({ rank: 2, studentId: topForm.r2 });
    if (topForm.r3) entries.push({ rank: 3, studentId: topForm.r3 });
    saveTopStudents(entries);
    setTopStudents(entries);
    flash(T.toastTop3);
  }

  const professors = users.filter((u) => u.role === "professor");
  const filtered = students.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()));
  const pageCount = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const getParentName = (parentId: string) => users.find((u) => u.id === parentId)?.name ?? "—";

  if (!user) return null;

  const tabConfig: { key: "students" | "professors" | "top3"; label: string; icon: React.ReactNode; count: number }[] = [
    { key: "students", label: T.tabStudents, icon: <Users size={14} />, count: students.length },
    { key: "professors", label: T.tabProfessors, icon: <GraduationCap size={14} />, count: professors.length },
    { key: "top3", label: T.tabTop3, icon: <Trophy size={14} />, count: topStudents.length },
  ];

  return (
    <div className="min-h-screen bg-[#f5f0e8]" dir={dir}>
      <header className="bg-white border-b border-[#e8dfc8] sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-3.5 flex items-center justify-between">
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
              <div className="text-xs text-[#c9a84c]">{user.specialty ?? T.professor}</div>
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

      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        {toast && (
          <div className="mb-5 flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-3 rounded-xl">
            <CheckCircle size={15} className="shrink-0" />
            {toast}
          </div>
        )}

        <div className="flex gap-1 bg-white rounded-xl p-1 border border-[#e8dfc8] mb-6 w-fit shadow-sm">
          {tabConfig.map(({ key, label, icon, count }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === key ? "bg-[#2d6a4f] text-white shadow-sm" : "text-[#777] hover:text-[#1a1a1a]"}`}
            >
              {icon}
              {label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === key ? "bg-white/20 text-white" : "bg-[#f0ead8] text-[#888]"}`}>
                {count}
              </span>
            </button>
          ))}
        </div>

        {/* ── STUDENTS TAB ── */}
        {tab === "students" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search size={14} className="absolute start-3.5 top-1/2 -translate-y-1/2 text-[#bbb]" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={T.searchPh}
                  className="w-full ps-9 pe-4 py-2.5 rounded-xl border border-[#e8dfc8] bg-white text-sm focus:outline-none focus:border-[#2d6a4f] focus:ring-2 focus:ring-[#2d6a4f]/10 transition-all shadow-sm"
                />
              </div>
              <button
                onClick={() => { setShowAddStudent(!showAddStudent); setStudentErr(""); }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2d6a4f] text-white text-sm font-semibold hover:bg-[#235a40] transition-colors whitespace-nowrap shadow-sm"
              >
                <Plus size={15} />
                {T.addStudent}
              </button>
            </div>

            {showAddStudent && (
              <div className="bg-white rounded-2xl border border-[#e8dfc8] p-6 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-bold text-[#1a1a1a]">{T.newStudent}</h3>
                  <button onClick={() => setShowAddStudent(false)} className="text-[#bbb] hover:text-[#555]"><X size={18} /></button>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className={LABEL}>{T.fieldName}</label>
                    <input className={INPUT} placeholder="Yusuf Ahmed" value={studentForm.name} onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })} />
                  </div>
                  <div>
                    <label className={LABEL}>{T.fieldAge}</label>
                    <input type="number" className={INPUT} placeholder="10" min="3" max="99" value={studentForm.age} onChange={(e) => setStudentForm({ ...studentForm, age: e.target.value })} />
                  </div>
                  <div>
                    <label className={LABEL}>{T.fieldLevel}</label>
                    <select className={INPUT} value={studentForm.level} onChange={(e) => setStudentForm({ ...studentForm, level: e.target.value as Level })}>
                      {LEVELS.map((l) => <option key={l} value={l}>{T.levels[l]}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={LABEL}>{T.fieldParentName}</label>
                    <input className={INPUT} placeholder="Ahmed Martin" value={studentForm.parentName} onChange={(e) => setStudentForm({ ...studentForm, parentName: e.target.value })} />
                  </div>
                  <div>
                    <label className={LABEL}>{T.fieldParentEmail}</label>
                    <input type="email" className={INPUT} dir="ltr" placeholder="parent@email.com" value={studentForm.parentEmail} onChange={(e) => setStudentForm({ ...studentForm, parentEmail: e.target.value })} />
                    <p className="text-[10px] text-[#bbb] mt-1.5">{T.parentHint}</p>
                  </div>
                  <div>
                    <label className={LABEL}>{T.photoUpload}</label>
                    {studentForm.photo && (
                      <img src={studentForm.photo} className="w-14 h-14 rounded-full object-cover mb-2" alt="" />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="text-xs text-[#666] file:me-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-[#2d6a4f]/10 file:text-[#2d6a4f] file:font-semibold cursor-pointer"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) setStudentForm({ ...studentForm, photo: await resizeToBase64(file) });
                      }}
                    />
                  </div>
                </div>
                {studentErr && <p className="text-red-500 text-sm mt-3">{studentErr}</p>}
                <div className="flex gap-3 mt-5">
                  <button onClick={handleAddStudent} className="px-5 py-2.5 rounded-xl bg-[#2d6a4f] text-white text-sm font-semibold hover:bg-[#235a40] transition-colors">{T.save}</button>
                  <button onClick={() => setShowAddStudent(false)} className="px-5 py-2.5 rounded-xl border border-[#e8dfc8] text-[#666] text-sm hover:bg-[#f5f0e8] transition-colors">{T.cancel}</button>
                </div>
              </div>
            )}

            {filtered.length === 0 ? (
              <div className="text-center py-20 text-[#ccc]">
                <Users size={44} className="mx-auto mb-3 opacity-40" />
                <p className="text-sm">{T.noStudents}</p>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {paged.map((student) => {
                    const isExpanded = expandedId === student.id;
                    const isEditing = editingStudentId === student.id;
                    const isDeleting = deletingStudentId === student.id;
                    const sorted = [...student.sessions].sort((a, b) => b.date.localeCompare(a.date));
                    const last = sorted[0];

                    return (
                      <div key={student.id} className="bg-white rounded-2xl border border-[#e8dfc8] overflow-hidden shadow-sm">
                        {isDeleting ? (
                          <div className="p-5 flex flex-wrap items-center justify-between gap-3 bg-red-50">
                            <p className="text-sm font-medium text-red-700">{T.confirmDelete}</p>
                            <div className="flex gap-2">
                              <button onClick={() => handleDeleteStudent(student.id)} className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-semibold hover:bg-red-600 transition-colors">{T.confirmYes}</button>
                              <button onClick={() => setDeletingStudentId(null)} className="px-3 py-1.5 rounded-lg border border-[#e8dfc8] text-[#666] text-xs hover:bg-white transition-colors">{T.cancel}</button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div
                              onClick={() => { setExpandedId(isExpanded ? null : student.id); setShowNewSession(null); if (isEditing) setEditingStudentId(null); }}
                              className="flex items-center justify-between p-4 sm:p-5 hover:bg-[#faf8f4] transition-colors cursor-pointer"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                {student.photo ? (
                                  <img src={student.photo} className="w-10 h-10 rounded-full object-cover shrink-0" alt="" />
                                ) : (
                                  <div className="w-10 h-10 rounded-full bg-[#2d6a4f]/10 flex items-center justify-center text-[#2d6a4f] font-bold text-xs shrink-0">
                                    {initials(student.name)}
                                  </div>
                                )}
                                <div className="min-w-0">
                                  <div className="font-semibold text-[#1a1a1a] text-sm truncate">{student.name}</div>
                                  <div className="text-xs text-[#aaa] mt-0.5 truncate">
                                    {T.levels[student.level as Level] ?? student.level}
                                    {student.age > 0 ? ` · ${student.age} ${T.ageSuffix}` : ""}
                                    {" · "}{T.parentLabel} {getParentName(student.parentId)}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <div className="hidden sm:flex items-center gap-2.5 text-xs me-1">
                                  <span className="text-[#aaa]">{T.sessions(student.sessions.length)}</span>
                                  <span className="text-[#aaa]">·</span>
                                  <span className="text-[#aaa]">{T.attendanceLabel} {attendanceRate(student.sessions)}</span>
                                  {last && (
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${DISC_CLS[last.discipline]}`}>
                                      {T.disciplines[last.discipline]}
                                    </span>
                                  )}
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (isEditing) {
                                      setEditingStudentId(null);
                                    } else {
                                      setEditingStudentId(student.id);
                                      setExpandedId(student.id);
                                      setShowNewSession(null);
                                      setEditForm({ name: student.name, age: String(student.age), level: student.level, photo: student.photo || "" });
                                    }
                                  }}
                                  className={`p-1.5 rounded-lg transition-colors ${isEditing ? "bg-[#2d6a4f]/10 text-[#2d6a4f]" : "text-[#bbb] hover:text-[#2d6a4f] hover:bg-[#2d6a4f]/10"}`}
                                  title={T.editLabel}
                                >
                                  <Pencil size={13} />
                                </button>
                                <button
                                  onClick={(e) => { e.stopPropagation(); setDeletingStudentId(student.id); }}
                                  className="p-1.5 rounded-lg text-[#bbb] hover:text-red-500 hover:bg-red-50 transition-colors"
                                  title={T.deleteLabel}
                                >
                                  <Trash2 size={13} />
                                </button>
                                {isExpanded ? <ChevronUp size={16} className="text-[#bbb]" /> : <ChevronDown size={16} className="text-[#bbb]" />}
                              </div>
                            </div>

                            {isExpanded && (
                              <div className="border-t border-[#f0ead8] p-4 sm:p-5 space-y-5">
                                {isEditing ? (
                                  <div>
                                    <h4 className="text-sm font-semibold text-[#1a1a1a] mb-4">{T.editTitle}</h4>
                                    <div className="grid sm:grid-cols-2 gap-4">
                                      <div>
                                        <label className={LABEL}>{T.fieldName}</label>
                                        <input className={INPUT} value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                                      </div>
                                      <div>
                                        <label className={LABEL}>{T.fieldAge}</label>
                                        <input type="number" className={INPUT} min="3" max="99" value={editForm.age} onChange={(e) => setEditForm({ ...editForm, age: e.target.value })} />
                                      </div>
                                      <div>
                                        <label className={LABEL}>{T.fieldLevel}</label>
                                        <select className={INPUT} value={editForm.level} onChange={(e) => setEditForm({ ...editForm, level: e.target.value as Level })}>
                                          {LEVELS.map((l) => <option key={l} value={l}>{T.levels[l]}</option>)}
                                        </select>
                                      </div>
                                      <div>
                                        <label className={LABEL}>{T.photoUpload}</label>
                                        {editForm.photo && (
                                          <img src={editForm.photo} className="w-14 h-14 rounded-full object-cover mb-2" alt="" />
                                        )}
                                        <input
                                          type="file"
                                          accept="image/*"
                                          className="text-xs text-[#666] file:me-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-[#2d6a4f]/10 file:text-[#2d6a4f] file:font-semibold cursor-pointer"
                                          onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (file) setEditForm({ ...editForm, photo: await resizeToBase64(file) });
                                          }}
                                        />
                                      </div>
                                    </div>
                                    <div className="flex gap-3 mt-5">
                                      <button onClick={handleEditStudent} className="px-5 py-2.5 rounded-xl bg-[#2d6a4f] text-white text-sm font-semibold hover:bg-[#235a40] transition-colors">{T.save}</button>
                                      <button onClick={() => setEditingStudentId(null)} className="px-5 py-2.5 rounded-xl border border-[#e8dfc8] text-[#666] text-sm hover:bg-[#f5f0e8] transition-colors">{T.cancel}</button>
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    <div>
                                      <h4 className="text-sm font-semibold text-[#1a1a1a] mb-3">{T.sessionHistory}</h4>
                                      {sorted.length === 0 ? (
                                        <p className="text-xs text-[#ccc]">{T.noSessions}</p>
                                      ) : (
                                        <div className="overflow-x-auto rounded-xl border border-[#f0ead8]">
                                          <table className="w-full text-xs">
                                            <thead className="bg-[#faf8f4]">
                                              <tr className="text-[#aaa] uppercase tracking-wider">
                                                {[T.colDate, T.colAttendance, T.colDiscipline].map((h) => (
                                                  <th key={h} className="text-start px-4 py-2.5 font-medium">{h}</th>
                                                ))}
                                                <th className="text-start px-4 py-2.5 font-medium hidden sm:table-cell">{T.colMemo}</th>
                                                <th className="text-start px-4 py-2.5 font-medium hidden lg:table-cell">{T.colComment}</th>
                                              </tr>
                                            </thead>
                                            <tbody className="divide-y divide-[#f5f0e8]">
                                              {sorted.map((s) => (
                                                <tr key={s.id} className="hover:bg-[#faf8f4]">
                                                  <td className="px-4 py-3 text-[#555]">{s.date}</td>
                                                  <td className="px-4 py-3">
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${s.present ? "text-emerald-700 bg-emerald-50 border-emerald-200" : "text-red-700 bg-red-50 border-red-200"}`}>
                                                      {s.present ? T.present : T.absent}
                                                    </span>
                                                  </td>
                                                  <td className="px-4 py-3">
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${DISC_CLS[s.discipline]}`}>
                                                      {T.disciplines[s.discipline]}
                                                    </span>
                                                  </td>
                                                  <td className="px-4 py-3 text-[#666] hidden sm:table-cell">{s.memorization || "—"}</td>
                                                  <td className="px-4 py-3 text-[#666] hidden lg:table-cell max-w-xs truncate">{s.comment || "—"}</td>
                                                </tr>
                                              ))}
                                            </tbody>
                                          </table>
                                        </div>
                                      )}
                                    </div>

                                    {showNewSession === student.id ? (
                                      <div className="bg-[#faf8f4] rounded-xl border border-[#e8dfc8] p-4">
                                        <h4 className="text-sm font-semibold text-[#1a1a1a] mb-4">{T.newSession}</h4>
                                        <div className="grid sm:grid-cols-2 gap-3">
                                          <div>
                                            <label className={LABEL}>{T.fieldDate}</label>
                                            <input type="date" className={INPUT} value={sessionForm.date} onChange={(e) => setSessionForm({ ...sessionForm, date: e.target.value })} />
                                          </div>
                                          <div>
                                            <label className={LABEL}>{T.fieldPresence}</label>
                                            <div className="flex gap-2 mt-1">
                                              <button type="button" onClick={() => setSessionForm({ ...sessionForm, present: true })} className={`flex-1 py-2.5 rounded-lg text-xs font-semibold transition-colors border ${sessionForm.present ? "bg-emerald-600 text-white border-emerald-600" : "bg-white border-[#e8dfc8] text-[#666] hover:bg-[#f5f0e8]"}`}>
                                                {T.present}
                                              </button>
                                              <button type="button" onClick={() => setSessionForm({ ...sessionForm, present: false })} className={`flex-1 py-2.5 rounded-lg text-xs font-semibold transition-colors border ${!sessionForm.present ? "bg-red-500 text-white border-red-500" : "bg-white border-[#e8dfc8] text-[#666] hover:bg-[#f5f0e8]"}`}>
                                                {T.absent}
                                              </button>
                                            </div>
                                          </div>
                                          <div>
                                            <label className={LABEL}>{T.fieldDiscipline}</label>
                                            <select className={INPUT} value={sessionForm.discipline} onChange={(e) => setSessionForm({ ...sessionForm, discipline: e.target.value as Discipline })}>
                                              {(["excellent", "bon", "passable", "insuffisant"] as Discipline[]).map((d) => (
                                                <option key={d} value={d}>{T.disciplines[d]}</option>
                                              ))}
                                            </select>
                                          </div>
                                          <div>
                                            <label className={LABEL}>{T.fieldMemo}</label>
                                            <input className={INPUT} placeholder={T.memoPh} value={sessionForm.memorization} onChange={(e) => setSessionForm({ ...sessionForm, memorization: e.target.value })} />
                                          </div>
                                          <div className="sm:col-span-2">
                                            <label className={LABEL}>{T.fieldComment}</label>
                                            <textarea rows={3} className={`${INPUT} resize-none`} placeholder={T.commentPh} value={sessionForm.comment} onChange={(e) => setSessionForm({ ...sessionForm, comment: e.target.value })} />
                                          </div>
                                        </div>
                                        <div className="flex gap-2 mt-4">
                                          <button onClick={() => handleAddSession(student.id)} className="px-4 py-2 rounded-lg bg-[#2d6a4f] text-white text-xs font-semibold hover:bg-[#235a40] transition-colors">{T.saveSession}</button>
                                          <button onClick={() => setShowNewSession(null)} className="px-4 py-2 rounded-lg border border-[#e8dfc8] text-[#666] text-xs hover:bg-white transition-colors">{T.cancel}</button>
                                        </div>
                                      </div>
                                    ) : (
                                      <button onClick={() => { setShowNewSession(student.id); setSessionForm(emptySession()); }} className="flex items-center gap-1.5 text-sm font-semibold text-[#2d6a4f] hover:underline">
                                        <Plus size={14} />
                                        {T.addSession}
                                      </button>
                                    )}
                                  </>
                                )}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>

                {pageCount > 1 && (
                  <div className="flex items-center justify-between mt-2 px-1">
                    <button
                      onClick={() => setPage((p) => Math.max(0, p - 1))}
                      disabled={page === 0}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#e8dfc8] text-sm text-[#666] hover:bg-[#f5f0e8] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft size={14} />
                      {T.prevPage}
                    </button>
                    <span className="text-sm text-[#888]">{page + 1} / {pageCount}</span>
                    <button
                      onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
                      disabled={page === pageCount - 1}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#e8dfc8] text-sm text-[#666] hover:bg-[#f5f0e8] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      {T.nextPage}
                      <ChevronRight size={14} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ── PROFESSORS TAB ── */}
        {tab === "professors" && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button onClick={() => { setShowAddProf(!showAddProf); setProfErr(""); }} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2d6a4f] text-white text-sm font-semibold hover:bg-[#235a40] transition-colors shadow-sm">
                <Plus size={15} />
                {T.addProf}
              </button>
            </div>

            {showAddProf && (
              <div className="bg-white rounded-2xl border border-[#e8dfc8] p-6 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-bold text-[#1a1a1a]">{T.newProf}</h3>
                  <button onClick={() => setShowAddProf(false)} className="text-[#bbb] hover:text-[#555]"><X size={18} /></button>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className={LABEL}>{T.fieldName}</label>
                    <input className={INPUT} placeholder="Sheikh Omar" value={profForm.name} onChange={(e) => setProfForm({ ...profForm, name: e.target.value })} />
                  </div>
                  <div>
                    <label className={LABEL}>{T.fieldEmail}</label>
                    <input type="email" className={INPUT} dir="ltr" placeholder="omar@nur.com" value={profForm.email} onChange={(e) => setProfForm({ ...profForm, email: e.target.value })} />
                  </div>
                  <div>
                    <label className={LABEL}>{T.fieldPassword}</label>
                    <input type="password" className={INPUT} placeholder="••••••••" value={profForm.password} onChange={(e) => setProfForm({ ...profForm, password: e.target.value })} />
                  </div>
                  <div>
                    <label className={LABEL}>{T.fieldSpecialty}</label>
                    <input className={INPUT} placeholder={T.specialtyPh} value={profForm.specialty} onChange={(e) => setProfForm({ ...profForm, specialty: e.target.value })} />
                  </div>
                </div>
                {profErr && <p className="text-red-500 text-sm mt-3">{profErr}</p>}
                <div className="flex gap-3 mt-5">
                  <button onClick={handleAddProf} className="px-5 py-2.5 rounded-xl bg-[#2d6a4f] text-white text-sm font-semibold hover:bg-[#235a40] transition-colors">{T.save}</button>
                  <button onClick={() => setShowAddProf(false)} className="px-5 py-2.5 rounded-xl border border-[#e8dfc8] text-[#666] text-sm hover:bg-[#f5f0e8] transition-colors">{T.cancel}</button>
                </div>
              </div>
            )}

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {professors.map((prof) => (
                <div key={prof.id} className="bg-white rounded-2xl border border-[#e8dfc8] p-5 shadow-sm">
                  {deletingProfId === prof.id ? (
                    <div>
                      <p className="text-sm font-medium text-red-700 mb-3">{T.confirmDelete}</p>
                      <div className="flex gap-2">
                        <button onClick={() => handleDeleteProf(prof.id)} className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-semibold hover:bg-red-600 transition-colors">{T.confirmYes}</button>
                        <button onClick={() => setDeletingProfId(null)} className="px-3 py-1.5 rounded-lg border border-[#e8dfc8] text-[#666] text-xs hover:bg-[#f5f0e8] transition-colors">{T.cancel}</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-full bg-[#2d6a4f]/10 flex items-center justify-center text-[#2d6a4f] font-bold text-sm shrink-0">
                            {initials(prof.name)}
                          </div>
                          <div>
                            <div className="font-semibold text-[#1a1a1a] text-sm">{prof.name}</div>
                            <div className="text-xs text-[#c9a84c] font-medium">{prof.specialty || T.professor}</div>
                          </div>
                        </div>
                        {prof.id !== user.id && (
                          <button
                            onClick={() => setDeletingProfId(prof.id)}
                            className="p-1.5 rounded-lg text-[#bbb] hover:text-red-500 hover:bg-red-50 transition-colors"
                            title={T.deleteLabel}
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                      <div className="text-xs text-[#aaa]">{prof.email}</div>
                      {prof.id === user.id && (
                        <span className="mt-3 inline-block text-xs bg-[#2d6a4f]/10 text-[#2d6a4f] px-2.5 py-0.5 rounded-full font-semibold">
                          {T.yourAccount}
                        </span>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TOP 3 TAB ── */}
        {tab === "top3" && (
          <div className="bg-white rounded-2xl border border-[#e8dfc8] p-6 shadow-sm max-w-lg">
            <div className="flex items-center gap-2 mb-6">
              <Trophy size={20} className="text-[#c9a84c]" />
              <h3 className="font-bold text-[#1a1a1a]">{T.top3Title}</h3>
            </div>
            <div className="space-y-4">
              {(["r1", "r2", "r3"] as const).map((key, i) => (
                <div key={key}>
                  <label className={LABEL}>{[T.rank1, T.rank2, T.rank3][i]}</label>
                  <select
                    className={INPUT}
                    value={topForm[key]}
                    onChange={(e) => setTopForm({ ...topForm, [key]: e.target.value })}
                  >
                    <option value="">{T.top3None}</option>
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
            <button
              onClick={handleSaveTop3}
              className="mt-6 px-5 py-2.5 rounded-xl bg-[#c9a84c] text-white text-sm font-semibold hover:bg-[#b8943e] transition-colors"
            >
              {T.top3Save}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
