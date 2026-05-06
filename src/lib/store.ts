import { supabase } from "./supabase";
import type { User, Student, Session, TopEntry, Announcement, Exam, ExamResult, QCMQuestion, QCMOption } from "./types";
import type { SurahStatus } from "./quran";

// ── helpers ──────────────────────────────────────────────────

function mapSession(r: Record<string, unknown>): Session {
  return {
    id:           r.id as string,
    date:         r.date as string,
    present:      r.present as boolean,
    discipline:   r.discipline as Session["discipline"],
    memorization: (r.memorization as string) ?? "",
    comment:      (r.comment as string) ?? "",
    professorId:  r.professor_id as string,
  };
}

function mapStudent(r: Record<string, unknown>): Student {
  const rawSessions = (r.sessions as Record<string, unknown>[]) ?? [];
  const rawMemo     = (r.student_memorization as { surah_number: number; status: SurahStatus }[]) ?? [];
  const memorization: Record<number, SurahStatus> = {};
  rawMemo.forEach(({ surah_number, status }) => { memorization[surah_number] = status; });
  return {
    id:           r.id as string,
    name:         r.name as string,
    age:          r.age as number,
    level:        r.level as Student["level"],
    parentId:     r.parent_id as string,
    photo:        (r.photo as string) ?? undefined,
    sessions:     rawSessions
      .sort((a, b) => String(b.date).localeCompare(String(a.date)))
      .map(mapSession),
    memorization: Object.keys(memorization).length ? memorization : undefined,
  };
}

function mapExam(r: Record<string, unknown>): Exam {
  const rawQs = (r.qcm_questions as Record<string, unknown>[]) ?? [];
  const questions: QCMQuestion[] = rawQs
    .sort((a, b) => (a.position as number) - (b.position as number))
    .map((q) => ({
      id:              q.id as string,
      text:            q.text as string,
      correctOptionId: q.correct_option_id as string,
      options:         ((q.qcm_options as Record<string, unknown>[]) ?? []).map((o) => ({
        id:   o.id as string,
        text: o.text as string,
      })) as QCMOption[],
    }));
  return {
    id:          r.id as string,
    title:       r.title as string,
    professorId: r.professor_id as string,
    date:        r.date as string,
    questions,
  };
}

// ── PROFILES ─────────────────────────────────────────────────

export async function getProfiles(): Promise<User[]> {
  const { data } = await supabase.from("profiles").select("*").order("created_at");
  return (data ?? []).map((p) => ({
    id:        p.id,
    name:      p.name,
    email:     p.email ?? "",
    password:  "",
    role:      p.role,
    specialty: p.specialty ?? undefined,
  }));
}

/** Creates a Supabase Auth user + profile row via the server API route. */
export async function createUser(
  email: string,
  password: string,
  name: string,
  role: "professor" | "parent",
  specialty?: string
): Promise<User> {
  const res  = await fetch("/api/create-user", {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ email, password, name, role, specialty }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? "Failed to create user");
  return { id: json.user.id, name: json.user.name, email, password, role, specialty };
}

export async function deleteProfile(id: string): Promise<void> {
  await supabase.from("profiles").delete().eq("id", id);
}

// ── STUDENTS ─────────────────────────────────────────────────

export async function getStudents(): Promise<Student[]> {
  const { data } = await supabase
    .from("students")
    .select("*, sessions(*), student_memorization(*)")
    .order("created_at");
  return (data ?? []).map(mapStudent);
}

export async function getStudentsByParent(parentId: string): Promise<Student[]> {
  const { data } = await supabase
    .from("students")
    .select("*, sessions(*), student_memorization(*)")
    .eq("parent_id", parentId)
    .order("created_at");
  return (data ?? []).map(mapStudent);
}

export async function addStudent(
  name: string, age: number, level: Student["level"],
  parentId: string, photo?: string
): Promise<Student> {
  const { data } = await supabase
    .from("students")
    .insert({ name, age, level, parent_id: parentId, photo: photo ?? null })
    .select("*, sessions(*), student_memorization(*)")
    .single();
  return mapStudent(data);
}

export async function updateStudent(
  id: string,
  patch: { name?: string; age?: number; level?: Student["level"]; photo?: string | null }
): Promise<void> {
  await supabase.from("students").update({
    name:  patch.name,
    age:   patch.age,
    level: patch.level,
    photo: patch.photo ?? null,
  }).eq("id", id);
}

export async function deleteStudent(id: string): Promise<void> {
  await supabase.from("students").delete().eq("id", id);
}

// ── SESSIONS ─────────────────────────────────────────────────

export async function addSession(
  studentId: string,
  professorId: string,
  data: Omit<Session, "id" | "professorId">
): Promise<Session> {
  const { data: row } = await supabase
    .from("sessions")
    .insert({
      student_id:   studentId,
      professor_id: professorId,
      date:         data.date,
      present:      data.present,
      discipline:   data.discipline,
      memorization: data.memorization,
      comment:      data.comment,
    })
    .select()
    .single();
  return mapSession(row);
}

