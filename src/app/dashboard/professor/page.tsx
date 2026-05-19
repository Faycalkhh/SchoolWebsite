"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BookOpen, LogOut, Plus, ChevronDown, ChevronUp,
  Users, GraduationCap, Search, X, CheckCircle,
  Pencil, Trash2, ChevronLeft, ChevronRight, Trophy, Bell,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import type { Lang } from "@/context/LanguageContext";
import {
  getStudents, addStudent, updateStudent, deleteStudent,
  getProfiles, createUser, deleteProfile, updateProfile,
  addSession,
  getTopStudents, saveTopStudents,
  getAnnouncements, addAnnouncement, deleteAnnouncement,
  resetPassword,
  saveMemoMap,
} from "@/lib/store";
import type { Student, Session, User, Discipline, Level, TopEntry, Announcement } from "@/lib/types";
import { ageFromDOB, type SurahStatus } from "@/lib/quran";
import MemoMap from "@/components/MemoMap";

const t = {
  ar: {
    schoolName: "نور القرآن",
    professor: "أستاذ",
    logout: "تسجيل الخروج",
    tabStudents: "الطلاب",
    tabProfessors: "الأساتذة",
    tabTop3: "أفضل 3",
    tabAnnouncements: "الإعلانات",
    tabParents: "أولياء الأمور",
    parentsNoneYet: "لا يوجد أولياء أمور بعد.",
    childrenCount: (n: number) => `${n} ${n === 1 ? "طفل" : "أطفال"}`,
    resetPasswordTitle: "إعادة تعيين كلمة المرور",
    newPasswordPh: "كلمة المرور الجديدة (٦ أحرف على الأقل)",
    resetPasswordBtn: "إعادة تعيين",
    resetPasswordDone: "تم تحديث كلمة المرور بنجاح.",
    addParent: "إضافة ولي أمر",
    newParent: "ولي أمر جديد",
    toastSession: "تم تسجيل الحصة بنجاح.",
    toastStudent: "تم إضافة الطالب بنجاح.",
    toastProf: "تم إضافة الأستاذ بنجاح.",
    toastDeleted: "تم الحذف بنجاح.",
    toastEdited: "تم تعديل بيانات الطالب بنجاح.",
    toastTop3: "تم حفظ أفضل 3 طلاب للأسبوع.",
    toastAnnouncement: "تم إضافة الإعلان بنجاح.",
    toastMemo: "تم حفظ خريطة الحفظ بنجاح.",
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
    fieldDOB: "تاريخ الميلاد",
    computedAge: (n: number) => `العمر: ${n} سنة`,
    fieldLevel: "المستوى",
    fieldParentName: "اسم ولي الأمر *",
    fieldParentEmail: "البريد الإلكتروني لولي الأمر *",
    parentHint: "إذا لم يكن لولي الأمر حساب، سيتم إنشاؤه تلقائياً (كلمة المرور الافتراضية: parent123).",
    photoUpload: "صورة الطالب",
    save: "حفظ",
    saving: "جارٍ الحفظ...",
    deleting: "جارٍ الحذف...",
    cancel: "إلغاء",
    noStudents: "لم يُعثر على طالب.",
    parentLabel: "ولي الأمر:",
    sessions: (n: number) => `${n} حصة`,
    attendanceLabel: "الحضور:",
    innerTabSessions: "الحصص",
    innerTabMemo: "خريطة الحفظ",
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
    absenceReasonPh: "سبب الغياب أو ملاحظات...",
    saveSession: "تسجيل الحصة",
    addSession: "إضافة حصة",
    memoSave: "حفظ التقدم",
    addProf: "إضافة أستاذ",
    newProf: "أستاذ جديد",
    fieldEmail: "البريد الإلكتروني *",
    fieldPassword: "كلمة المرور *",
    fieldSpecialty: "التخصص",
    specialtyPh: "التجويد، الحفظ، اللغة العربية...",
    fieldBio: "نبذة",
    bioPh: "حامل إجازة، خبرة...",
    photoProf: "صورة الأستاذ",
    editProf: "تعديل الأستاذ",
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
    annTitle: "لوحة الإعلانات",
    addAnnouncement: "إضافة إعلان",
    newAnnouncement: "إعلان جديد",
    annFieldTitle: "عنوان الإعلان *",
    annFieldBody: "تفاصيل الإعلان",
    annFieldImage: "صورة (اختياري)",
    annBodyPh: "وصف الحدث، التفاصيل...",
    noAnnouncements: "لا توجد إعلانات بعد.",
    tabExams: "الاختبارات",
    createExam: "إنشاء اختبار",
    newExam: "اختبار جديد",
    examFieldTitle: "عنوان الاختبار *",
    addQuestion: "إضافة سؤال",
    questionLabel: (n: number) => `السؤال ${n}`,
    questionPh: "نص السؤال...",
    optionLabel: (l: string) => `الخيار ${l}`,
    optionPh: "نص الخيار...",
    correctAnswer: "الإجابة الصحيحة",
    removeQuestion: "حذف",
    toastExam: "تم إنشاء الاختبار بنجاح.",
    noExams: "لم يتم إنشاء أي اختبار بعد.",
    questionsCount: (n: number) => `${n} سؤال`,
    examResults: "نتائج الاختبار",
    noResults: "لم يؤدِّ أحد هذا الاختبار بعد.",
    resultStudent: "الطالب",
    resultScore: "النتيجة",
    resultDate: "التاريخ",
    errNoQuestions: "يرجى إضافة سؤال واحد على الأقل.",
    errQuestionEmpty: "يرجى ملء نص جميع الأسئلة.",
    errOptionEmpty: "يرجى ملء جميع خيارات الأسئلة.",
    createdBy: "الأستاذ:",
    disciplines: {
      excellent: "ممتاز", bon: "جيد", passable: "مقبول", insuffisant: "ضعيف",
    },
    levels: {
      "Débutant": "مبتدئ", "Intermédiaire": "متوسط", "Avancé": "متقدم", "Hifz": "حفظ",
    },
  },
  fr: {
    schoolName: "Nur Al-Quran",
    professor: "Professeur",
    logout: "Déconnexion",
    tabStudents: "Élèves",
    tabProfessors: "Professeurs",
    tabTop3: "Top 3",
    tabAnnouncements: "Annonces",
    tabParents: "Parents",
    parentsNoneYet: "Aucun parent pour le moment.",
    childrenCount: (n: number) => `${n} ${n === 1 ? "enfant" : "enfants"}`,
    resetPasswordTitle: "Réinitialiser le mot de passe",
    newPasswordPh: "Nouveau mot de passe (6 caractères min)",
    resetPasswordBtn: "Réinitialiser",
    resetPasswordDone: "Mot de passe mis à jour avec succès.",
    addParent: "Ajouter un parent",
    newParent: "Nouveau parent",
    toastSession: "Séance enregistrée avec succès.",
    toastStudent: "Élève ajouté avec succès.",
    toastProf: "Professeur ajouté avec succès.",
    toastDeleted: "Supprimé avec succès.",
    toastEdited: "Informations modifiées avec succès.",
    toastTop3: "Top 3 de la semaine enregistré.",
    toastAnnouncement: "Annonce ajoutée avec succès.",
    toastMemo: "Carte de mémorisation enregistrée.",
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
    fieldDOB: "Date de naissance",
    computedAge: (n: number) => `Âge: ${n} ans`,
    fieldLevel: "Niveau",
    fieldParentName: "Nom du parent *",
    fieldParentEmail: "Email du parent *",
    parentHint: "Si ce parent n'a pas encore de compte, un compte sera créé automatiquement (mot de passe par défaut : parent123).",
    photoUpload: "Photo de l'élève",
    save: "Enregistrer",
    saving: "Enregistrement...",
    deleting: "Suppression...",
    cancel: "Annuler",
    noStudents: "Aucun élève trouvé.",
    parentLabel: "Parent :",
    sessions: (n: number) => `${n} séance${n !== 1 ? "s" : ""}`,
    attendanceLabel: "Présence :",
    innerTabSessions: "Séances",
    innerTabMemo: "Carte de mémorisation",
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
    absenceReasonPh: "Raison de l'absence ou remarques...",
    saveSession: "Enregistrer la séance",
    addSession: "Ajouter une séance",
    memoSave: "Enregistrer la progression",
    addProf: "Ajouter un professeur",
    newProf: "Nouveau professeur",
    fieldEmail: "Email *",
    fieldPassword: "Mot de passe *",
    fieldSpecialty: "Spécialité",
    specialtyPh: "Tajweed, Hifz, Langue Arabe...",
    fieldBio: "Biographie",
    bioPh: "Titulaire d'une Ijazah, expérience...",
    photoProf: "Photo du professeur",
    editProf: "Modifier le professeur",
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
    annTitle: "Tableau des annonces",
    addAnnouncement: "Ajouter une annonce",
    newAnnouncement: "Nouvelle annonce",
    annFieldTitle: "Titre de l'annonce *",
    annFieldBody: "Détails de l'annonce",
    annFieldImage: "Image (facultatif)",
    annBodyPh: "Description de l'événement, détails...",
    noAnnouncements: "Aucune annonce pour le moment.",
    tabExams: "Examens",
    createExam: "Créer un examen",
    newExam: "Nouvel examen",
    examFieldTitle: "Titre de l'examen *",
    addQuestion: "Ajouter une question",
    questionLabel: (n: number) => `Question ${n}`,
    questionPh: "Texte de la question...",
    optionLabel: (l: string) => `Option ${l}`,
    optionPh: "Texte de l'option...",
    correctAnswer: "Bonne réponse",
    removeQuestion: "Supprimer",
    toastExam: "Examen créé avec succès.",
    noExams: "Aucun examen créé pour le moment.",
    questionsCount: (n: number) => `${n} question${n !== 1 ? "s" : ""}`,
    examResults: "Résultats de l'examen",
    noResults: "Aucun élève n'a passé cet examen.",
    resultStudent: "Élève",
    resultScore: "Score",
    resultDate: "Date",
    errNoQuestions: "Veuillez ajouter au moins une question.",
    errQuestionEmpty: "Veuillez remplir le texte de toutes les questions.",
    errOptionEmpty: "Veuillez remplir tous les choix de réponse.",
    createdBy: "Professeur :",
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

const LEVELS: Level[] = ["Débutant", "Intermédiaire", "Avancé", "Hifz"];
const PAGE_SIZE = 8;

const INPUT = "w-full px-3.5 py-2.5 rounded-xl border border-[#e8dfc8] bg-white text-sm placeholder-[#bbb] focus:outline-none focus:border-[#2d6a4f] focus:ring-2 focus:ring-[#2d6a4f]/10 transition-all";
const LABEL = "block text-xs font-semibold text-[#555] uppercase tracking-wider mb-1.5";

async function resizeToBase64(file: File): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 200; canvas.height = 200;
      const ctx = canvas.getContext("2d")!;
      const size = Math.min(img.width, img.height);
      ctx.drawImage(img, (img.width - size) / 2, (img.height - size) / 2, size, size, 0, 0, 200, 200);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.7));
    };
    img.src = url;
  });
}