// ── TOP ENTRIES ───────────────────────────────────────────────

export async function getTopStudents(): Promise<TopEntry[]> {
  const { data } = await supabase.from("top_entries").select("*").order("rank");
  return (data ?? []).map((r) => ({ rank: r.rank as 1 | 2 | 3, studentId: r.student_id }));
}

export async function saveTopStudents(entries: TopEntry[]): Promise<void> {
  await supabase.from("top_entries").delete().neq("rank", 0);
  if (entries.length) {
    await supabase.from("top_entries").insert(
      entries.map((e) => ({ rank: e.rank, student_id: e.studentId }))
    );
  }
}

// ── ANNOUNCEMENTS ─────────────────────────────────────────────

export async function getAnnouncements(): Promise<Announcement[]> {
  const { data } = await supabase
    .from("announcements")
    .select("*")
    .order("created_at", { ascending: false });
  return (data ?? []).map((a) => ({
    id:    a.id,
    title: a.title,
    body:  a.body,
    image: a.image ?? undefined,
    date:  a.date,
  }));
}

export async function addAnnouncement(ann: Omit<Announcement, "id">): Promise<Announcement> {
  const { data } = await supabase
    .from("announcements")
    .insert({ title: ann.title, body: ann.body, image: ann.image ?? null, date: ann.date })
    .select()
    .single();
  return { id: data.id, title: data.title, body: data.body, image: data.image ?? undefined, date: data.date };
}

export async function deleteAnnouncement(id: string): Promise<void> {
  await supabase.from("announcements").delete().eq("id", id);
}

// ── EXAMS ─────────────────────────────────────────────────────

export async function getExams(): Promise<Exam[]> {
  const { data } = await supabase
    .from("exams")
    .select("*, qcm_questions(*, qcm_options(*))")
    .order("created_at", { ascending: false });
  return (data ?? []).map(mapExam);
}

export async function addExam(exam: Omit<Exam, "id">): Promise<void> {
  const { data: examRow } = await supabase
    .from("exams")
    .insert({ title: exam.title, professor_id: exam.professorId, date: exam.date })
    .select()
    .single();

  for (let i = 0; i < exam.questions.length; i++) {
    const q = exam.questions[i];
    const { data: qRow } = await supabase
      .from("qcm_questions")
      .insert({ exam_id: examRow.id, text: q.text, correct_option_id: q.correctOptionId, position: i })
      .select()
      .single();
    await supabase.from("qcm_options").insert(
      q.options.map((o) => ({ id: o.id, question_id: qRow.id, text: o.text }))
    );
  }
}

export async function deleteExam(id: string): Promise<void> {
  await supabase.from("exams").delete().eq("id", id);
}

// ── EXAM RESULTS ──────────────────────────────────────────────

export async function getExamResults(): Promise<ExamResult[]> {
  const { data } = await supabase
    .from("exam_results")
    .select("*")
    .order("created_at", { ascending: false });
  return (data ?? []).map((r) => ({
    id:           r.id,
    examId:       r.exam_id,
    studentId:    r.student_id,
    answers:      r.answers as Record<string, string>,
    score:        r.score,
    correctCount: r.correct_count,
    totalCount:   r.total_count,
    dateTaken:    r.date_taken,
  }));
}

export async function addExamResult(result: Omit<ExamResult, "id">): Promise<void> {
  await supabase.from("exam_results").insert({
    exam_id:       result.examId,
    student_id:    result.studentId,
    answers:       result.answers,
    score:         result.score,
    correct_count: result.correctCount,
    total_count:   result.totalCount,
    date_taken:    result.dateTaken,
  });
}

export async function deleteExamResults(examId: string): Promise<void> {
  await supabase.from("exam_results").delete().eq("exam_id", examId);
}

// ── MEMORIZATION ──────────────────────────────────────────────

export async function saveMemoMap(
  studentId: string,
  memo: Record<number, SurahStatus>
): Promise<void> {
  await supabase.from("student_memorization").delete().eq("student_id", studentId);
  const entries = Object.entries(memo)
    .filter(([, status]) => status !== "not_started")
    .map(([n, status]) => ({ student_id: studentId, surah_number: Number(n), status }));
  if (entries.length) {
    await supabase.from("student_memorization").insert(entries);
  }
}

// ── AUTH (used by login pages) ────────────────────────────────

export async function signIn(email: string, password: string): Promise<User | null> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) return null;
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", data.user.id)
    .single();
  if (!profile) return null;
  return {
    id:        profile.id,
    name:      profile.name,
    email:     data.user.email ?? "",
    password:  "",
    role:      profile.role,
    specialty: profile.specialty ?? undefined,
  };
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}

export async function getSessionUser(): Promise<User | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();
  if (!profile) return null;
  return {
    id:        profile.id,
    name:      profile.name,
    email:     user.email ?? "",
    password:  "",
    role:      profile.role,
    specialty: profile.specialty ?? undefined,
  };
}