async function resizeProfPhoto(file: File): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 600; canvas.height = 600;
      const ctx = canvas.getContext("2d")!;
      const size = Math.min(img.width, img.height);
      ctx.drawImage(img, (img.width - size) / 2, (img.height - size) / 2, size, size, 0, 0, 600, 600);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.9));
    };
    img.src = url;
  });
}

async function resizeAnnImage(file: File): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const maxW = 800;
      const ratio = Math.min(maxW / img.width, 1);
      canvas.width = Math.round(img.width * ratio);
      canvas.height = Math.round(img.height * ratio);
      canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.8));
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

const emptySession = () => ({ date: new Date().toISOString().split("T")[0], present: true, discipline: "bon" as Discipline, memorization: "", comment: "" });
const emptyStudent = () => ({ name: "", dateOfBirth: "", level: "Débutant" as Level, parentEmail: "", parentName: "", photo: "" });

// Generates a simple 8-char password with no ambiguous chars (no 0/O/1/l/I)
function generatePassword(): string {
  const chars = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let pwd = "";
  for (let i = 0; i < 8; i++) pwd += chars[Math.floor(Math.random() * chars.length)];
  return pwd;
}
const emptyProf = () => ({ name: "", email: "", password: "", specialty: "", bio: "", photo: "" });
const emptyAnn = () => ({ title: "", body: "", image: "" });

export default function ProfessorDashboard() {
  const { user, loading: authLoading, logout } = useAuth();
  const { lang, dir, setLang } = useLanguage();
  const T = t[lang];
  const router = useRouter();

  const [students, setStudents] = useState<Student[]>([]);
  const [profiles, setProfiles] = useState<User[]>([]);
  const [topStudents, setTopStudents] = useState<TopEntry[]>([]);
  const [topForm, setTopForm] = useState<{ r1: string; r2: string; r3: string }>({ r1: "", r2: "", r3: "" });
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const [tab, setTab] = useState<"students" | "professors" | "parents" | "top3" | "announcements">("students");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [innerTab, setInnerTab] = useState<"sessions" | "memo">("sessions");
  const [memoEdit, setMemoEdit] = useState<Record<number, SurahStatus>>({});
  const [showNewSession, setShowNewSession] = useState<string | null>(null);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showAddProf, setShowAddProf] = useState(false);
  const [showAddAnn, setShowAddAnn] = useState(false);
  const [sessionForm, setSessionForm] = useState(emptySession());
  const [studentForm, setStudentForm] = useState(emptyStudent());
  const [profForm, setProfForm] = useState(emptyProf());
  const [annForm, setAnnForm] = useState(emptyAnn());
  const [studentErr, setStudentErr] = useState("");
  const [profErr, setProfErr] = useState("");
  const [annErr, setAnnErr] = useState("");
  const [toast, setToast] = useState("");

  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ name: string; dateOfBirth: string; level: Level; photo: string }>({ name: "", dateOfBirth: "", level: "Débutant", photo: "" });
  const [deletingStudentId, setDeletingStudentId] = useState<string | null>(null);
  const [deletingProfId, setDeletingProfId] = useState<string | null>(null);
  const [editingProfId, setEditingProfId] = useState<string | null>(null);
  const [editProfForm, setEditProfForm] = useState<{ name: string; specialty: string; bio: string; photo: string }>({ name: "", specialty: "", bio: "", photo: "" });

  const [editingParentId, setEditingParentId] = useState<string | null>(null);
  const [editParentForm, setEditParentForm] = useState<{ name: string }>({ name: "" });
  const [deletingParentId, setDeletingParentId] = useState<string | null>(null);
  const [resetPwdParentId, setResetPwdParentId] = useState<string | null>(null);
  const [resetPwdInput, setResetPwdInput] = useState("");
  const [resetPwdErr, setResetPwdErr] = useState("");
  const [showAddParent, setShowAddParent] = useState(false);
  const [parentForm, setParentForm] = useState({ name: "", email: "", password: "" });
  const [parentErr, setParentErr] = useState("");
  const [deletingAnnId, setDeletingAnnId] = useState<string | null>(null);


  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push("/login"); return; }
    if (user.role !== "professor") { router.push("/login"); return; }
    (async () => {
      const [studs, profs, anns, tops] = await Promise.all([
        getStudents(), getProfiles(), getAnnouncements(), getTopStudents(),
      ]);
      setStudents(studs);
      setProfiles(profs);
      setAnnouncements(anns);
      setTopStudents(tops);
      const form = { r1: "", r2: "", r3: "" };
      tops.forEach((e) => {
        if (e.rank === 1) form.r1 = e.studentId;
        else if (e.rank === 2) form.r2 = e.studentId;
        else if (e.rank === 3) form.r3 = e.studentId;
      });
      setTopForm(form);
    })();
  }, [user, authLoading, router]);

  useEffect(() => { setPage(0); }, [search]);

  async function refresh() {
    const [studs, profs] = await Promise.all([getStudents(), getProfiles()]);
    setStudents(studs); setProfiles(profs);
  }
  function flash(msg: string) { setToast(msg); setTimeout(() => setToast(""), 3500); }

  function expandStudent(id: string) {
    const opening = expandedId !== id;
    setExpandedId(opening ? id : null);
    setInnerTab("sessions");
    setShowNewSession(null);
    if (editingStudentId) setEditingStudentId(null);
  }

  async function handleAddSession(studentId: string) {
    setSubmitting(true);
    const newSession = await addSession(studentId, user!.id, sessionForm);
    setStudents((prev) => prev.map((s) =>
      s.id !== studentId ? s : { ...s, sessions: [newSession, ...s.sessions] }
    ));
    setShowNewSession(null); setSessionForm(emptySession());
    // Fire-and-forget email to parent
    fetch("/api/notify-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentId,
        professorId:  user!.id,
        date:         sessionForm.date,
        present:      sessionForm.present,
        discipline:   sessionForm.discipline,
        memorization: sessionForm.memorization,
        comment:      sessionForm.comment,
      }),
    }).catch(() => {});
    flash(T.toastSession);
    setSubmitting(false);
  }

  async function handleAddStudent() {
    setStudentErr("");
    const { name, parentEmail, parentName } = studentForm;
    if (!name.trim() || !parentEmail.trim() || !parentName.trim()) { setStudentErr(T.errRequired); return; }
    setSubmitting(true);
    try {
      let parent = profiles.find((u) => u.email === parentEmail && u.role === "parent");
      if (!parent) {
        parent = await createUser(parentEmail, generatePassword(), parentName, "parent");
        setProfiles((prev) => [...prev, parent!]);
      }
      const computedAge = ageFromDOB(studentForm.dateOfBirth) ?? 0;
      const newStudent = await addStudent(name, computedAge, studentForm.level, parent.id, studentForm.photo || undefined, studentForm.dateOfBirth || undefined);
      setStudents((prev) => [...prev, newStudent]);
      setStudentForm(emptyStudent()); setShowAddStudent(false);
      flash(T.toastStudent);
    } catch {
      setStudentErr(T.errEmail);
    }
    setSubmitting(false);
  }

  async function handleEditStudent() {
    if (!editingStudentId) return;
    setSubmitting(true);
    const computedAge = ageFromDOB(editForm.dateOfBirth) ?? 0;
    await updateStudent(editingStudentId, { name: editForm.name, age: computedAge, level: editForm.level, photo: editForm.photo || null, dateOfBirth: editForm.dateOfBirth || null });
    setStudents((prev) => prev.map((s) =>
      s.id !== editingStudentId ? s : { ...s, name: editForm.name, age: computedAge, dateOfBirth: editForm.dateOfBirth || undefined, level: editForm.level, photo: editForm.photo || undefined }
    ));
    setEditingStudentId(null);
    flash(T.toastEdited);
    setSubmitting(false);
  }

  async function handleDeleteStudent(id: string) {
    setSubmitting(true);
    await deleteStudent(id);
    setStudents((prev) => prev.filter((s) => s.id !== id));
    setDeletingStudentId(null);
    if (expandedId === id) setExpandedId(null);
    if (editingStudentId === id) setEditingStudentId(null);
    flash(T.toastDeleted);
    setSubmitting(false);
  }

  async function handleSaveMemo(studentId: string) {
    setSubmitting(true);
    await saveMemoMap(studentId, memoEdit);
    setStudents((prev) => prev.map((s) => s.id !== studentId ? s : { ...s, memorization: memoEdit }));
    flash(T.toastMemo);
    setSubmitting(false);
  }

  async function handleAddProf() {
    setProfErr("");
    const { name, email, password } = profForm;
    if (!name.trim() || !email.trim() || !password.trim()) { setProfErr(T.errRequired); return; }
    if (profiles.find((u) => u.email === email)) { setProfErr(T.errEmail); return; }
    setSubmitting(true);
    try {
      const newProf = await createUser(email, password, name, "professor", profForm.specialty || undefined, profForm.bio || undefined, profForm.photo || undefined);
      setProfiles((prev) => [...prev, newProf]);
      setProfForm(emptyProf()); setShowAddProf(false);
      flash(T.toastProf);
    } catch {
      setProfErr(T.errEmail);
    }
    setSubmitting(false);
  }

  function startEditProf(p: User) {
    setEditingProfId(p.id);
    setEditProfForm({ name: p.name, specialty: p.specialty ?? "", bio: p.bio ?? "", photo: p.photo ?? "" });
  }

  async function handleSaveEditProf() {
    if (!editingProfId) return;
    setSubmitting(true);
    await updateProfile(editingProfId, {
      name:      editProfForm.name,
      specialty: editProfForm.specialty || null,
      bio:       editProfForm.bio || null,
      photo:     editProfForm.photo || null,
    });
    setProfiles((prev) => prev.map((p) =>
      p.id !== editingProfId ? p : { ...p, name: editProfForm.name, specialty: editProfForm.specialty || undefined, bio: editProfForm.bio || undefined, photo: editProfForm.photo || undefined }
    ));
    setEditingProfId(null);
    flash(T.toastEdited);
    setSubmitting(false);
  }

  async function handleDeleteProf(id: string) {
    setSubmitting(true);
    await deleteProfile(id);
    setProfiles((prev) => prev.filter((u) => u.id !== id));
    setDeletingProfId(null);
    flash(T.toastDeleted);
    setSubmitting(false);
  }

  async function handleAddAnnouncement() {
    setAnnErr("");
    if (!annForm.title.trim()) { setAnnErr(T.errRequired); return; }
    setSubmitting(true);
    const newAnn = await addAnnouncement({ title: annForm.title, body: annForm.body, image: annForm.image || undefined, date: new Date().toISOString().split("T")[0] });
    setAnnouncements((prev) => [newAnn, ...prev]);
    setAnnForm(emptyAnn()); setShowAddAnn(false);
    flash(T.toastAnnouncement);
    setSubmitting(false);
  }

  async function handleDeleteAnnouncement(id: string) {
    setSubmitting(true);
    await deleteAnnouncement(id);
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    setDeletingAnnId(null);
    flash(T.toastDeleted);
    setSubmitting(false);
  }

  async function handleAddParent() {
    setParentErr("");
    const { name, email, password } = parentForm;
    if (!name.trim() || !email.trim() || !password.trim()) { setParentErr(T.errRequired); return; }
    if (profiles.find((u) => u.email === email)) { setParentErr(T.errEmail); return; }
    setSubmitting(true);
    try {
      const newParent = await createUser(email, password, name, "parent");
      setProfiles((prev) => [...prev, newParent]);
      setParentForm({ name: "", email: "", password: "" });
      setShowAddParent(false);
      flash(T.toastProf);
    } catch {
      setParentErr(T.errEmail);
    }
    setSubmitting(false);
  }

  function startEditParent(p: User) {
    setEditingParentId(p.id);
    setEditParentForm({ name: p.name });
  }

  async function handleSaveEditParent() {
    if (!editingParentId) return;
    setSubmitting(true);
    await updateProfile(editingParentId, { name: editParentForm.name });
    setProfiles((prev) => prev.map((p) => p.id !== editingParentId ? p : { ...p, name: editParentForm.name }));
    setEditingParentId(null);
    flash(T.toastEdited);
    setSubmitting(false);
  }

  async function handleDeleteParent(id: string) {
    setSubmitting(true);
    await deleteProfile(id);
    setProfiles((prev) => prev.filter((u) => u.id !== id));
    setStudents((prev) => prev.filter((s) => s.parentId !== id));
    setDeletingParentId(null);
    flash(T.toastDeleted);
    setSubmitting(false);
  }

  async function handleResetPwd(id: string) {
    setResetPwdErr("");
    if (resetPwdInput.length < 6) { setResetPwdErr(T.errRequired); return; }
    setSubmitting(true);
    try {
      await resetPassword(id, resetPwdInput);
      setResetPwdParentId(null);
      setResetPwdInput("");
      flash(T.resetPasswordDone);
    } catch (e) {
      setResetPwdErr((e as Error).message);
    }
    setSubmitting(false);
  }

  async function handleSaveTop3() {
    const entries: TopEntry[] = [];
    if (topForm.r1) entries.push({ rank: 1, studentId: topForm.r1 });
    if (topForm.r2) entries.push({ rank: 2, studentId: topForm.r2 });
    if (topForm.r3) entries.push({ rank: 3, studentId: topForm.r3 });
    setSubmitting(true);
    await saveTopStudents(entries);
    setTopStudents(entries);
    flash(T.toastTop3);
    setSubmitting(false);
  }

  const professors = profiles.filter((u) => u.role === "professor");
  const parents = profiles.filter((u) => u.role === "parent");
  const isAdmin = user?.email === "prof@nur.com";
  const filtered = students
    .filter((s) => s.name.toLowerCase().includes(search.toLowerCase()))
    .slice()
    .sort((a, b) => {
      // Students who attended most recently appear first.
      // A student's "last attendance" = the most recent session with present=true.
      // Students with no presence go to the bottom.
      const lastAttendA = a.sessions.find((s) => s.present)?.date ?? "";
      const lastAttendB = b.sessions.find((s) => s.present)?.date ?? "";
      if (lastAttendA === lastAttendB) return a.name.localeCompare(b.name);
      if (!lastAttendA) return 1;
      if (!lastAttendB) return -1;
      return lastAttendB.localeCompare(lastAttendA);
    });
  const pageCount = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const getParentName = (parentId: string) => profiles.find((u) => u.id === parentId)?.name ?? "—";

  if (!user) return null;

  const tabConfig = [
    { key: "students" as const,      label: T.tabStudents,      icon: <Users size={14} />,         count: students.length },
    { key: "professors" as const,    label: T.tabProfessors,    icon: <GraduationCap size={14} />, count: professors.length },
    { key: "parents" as const,       label: T.tabParents,       icon: <Users size={14} />,         count: parents.length },
    { key: "top3" as const,          label: T.tabTop3,          icon: <Trophy size={14} />,        count: topStudents.length },
    { key: "announcements" as const, label: T.tabAnnouncements, icon: <Bell size={14} />,          count: announcements.length },
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
            <button onClick={() => setLang(lang === "ar" ? "fr" : "ar" as Lang)} className="px-2.5 py-1.5 rounded-lg border border-[#e8dfc8] text-xs font-semibold text-[#555] hover:bg-[#f5f0e8] transition-colors">
              {lang === "ar" ? "FR" : "عر"}
            </button>
            <div className="hidden sm:block text-end">
              <div className="text-sm font-semibold text-[#1a1a1a]">{user.name}</div>
              <div className="text-xs text-[#c9a84c]">{user.specialty ?? T.professor}</div>
            </div>
            <button onClick={() => { logout(); router.push("/"); }} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-[#888] hover:text-red-600 hover:bg-red-50 transition-colors">
              <LogOut size={15} />
              <span className="hidden sm:inline">{T.logout}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        {toast && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
            role="status"
            aria-live="polite"
          >
            <div className="pointer-events-auto bg-white border border-emerald-200 shadow-2xl rounded-2xl px-8 py-6 flex flex-col items-center gap-3 min-w-[280px] animate-[toastIn_0.25s_ease-out]">
              <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center">
                <CheckCircle size={32} className="text-emerald-600" />
              </div>
              <p className="text-emerald-700 font-semibold text-center">{toast}</p>
            </div>
          </div>
        )}

        <div className="flex gap-1 overflow-x-auto bg-white rounded-xl p-1 border border-[#e8dfc8] mb-6 shadow-sm [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {tabConfig.map(({ key, label, icon, count }) => (
            <button key={key} onClick={() => setTab(key)}
              className={`flex items-center gap-1.5 px-3 py-2 sm:px-4 rounded-lg text-xs sm:text-sm font-medium transition-colors shrink-0 ${tab === key ? "bg-[#2d6a4f] text-white shadow-sm" : "text-[#777] hover:text-[#1a1a1a]"}`}>
              {icon}{label}
              <span className={`hidden sm:inline text-xs px-1.5 py-0.5 rounded-full ${tab === key ? "bg-white/20 text-white" : "bg-[#f0ead8] text-[#888]"}`}>{count}</span>
            </button>
          ))}
        </div>

        {/* ── STUDENTS TAB ── */}
        {tab === "students" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search size={14} className="absolute start-3.5 top-1/2 -translate-y-1/2 text-[#bbb]" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={T.searchPh}
                  className="w-full ps-9 pe-4 py-2.5 rounded-xl border border-[#e8dfc8] bg-white text-sm focus:outline-none focus:border-[#2d6a4f] focus:ring-2 focus:ring-[#2d6a4f]/10 transition-all shadow-sm" />
              </div>
              <button onClick={() => { setShowAddStudent(!showAddStudent); setStudentErr(""); }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2d6a4f] text-white text-sm font-semibold hover:bg-[#235a40] transition-colors whitespace-nowrap shadow-sm">
                <Plus size={15} />{T.addStudent}
              </button>
            </div>

            {showAddStudent && (
              <div className="bg-white rounded-2xl border border-[#e8dfc8] p-6 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-bold text-[#1a1a1a]">{T.newStudent}</h3>
                  <button onClick={() => setShowAddStudent(false)} className="text-[#bbb] hover:text-[#555]"><X size={18} /></button>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><label className={LABEL}>{T.fieldName}</label><input className={INPUT} placeholder="Yusuf Ahmed" value={studentForm.name} onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })} /></div>
                  <div>
                    <label className={LABEL}>{T.fieldDOB}</label>
                    <input type="date" className={INPUT} value={studentForm.dateOfBirth} onChange={(e) => setStudentForm({ ...studentForm, dateOfBirth: e.target.value })} />
                    {ageFromDOB(studentForm.dateOfBirth) !== null && (
                      <p className="text-xs text-[#888] mt-1">{T.computedAge(ageFromDOB(studentForm.dateOfBirth)!)}</p>
                    )}
                  </div>
                  <div>
                    <label className={LABEL}>{T.fieldLevel}</label>
                    <select className={INPUT} value={studentForm.level} onChange={(e) => setStudentForm({ ...studentForm, level: e.target.value as Level })}>
                      {LEVELS.map((l) => <option key={l} value={l}>{T.levels[l]}</option>)}
                    </select>
                  </div>
                  <div><label className={LABEL}>{T.fieldParentName}</label><input className={INPUT} placeholder="Ahmed Martin" value={studentForm.parentName} onChange={(e) => setStudentForm({ ...studentForm, parentName: e.target.value })} /></div>
                  <div>
                    <label className={LABEL}>{T.fieldParentEmail}</label>
                    <input type="email" className={INPUT} dir="ltr" placeholder="parent@email.com" value={studentForm.parentEmail} onChange={(e) => setStudentForm({ ...studentForm, parentEmail: e.target.value })} />
                    <p className="text-[10px] text-[#bbb] mt-1.5">{T.parentHint}</p>
                  </div>
                  <div>
                    <label className={LABEL}>{T.photoUpload}</label>
                    {studentForm.photo && <img src={studentForm.photo} className="w-14 h-14 rounded-full object-cover mb-2" alt="" />}
                    <input type="file" accept="image/*" className="text-xs text-[#666] file:me-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-[#2d6a4f]/10 file:text-[#2d6a4f] file:font-semibold cursor-pointer"
                      onChange={async (e) => { const f = e.target.files?.[0]; if (f) setStudentForm({ ...studentForm, photo: await resizeToBase64(f) }); }} />
                  </div>
                </div>
                {studentErr && <p className="text-red-500 text-sm mt-3">{studentErr}</p>}
                <div className="flex gap-3 mt-5">
                  <button onClick={handleAddStudent} disabled={submitting} className="px-5 py-2.5 rounded-xl bg-[#2d6a4f] text-white text-sm font-semibold hover:bg-[#235a40] disabled:opacity-60 disabled:cursor-wait transition-colors">{submitting ? T.saving : T.save}</button>
                  <button onClick={() => setShowAddStudent(false)} className="px-5 py-2.5 rounded-xl border border-[#e8dfc8] text-[#666] text-sm hover:bg-[#f5f0e8] transition-colors">{T.cancel}</button>
                </div>
              </div>
            )}

            {filtered.length === 0 ? (
              <div className="text-center py-20 text-[#ccc]"><Users size={44} className="mx-auto mb-3 opacity-40" /><p className="text-sm">{T.noStudents}</p></div>
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
                              <button onClick={() => handleDeleteStudent(student.id)} disabled={submitting} className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-semibold hover:bg-red-600 disabled:opacity-60 disabled:cursor-wait transition-colors">{submitting ? T.deleting : T.confirmYes}</button>
                              <button onClick={() => setDeletingStudentId(null)} className="px-3 py-1.5 rounded-lg border border-[#e8dfc8] text-[#666] text-xs hover:bg-white transition-colors">{T.cancel}</button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div onClick={() => expandStudent(student.id)} className="flex items-center justify-between p-4 sm:p-5 hover:bg-[#faf8f4] transition-colors cursor-pointer">
                              <div className="flex items-center gap-3 min-w-0">
                                {student.photo ? <img src={student.photo} className="w-10 h-10 rounded-full object-cover shrink-0" alt="" /> : (
                                  <div className="w-10 h-10 rounded-full bg-[#2d6a4f]/10 flex items-center justify-center text-[#2d6a4f] font-bold text-xs shrink-0">{initials(student.name)}</div>
                                )}
                                <div className="min-w-0">
                                  <div className="font-semibold text-[#1a1a1a] text-sm truncate">{student.name}</div>
                                  <div className="text-xs text-[#aaa] mt-0.5 truncate">
                                    {T.levels[student.level as Level] ?? student.level}
                                    {(() => { const a = ageFromDOB(student.dateOfBirth) ?? student.age; return a > 0 ? ` · ${a} ${T.ageSuffix}` : ""; })()}
                                    {" · "}{T.parentLabel} {getParentName(student.parentId)}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <div className="hidden sm:flex items-center gap-2.5 text-xs me-1">
                                  <span className="text-[#aaa]">{T.sessions(student.sessions.length)}</span>
                                  <span className="text-[#aaa]">·</span>
                                  <span className="text-[#aaa]">{T.attendanceLabel} {attendanceRate(student.sessions)}</span>
                                  {last && <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${DISC_CLS[last.discipline]}`}>{T.disciplines[last.discipline]}</span>}
                                </div>
                                <button onClick={(e) => { e.stopPropagation(); if (isEditing) { setEditingStudentId(null); } else { setEditingStudentId(student.id); setExpandedId(student.id); setInnerTab("sessions"); setShowNewSession(null); setEditForm({ name: student.name, dateOfBirth: student.dateOfBirth || "", level: student.level, photo: student.photo || "" }); } }}
                                  className={`p-1.5 rounded-lg transition-colors ${isEditing ? "bg-[#2d6a4f]/10 text-[#2d6a4f]" : "text-[#bbb] hover:text-[#2d6a4f] hover:bg-[#2d6a4f]/10"}`} title={T.editLabel}>
                                  <Pencil size={13} />
                                </button>
                                <button onClick={(e) => { e.stopPropagation(); setDeletingStudentId(student.id); }} className="p-1.5 rounded-lg text-[#bbb] hover:text-red-500 hover:bg-red-50 transition-colors" title={T.deleteLabel}>
                                  <Trash2 size={13} />
                                </button>
                                {isExpanded ? <ChevronUp size={16} className="text-[#bbb]" /> : <ChevronDown size={16} className="text-[#bbb]" />}
                              </div>
                            </div>

                            {isExpanded && (
                              <div className="border-t border-[#f0ead8] p-4 sm:p-5">
                                {isEditing ? (
                                  <div>
                                    <h4 className="text-sm font-semibold text-[#1a1a1a] mb-4">{T.editTitle}</h4>
                                    <div className="grid sm:grid-cols-2 gap-4">
                                      <div><label className={LABEL}>{T.fieldName}</label><input className={INPUT} value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} /></div>
                                      <div>
                                        <label className={LABEL}>{T.fieldDOB}</label>
                                        <input type="date" className={INPUT} value={editForm.dateOfBirth} onChange={(e) => setEditForm({ ...editForm, dateOfBirth: e.target.value })} />
                                        {ageFromDOB(editForm.dateOfBirth) !== null && (
                                          <p className="text-xs text-[#888] mt-1">{T.computedAge(ageFromDOB(editForm.dateOfBirth)!)}</p>
                                        )}
                                      </div>
                                      <div>
                                        <label className={LABEL}>{T.fieldLevel}</label>
                                        <select className={INPUT} value={editForm.level} onChange={(e) => setEditForm({ ...editForm, level: e.target.value as Level })}>
                                          {LEVELS.map((l) => <option key={l} value={l}>{T.levels[l]}</option>)}
                                        </select>
                                      </div>
                                      <div>
                                        <label className={LABEL}>{T.photoUpload}</label>
                                        {editForm.photo && <img src={editForm.photo} className="w-14 h-14 rounded-full object-cover mb-2" alt="" />}
                                        <input type="file" accept="image/*" className="text-xs text-[#666] file:me-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-[#2d6a4f]/10 file:text-[#2d6a4f] file:font-semibold cursor-pointer"
                                          onChange={async (e) => { const f = e.target.files?.[0]; if (f) setEditForm({ ...editForm, photo: await resizeToBase64(f) }); }} />
                                      </div>
                                    </div>
                                    <div className="flex gap-3 mt-5">
                                      <button onClick={handleEditStudent} disabled={submitting} className="px-5 py-2.5 rounded-xl bg-[#2d6a4f] text-white text-sm font-semibold hover:bg-[#235a40] disabled:opacity-60 disabled:cursor-wait transition-colors">{submitting ? T.saving : T.save}</button>
                                      <button onClick={() => setEditingStudentId(null)} className="px-5 py-2.5 rounded-xl border border-[#e8dfc8] text-[#666] text-sm hover:bg-[#f5f0e8] transition-colors">{T.cancel}</button>
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    <div className="flex gap-2 mb-4">
                                      {(["sessions", "memo"] as const).map((it) => (
                                        <button key={it} onClick={() => { setInnerTab(it); if (it === "memo") setMemoEdit(student.memorization ?? {}); }}
                                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${innerTab === it ? "bg-[#2d6a4f] text-white" : "bg-[#f5f0e8] text-[#666] hover:bg-[#e8dfc8]"}`}>
                                          {it === "sessions" ? T.innerTabSessions : T.innerTabMemo}
                                        </button>
                                      ))}
                                    </div>

                                    {innerTab === "sessions" ? (
                                      <div className="space-y-4">
                                        <h4 className="text-sm font-semibold text-[#1a1a1a]">{T.sessionHistory}</h4>
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
                                                    <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${DISC_CLS[s.discipline]}`}>{T.disciplines[s.discipline]}</span></td>
                                                    <td className="px-4 py-3 text-[#666] hidden sm:table-cell">{s.memorization || "—"}</td>
                                                    <td className="px-4 py-3 text-[#666] hidden lg:table-cell max-w-xs truncate">{s.comment || "—"}</td>
                                                  </tr>
                                                ))}
                                              </tbody>
                                            </table>
                                          </div>
                                        )}
                                        {showNewSession === student.id ? (
                                          <div className="bg-[#faf8f4] rounded-xl border border-[#e8dfc8] p-4">
                                            <h4 className="text-sm font-semibold text-[#1a1a1a] mb-4">{T.newSession}</h4>
                                            <div className="grid sm:grid-cols-2 gap-3">
                                              <div><label className={LABEL}>{T.fieldDate}</label><input type="date" className={INPUT} value={sessionForm.date} onChange={(e) => setSessionForm({ ...sessionForm, date: e.target.value })} /></div>
                                              <div>
                                                <label className={LABEL}>{T.fieldPresence}</label>
                                                <div className="flex gap-2 mt-1">
                                                  <button type="button" onClick={() => setSessionForm({ ...sessionForm, present: true })} className={`flex-1 py-2.5 rounded-lg text-xs font-semibold transition-colors border ${sessionForm.present ? "bg-emerald-600 text-white border-emerald-600" : "bg-white border-[#e8dfc8] text-[#666] hover:bg-[#f5f0e8]"}`}>{T.present}</button>
                                                  <button type="button" onClick={() => setSessionForm({ ...sessionForm, present: false })} className={`flex-1 py-2.5 rounded-lg text-xs font-semibold transition-colors border ${!sessionForm.present ? "bg-red-500 text-white border-red-500" : "bg-white border-[#e8dfc8] text-[#666] hover:bg-[#f5f0e8]"}`}>{T.absent}</button>
                                                </div>
                                              </div>
                                              {sessionForm.present && (
                                                <>
                                                  <div>
                                                    <label className={LABEL}>{T.fieldDiscipline}</label>
                                                    <select className={INPUT} value={sessionForm.discipline} onChange={(e) => setSessionForm({ ...sessionForm, discipline: e.target.value as Discipline })}>
                                                      {(["excellent", "bon", "passable", "insuffisant"] as Discipline[]).map((d) => <option key={d} value={d}>{T.disciplines[d]}</option>)}
                                                    </select>
                                                  </div>
                                                  <div><label className={LABEL}>{T.fieldMemo}</label><input className={INPUT} placeholder={T.memoPh} value={sessionForm.memorization} onChange={(e) => setSessionForm({ ...sessionForm, memorization: e.target.value })} /></div>
                                                </>
                                              )}
                                              <div className="sm:col-span-2"><label className={LABEL}>{T.fieldComment}</label><textarea rows={3} className={`${INPUT} resize-none`} placeholder={sessionForm.present ? T.commentPh : T.absenceReasonPh} value={sessionForm.comment} onChange={(e) => setSessionForm({ ...sessionForm, comment: e.target.value })} /></div>
                                            </div>
                                            <div className="flex gap-2 mt-4">
                                              <button onClick={() => handleAddSession(student.id)} disabled={submitting} className="px-4 py-2 rounded-lg bg-[#2d6a4f] text-white text-xs font-semibold hover:bg-[#235a40] disabled:opacity-60 disabled:cursor-wait transition-colors">{submitting ? T.saving : T.saveSession}</button>
                                              <button onClick={() => setShowNewSession(null)} className="px-4 py-2 rounded-lg border border-[#e8dfc8] text-[#666] text-xs hover:bg-white transition-colors">{T.cancel}</button>
                                            </div>
                                          </div>
                                        ) : (
                                          <button onClick={() => { setShowNewSession(student.id); setSessionForm(emptySession()); }} className="flex items-center gap-1.5 text-sm font-semibold text-[#2d6a4f] hover:underline">
                                            <Plus size={14} />{T.addSession}
                                          </button>
                                        )}
                                      </div>
                                    ) : (
                                      <div className="space-y-4">
                                        <MemoMap value={memoEdit} editable lang={lang} onChange={(updated) => setMemoEdit(updated)} />
                                        <button onClick={() => handleSaveMemo(student.id)} disabled={submitting} className="px-5 py-2.5 rounded-xl bg-[#2d6a4f] text-white text-sm font-semibold hover:bg-[#235a40] disabled:opacity-60 disabled:cursor-wait transition-colors">
                                          {submitting ? T.saving : T.memoSave}
                                        </button>
                                      </div>
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
                    <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#e8dfc8] text-sm text-[#666] hover:bg-[#f5f0e8] disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                      <ChevronLeft size={14} />{T.prevPage}
                    </button>
                    <span className="text-sm text-[#888]">{page + 1} / {pageCount}</span>
                    <button onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))} disabled={page === pageCount - 1} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#e8dfc8] text-sm text-[#666] hover:bg-[#f5f0e8] disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                      {T.nextPage}<ChevronRight size={14} />
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
            {isAdmin && (
              <div className="flex justify-end">
                <button onClick={() => { setShowAddProf(!showAddProf); setProfErr(""); }} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2d6a4f] text-white text-sm font-semibold hover:bg-[#235a40] transition-colors shadow-sm">
                  <Plus size={15} />{T.addProf}
                </button>
              </div>
            )}
            {isAdmin && showAddProf && (
              <div className="bg-white rounded-2xl border border-[#e8dfc8] p-6 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-bold text-[#1a1a1a]">{T.newProf}</h3>
                  <button onClick={() => setShowAddProf(false)} className="text-[#bbb] hover:text-[#555]"><X size={18} /></button>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><label className={LABEL}>{T.fieldName}</label><input className={INPUT} placeholder="Sheikh Omar" value={profForm.name} onChange={(e) => setProfForm({ ...profForm, name: e.target.value })} /></div>
                  <div><label className={LABEL}>{T.fieldEmail}</label><input type="email" className={INPUT} dir="ltr" placeholder="omar@nur.com" value={profForm.email} onChange={(e) => setProfForm({ ...profForm, email: e.target.value })} /></div>
                  <div><label className={LABEL}>{T.fieldPassword}</label><input type="password" className={INPUT} placeholder="••••••••" value={profForm.password} onChange={(e) => setProfForm({ ...profForm, password: e.target.value })} /></div>
                  <div><label className={LABEL}>{T.fieldSpecialty}</label><input className={INPUT} placeholder={T.specialtyPh} value={profForm.specialty} onChange={(e) => setProfForm({ ...profForm, specialty: e.target.value })} /></div>
                  <div className="sm:col-span-2"><label className={LABEL}>{T.fieldBio}</label><textarea rows={3} className={INPUT} placeholder={T.bioPh} value={profForm.bio} onChange={(e) => setProfForm({ ...profForm, bio: e.target.value })} /></div>
                  <div className="sm:col-span-2">
                    <label className={LABEL}>{T.photoProf}</label>
                    {profForm.photo && <img src={profForm.photo} className="w-16 h-16 rounded-full object-cover mb-2" alt="" />}
                    <input type="file" accept="image/*" className="text-xs text-[#666] file:me-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-[#2d6a4f]/10 file:text-[#2d6a4f] file:font-semibold cursor-pointer"
                      onChange={async (e) => { const f = e.target.files?.[0]; if (f) setProfForm({ ...profForm, photo: await resizeProfPhoto(f) }); }} />
                  </div>
                </div>
                {profErr && <p className="text-red-500 text-sm mt-3">{profErr}</p>}
                <div className="flex gap-3 mt-5">
                  <button onClick={handleAddProf} disabled={submitting} className="px-5 py-2.5 rounded-xl bg-[#2d6a4f] text-white text-sm font-semibold hover:bg-[#235a40] disabled:opacity-60 disabled:cursor-wait transition-colors">{submitting ? T.saving : T.save}</button>
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
                        <button onClick={() => handleDeleteProf(prof.id)} disabled={submitting} className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-semibold hover:bg-red-600 disabled:opacity-60 disabled:cursor-wait transition-colors">{submitting ? T.deleting : T.confirmYes}</button>
                        <button onClick={() => setDeletingProfId(null)} className="px-3 py-1.5 rounded-lg border border-[#e8dfc8] text-[#666] text-xs hover:bg-[#f5f0e8] transition-colors">{T.cancel}</button>
                      </div>
                    </div>
                  ) : editingProfId === prof.id ? (
                    <div className="space-y-3">
                      <h4 className="text-sm font-bold text-[#1a1a1a]">{T.editProf}</h4>
                      <div><label className={LABEL}>{T.fieldName}</label><input className={INPUT} value={editProfForm.name} onChange={(e) => setEditProfForm({ ...editProfForm, name: e.target.value })} /></div>
                      <div><label className={LABEL}>{T.fieldSpecialty}</label><input className={INPUT} placeholder={T.specialtyPh} value={editProfForm.specialty} onChange={(e) => setEditProfForm({ ...editProfForm, specialty: e.target.value })} /></div>
                      <div><label className={LABEL}>{T.fieldBio}</label><textarea rows={3} className={INPUT} placeholder={T.bioPh} value={editProfForm.bio} onChange={(e) => setEditProfForm({ ...editProfForm, bio: e.target.value })} /></div>
                      <div>
                        <label className={LABEL}>{T.photoProf}</label>
                        {editProfForm.photo && <img src={editProfForm.photo.startsWith("data:") ? editProfForm.photo : `data:image/jpeg;base64,${editProfForm.photo}`} className="w-14 h-14 rounded-full object-cover mb-2" alt="" />}
                        <input type="file" accept="image/*" className="text-xs text-[#666] file:me-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-[#2d6a4f]/10 file:text-[#2d6a4f] file:font-semibold cursor-pointer"
                          onChange={async (e) => { const f = e.target.files?.[0]; if (f) setEditProfForm({ ...editProfForm, photo: await resizeProfPhoto(f) }); }} />
                      </div>
                      <div className="flex gap-2 pt-2">
                        <button onClick={handleSaveEditProf} disabled={submitting} className="px-3 py-1.5 rounded-lg bg-[#2d6a4f] text-white text-xs font-semibold hover:bg-[#235a40] disabled:opacity-60 disabled:cursor-wait transition-colors">{submitting ? T.saving : T.save}</button>
                        <button onClick={() => setEditingProfId(null)} className="px-3 py-1.5 rounded-lg border border-[#e8dfc8] text-[#666] text-xs hover:bg-[#f5f0e8] transition-colors">{T.cancel}</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {prof.photo ? (
                            <img src={prof.photo.startsWith("data:") ? prof.photo : `data:image/jpeg;base64,${prof.photo}`} className="w-11 h-11 rounded-full object-cover shrink-0" alt={prof.name} />
                          ) : (
                            <div className="w-11 h-11 rounded-full bg-[#2d6a4f]/10 flex items-center justify-center text-[#2d6a4f] font-bold text-sm shrink-0">{initials(prof.name)}</div>
                          )}
                          <div>
                            <div className="font-semibold text-[#1a1a1a] text-sm">{prof.name}</div>
                            <div className="text-xs text-[#c9a84c] font-medium">{prof.specialty || T.professor}</div>
                          </div>
                        </div>
                        {isAdmin && (
                          <div className="flex gap-1">
                            <button onClick={() => startEditProf(prof)} className="p-1.5 rounded-lg text-[#bbb] hover:text-[#2d6a4f] hover:bg-[#2d6a4f]/10 transition-colors" title={T.editLabel}><Pencil size={14} /></button>
                            {prof.id !== user.id && (
                              <button onClick={() => setDeletingProfId(prof.id)} className="p-1.5 rounded-lg text-[#bbb] hover:text-red-500 hover:bg-red-50 transition-colors" title={T.deleteLabel}><Trash2 size={14} /></button>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-[#aaa] mb-2">{prof.email}</div>
                      {prof.bio && <p className="text-xs text-[#666] leading-relaxed">{prof.bio}</p>}
                      {prof.id === user.id && <span className="mt-3 inline-block text-xs bg-[#2d6a4f]/10 text-[#2d6a4f] px-2.5 py-0.5 rounded-full font-semibold">{T.yourAccount}</span>}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── PARENTS TAB ── */}
        {tab === "parents" && (
          <div className="space-y-4">
            {isAdmin && (
              <div className="flex justify-end">
                <button onClick={() => { setShowAddParent(!showAddParent); setParentErr(""); }} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2d6a4f] text-white text-sm font-semibold hover:bg-[#235a40] transition-colors shadow-sm">
                  <Plus size={15} />{T.addParent}
                </button>
              </div>
            )}
            {isAdmin && showAddParent && (
              <div className="bg-white rounded-2xl border border-[#e8dfc8] p-6 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-bold text-[#1a1a1a]">{T.newParent}</h3>
                  <button onClick={() => setShowAddParent(false)} className="text-[#bbb] hover:text-[#555]"><X size={18} /></button>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><label className={LABEL}>{T.fieldName}</label><input className={INPUT} value={parentForm.name} onChange={(e) => setParentForm({ ...parentForm, name: e.target.value })} /></div>
                  <div><label className={LABEL}>{T.fieldEmail}</label><input type="email" className={INPUT} dir="ltr" value={parentForm.email} onChange={(e) => setParentForm({ ...parentForm, email: e.target.value })} /></div>
                  <div><label className={LABEL}>{T.fieldPassword}</label><input type="password" className={INPUT} value={parentForm.password} onChange={(e) => setParentForm({ ...parentForm, password: e.target.value })} /></div>
                </div>
                {parentErr && <p className="text-red-500 text-sm mt-3">{parentErr}</p>}
                <div className="flex gap-3 mt-5">
                  <button onClick={handleAddParent} disabled={submitting} className="px-5 py-2.5 rounded-xl bg-[#2d6a4f] text-white text-sm font-semibold hover:bg-[#235a40] disabled:opacity-60 disabled:cursor-wait transition-colors">{submitting ? T.saving : T.save}</button>
                  <button onClick={() => setShowAddParent(false)} className="px-5 py-2.5 rounded-xl border border-[#e8dfc8] text-[#666] text-sm hover:bg-[#f5f0e8] transition-colors">{T.cancel}</button>
                </div>
              </div>
            )}

            {parents.length === 0 ? (
              <div className="text-center py-20 text-[#ccc]"><Users size={44} className="mx-auto mb-3 opacity-40" /><p className="text-sm">{T.parentsNoneYet}</p></div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {parents.map((p) => {
                  const myChildren = students.filter((s) => s.parentId === p.id);
                  const childCount = myChildren.length;
                  return (
                    <div key={p.id} className="bg-white rounded-2xl border border-[#e8dfc8] p-5 shadow-sm">
                      {deletingParentId === p.id ? (
                        <div>
                          <p className="text-sm font-medium text-red-700 mb-3">{T.confirmDelete}</p>
                          <div className="flex gap-2">
                            <button onClick={() => handleDeleteParent(p.id)} disabled={submitting} className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-semibold hover:bg-red-600 disabled:opacity-60 disabled:cursor-wait transition-colors">{submitting ? T.deleting : T.confirmYes}</button>
                            <button onClick={() => setDeletingParentId(null)} className="px-3 py-1.5 rounded-lg border border-[#e8dfc8] text-[#666] text-xs hover:bg-[#f5f0e8] transition-colors">{T.cancel}</button>
                          </div>
                        </div>
                      ) : resetPwdParentId === p.id ? (
                        <div className="space-y-3">
                          <h4 className="text-sm font-bold text-[#1a1a1a]">{T.resetPasswordTitle}</h4>
                          <p className="text-xs text-[#888]">{p.name} — {p.email}</p>
                          <input type="text" className={INPUT} placeholder={T.newPasswordPh} value={resetPwdInput} onChange={(e) => setResetPwdInput(e.target.value)} />
                          {resetPwdErr && <p className="text-red-500 text-xs">{resetPwdErr}</p>}
                          <div className="flex gap-2">
                            <button onClick={() => handleResetPwd(p.id)} disabled={submitting} className="px-3 py-1.5 rounded-lg bg-[#2d6a4f] text-white text-xs font-semibold hover:bg-[#235a40] disabled:opacity-60 disabled:cursor-wait transition-colors">{submitting ? T.saving : T.resetPasswordBtn}</button>
                            <button onClick={() => { setResetPwdParentId(null); setResetPwdInput(""); setResetPwdErr(""); }} className="px-3 py-1.5 rounded-lg border border-[#e8dfc8] text-[#666] text-xs hover:bg-[#f5f0e8] transition-colors">{T.cancel}</button>
                          </div>
                        </div>
                      ) : editingParentId === p.id ? (
                        <div className="space-y-3">
                          <div><label className={LABEL}>{T.fieldName}</label><input className={INPUT} value={editParentForm.name} onChange={(e) => setEditParentForm({ name: e.target.value })} /></div>
                          <div className="flex gap-2">
                            <button onClick={handleSaveEditParent} disabled={submitting} className="px-3 py-1.5 rounded-lg bg-[#2d6a4f] text-white text-xs font-semibold hover:bg-[#235a40] disabled:opacity-60 disabled:cursor-wait transition-colors">{submitting ? T.saving : T.save}</button>
                            <button onClick={() => setEditingParentId(null)} className="px-3 py-1.5 rounded-lg border border-[#e8dfc8] text-[#666] text-xs hover:bg-[#f5f0e8] transition-colors">{T.cancel}</button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-11 h-11 rounded-full bg-[#c9a84c]/15 flex items-center justify-center text-[#c9a84c] font-bold text-sm shrink-0">{initials(p.name)}</div>
                              <div className="min-w-0">
                                <div className="font-semibold text-[#1a1a1a] text-sm truncate">{p.name}</div>
                                <div className="text-xs text-[#aaa] truncate">{p.email}</div>
                              </div>
                            </div>
                            {isAdmin && (
                              <div className="flex gap-1 shrink-0">
                                <button onClick={() => startEditParent(p)} className="p-1.5 rounded-lg text-[#bbb] hover:text-[#2d6a4f] hover:bg-[#2d6a4f]/10 transition-colors" title={T.editLabel}><Pencil size={14} /></button>
                                <button onClick={() => { setResetPwdParentId(p.id); setResetPwdInput(""); setResetPwdErr(""); }} className="px-2 py-1 rounded-lg text-[10px] font-bold text-[#c9a84c] hover:bg-[#c9a84c]/10 transition-colors uppercase" title={T.resetPasswordTitle}>PWD</button>
                                <button onClick={() => setDeletingParentId(p.id)} className="p-1.5 rounded-lg text-[#bbb] hover:text-red-500 hover:bg-red-50 transition-colors" title={T.deleteLabel}><Trash2 size={14} /></button>
                              </div>
                            )}
                          </div>
                          <div className="text-xs text-[#888] mb-2">{T.childrenCount(childCount)}</div>
                          {myChildren.length > 0 && (
                            <div className="space-y-1.5 pt-2 border-t border-[#f0ead8]">
                              {myChildren.map((c) => (
                                <div key={c.id} className="flex items-center gap-2">
                                  {c.photo ? (
                                    <img src={c.photo.startsWith("data:") ? c.photo : `data:image/jpeg;base64,${c.photo}`} alt={c.name} className="w-6 h-6 rounded-full object-cover shrink-0" />
                                  ) : (
                                    <div className="w-6 h-6 rounded-full bg-[#2d6a4f]/10 flex items-center justify-center text-[#2d6a4f] text-[10px] font-bold shrink-0">{initials(c.name)}</div>
                                  )}
                                  <div className="min-w-0 flex-1">
                                    <div className="text-xs font-medium text-[#444] truncate">{c.name}</div>
                                  </div>
                                  <span className="text-[10px] text-[#c9a84c] shrink-0">{c.level}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── TOP 3 TAB ── */}
        {tab === "top3" && (
          <div className="bg-white rounded-2xl border border-[#e8dfc8] p-6 shadow-sm max-w-lg">
            <div className="flex items-center gap-2 mb-6"><Trophy size={20} className="text-[#c9a84c]" /><h3 className="font-bold text-[#1a1a1a]">{T.top3Title}</h3></div>
            <div className="space-y-4">
              {(["r1", "r2", "r3"] as const).map((key, i) => (
                <div key={key}>
                  <label className={LABEL}>{[T.rank1, T.rank2, T.rank3][i]}</label>
                  <select className={INPUT} value={topForm[key]} onChange={(e) => setTopForm({ ...topForm, [key]: e.target.value })}>
                    <option value="">{T.top3None}</option>
                    {students.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              ))}
            </div>
            <button onClick={handleSaveTop3} disabled={submitting} className="mt-6 px-5 py-2.5 rounded-xl bg-[#c9a84c] text-white text-sm font-semibold hover:bg-[#b8943e] disabled:opacity-60 disabled:cursor-wait transition-colors">{submitting ? T.saving : T.top3Save}</button>
          </div>
        )}

        {/* ── ANNOUNCEMENTS TAB ── */}
        {tab === "announcements" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-[#1a1a1a]">{T.annTitle}</h2>
              <button onClick={() => { setShowAddAnn(!showAddAnn); setAnnErr(""); }} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2d6a4f] text-white text-sm font-semibold hover:bg-[#235a40] transition-colors shadow-sm">
                <Plus size={15} />{T.addAnnouncement}
              </button>
            </div>

            {showAddAnn && (
              <div className="bg-white rounded-2xl border border-[#e8dfc8] p-6 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-bold text-[#1a1a1a]">{T.newAnnouncement}</h3>
                  <button onClick={() => setShowAddAnn(false)} className="text-[#bbb] hover:text-[#555]"><X size={18} /></button>
                </div>
                <div className="space-y-4">
                  <div><label className={LABEL}>{T.annFieldTitle}</label><input className={INPUT} value={annForm.title} onChange={(e) => setAnnForm({ ...annForm, title: e.target.value })} /></div>
                  <div><label className={LABEL}>{T.annFieldBody}</label><textarea rows={4} className={`${INPUT} resize-none`} placeholder={T.annBodyPh} value={annForm.body} onChange={(e) => setAnnForm({ ...annForm, body: e.target.value })} /></div>
                  <div>
                    <label className={LABEL}>{T.annFieldImage}</label>
                    {annForm.image && <img src={annForm.image} className="w-full max-h-48 object-cover rounded-xl mb-2" alt="" />}
                    <input type="file" accept="image/*" className="text-xs text-[#666] file:me-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-[#2d6a4f]/10 file:text-[#2d6a4f] file:font-semibold cursor-pointer"
                      onChange={async (e) => { const f = e.target.files?.[0]; if (f) setAnnForm({ ...annForm, image: await resizeAnnImage(f) }); }} />
                  </div>
                </div>
                {annErr && <p className="text-red-500 text-sm mt-3">{annErr}</p>}
                <div className="flex gap-3 mt-5">
                  <button onClick={handleAddAnnouncement} disabled={submitting} className="px-5 py-2.5 rounded-xl bg-[#2d6a4f] text-white text-sm font-semibold hover:bg-[#235a40] disabled:opacity-60 disabled:cursor-wait transition-colors">{submitting ? T.saving : T.save}</button>
                  <button onClick={() => setShowAddAnn(false)} className="px-5 py-2.5 rounded-xl border border-[#e8dfc8] text-[#666] text-sm hover:bg-[#f5f0e8] transition-colors">{T.cancel}</button>
                </div>
              </div>
            )}

            {announcements.length === 0 ? (
              <div className="text-center py-20 text-[#ccc]"><Bell size={44} className="mx-auto mb-3 opacity-40" /><p className="text-sm">{T.noAnnouncements}</p></div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {announcements.map((ann) => (
                  <div key={ann.id} className="bg-white rounded-2xl border border-[#e8dfc8] overflow-hidden shadow-sm flex flex-col">
                    {deletingAnnId === ann.id ? (
                      <div className="p-5 flex flex-col gap-3 bg-red-50 flex-1">
                        <p className="text-sm font-medium text-red-700">{T.confirmDelete}</p>
                        <div className="flex gap-2">
                          <button onClick={() => handleDeleteAnnouncement(ann.id)} disabled={submitting} className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-semibold hover:bg-red-600 disabled:opacity-60 disabled:cursor-wait transition-colors">{submitting ? T.deleting : T.confirmYes}</button>
                          <button onClick={() => setDeletingAnnId(null)} className="px-3 py-1.5 rounded-lg border border-[#e8dfc8] text-[#666] text-xs hover:bg-white transition-colors">{T.cancel}</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {ann.image && <img src={ann.image} className="w-full h-40 object-cover" alt="" />}
                        {!ann.image && <div className="w-full h-16 bg-[#2d6a4f]/5 flex items-center justify-center"><Bell size={22} className="text-[#2d6a4f]/20" /></div>}
                        <div className="p-4 flex flex-col flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <span className="text-[10px] text-[#c9a84c] font-semibold">{ann.date}</span>
                              <h4 className="font-bold text-[#1a1a1a] text-sm mt-0.5 leading-snug">{ann.title}</h4>
                            </div>
                            <button onClick={() => setDeletingAnnId(ann.id)} className="p-1.5 rounded-lg text-[#bbb] hover:text-red-500 hover:bg-red-50 transition-colors shrink-0" title={T.deleteLabel}><Trash2 size={13} /></button>
                          </div>
                          {ann.body && <p className="text-xs text-[#666] mt-2 leading-relaxed line-clamp-3">{ann.body}</p>}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
