-- ============================================================
--  Nur Al-Quran — Supabase Schema
--  Run this entire file in the Supabase SQL Editor
-- ============================================================

-- ── 1. PROFILES (extends auth.users) ────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  email       TEXT UNIQUE,
  role        TEXT NOT NULL CHECK (role IN ('professor', 'parent')),
  specialty   TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── 2. STUDENTS ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.students (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  age         INTEGER NOT NULL DEFAULT 0,
  level       TEXT NOT NULL DEFAULT 'Débutant'
                CHECK (level IN ('Débutant', 'Intermédiaire', 'Avancé', 'Hifz')),
  parent_id   UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  photo       TEXT,  -- base64 JPEG
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── 3. SESSIONS ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.sessions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id    UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  professor_id  UUID NOT NULL REFERENCES public.profiles(id),
  date          DATE NOT NULL,
  present       BOOLEAN NOT NULL DEFAULT TRUE,
  discipline    TEXT NOT NULL DEFAULT 'bon'
                  CHECK (discipline IN ('excellent', 'bon', 'passable', 'insuffisant')),
  memorization  TEXT NOT NULL DEFAULT '',
  comment       TEXT NOT NULL DEFAULT '',
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── 4. TOP ENTRIES ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.top_entries (
  rank        INTEGER PRIMARY KEY CHECK (rank IN (1, 2, 3)),
  student_id  UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE
);

-- ── 5. ANNOUNCEMENTS ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.announcements (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  body        TEXT NOT NULL DEFAULT '',
  image       TEXT,  -- base64 JPEG
  date        DATE NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── 6. EXAMS ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.exams (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title         TEXT NOT NULL,
  professor_id  UUID NOT NULL REFERENCES public.profiles(id),
  date          DATE NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── 7. QCM QUESTIONS ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.qcm_questions (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id           UUID NOT NULL REFERENCES public.exams(id) ON DELETE CASCADE,
  text              TEXT NOT NULL,
  correct_option_id TEXT NOT NULL,  -- 'a' | 'b' | 'c' | 'd'
  position          INTEGER NOT NULL DEFAULT 0
);

-- ── 8. QCM OPTIONS ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.qcm_options (
  id           TEXT NOT NULL,  -- 'a' | 'b' | 'c' | 'd'
  question_id  UUID NOT NULL REFERENCES public.qcm_questions(id) ON DELETE CASCADE,
  text         TEXT NOT NULL,
  PRIMARY KEY (id, question_id)
);

-- ── 9. EXAM RESULTS ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.exam_results (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id        UUID NOT NULL REFERENCES public.exams(id) ON DELETE CASCADE,
  student_id     UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  answers        JSONB NOT NULL DEFAULT '{}',  -- { questionId: optionId }
  score          INTEGER NOT NULL DEFAULT 0,
  correct_count  INTEGER NOT NULL DEFAULT 0,
  total_count    INTEGER NOT NULL DEFAULT 0,
  date_taken     DATE NOT NULL,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ── 10. STUDENT MEMORIZATION MAP ────────────────────────────
CREATE TABLE IF NOT EXISTS public.student_memorization (
  student_id    UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  surah_number  SMALLINT NOT NULL CHECK (surah_number BETWEEN 1 AND 114),
  status        TEXT NOT NULL
                  CHECK (status IN ('not_started', 'in_progress', 'memorized', 'needs_revision')),
  PRIMARY KEY (student_id, surah_number)
);

-- ── SEED: initial announcement ───────────────────────────────
INSERT INTO public.announcements (title, body, date) VALUES (
  'زيارة الشيخ الفاضل أحمد الأزهري',
  'يسعدنا الإعلان عن زيارة الشيخ الفاضل أحمد الأزهري يوم الجمعة 2 مايو. ستُقام جلسة خاصة للتلاوة والحفظ مفتوحة لجميع الطلاب وأولياء الأمور.',
  '2026-04-30'
) ON CONFLICT DO NOTHING;

-- ============================================================
--  ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE public.profiles             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.top_entries          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qcm_questions        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qcm_options          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_results         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_memorization ENABLE ROW LEVEL SECURITY;

-- Helper: current user's role
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- ── PROFILES ────────────────────────────────────────────────
CREATE POLICY "users_read_own_profile"
  ON public.profiles FOR SELECT TO authenticated
  USING (id = auth.uid() OR get_my_role() = 'professor');

CREATE POLICY "professors_insert_profiles"
  ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (get_my_role() = 'professor');

CREATE POLICY "professors_delete_profiles"
  ON public.profiles FOR DELETE TO authenticated
  USING (get_my_role() = 'professor' AND id <> auth.uid());

-- ── STUDENTS ────────────────────────────────────────────────
CREATE POLICY "professors_all_students"
  ON public.students FOR ALL TO authenticated
  USING (get_my_role() = 'professor')
  WITH CHECK (get_my_role() = 'professor');

CREATE POLICY "parents_read_own_students"
  ON public.students FOR SELECT TO authenticated
  USING (get_my_role() = 'parent' AND parent_id = auth.uid());

-- ── SESSIONS ────────────────────────────────────────────────
CREATE POLICY "professors_all_sessions"
  ON public.sessions FOR ALL TO authenticated
  USING (get_my_role() = 'professor')
  WITH CHECK (get_my_role() = 'professor');

CREATE POLICY "parents_read_own_sessions"
  ON public.sessions FOR SELECT TO authenticated
  USING (
    get_my_role() = 'parent' AND
    student_id IN (SELECT id FROM public.students WHERE parent_id = auth.uid())
  );

-- ── TOP ENTRIES ─────────────────────────────────────────────
CREATE POLICY "anyone_read_top"
  ON public.top_entries FOR SELECT TO authenticated USING (TRUE);

CREATE POLICY "professors_write_top"
  ON public.top_entries FOR ALL TO authenticated
  USING (get_my_role() = 'professor')
  WITH CHECK (get_my_role() = 'professor');

-- ── ANNOUNCEMENTS ───────────────────────────────────────────
CREATE POLICY "anyone_read_announcements"
  ON public.announcements FOR SELECT TO anon, authenticated USING (TRUE);

CREATE POLICY "professors_write_announcements"
  ON public.announcements FOR ALL TO authenticated
  USING (get_my_role() = 'professor')
  WITH CHECK (get_my_role() = 'professor');

-- ── EXAMS ───────────────────────────────────────────────────
CREATE POLICY "authenticated_read_exams"
  ON public.exams FOR SELECT TO authenticated USING (TRUE);

CREATE POLICY "professors_write_exams"
  ON public.exams FOR ALL TO authenticated
  USING (get_my_role() = 'professor')
  WITH CHECK (get_my_role() = 'professor');

-- ── QCM QUESTIONS ───────────────────────────────────────────
CREATE POLICY "authenticated_read_questions"
  ON public.qcm_questions FOR SELECT TO authenticated USING (TRUE);

CREATE POLICY "professors_write_questions"
  ON public.qcm_questions FOR ALL TO authenticated
  USING (get_my_role() = 'professor')
  WITH CHECK (get_my_role() = 'professor');

-- ── QCM OPTIONS ─────────────────────────────────────────────
CREATE POLICY "authenticated_read_options"
  ON public.qcm_options FOR SELECT TO authenticated USING (TRUE);

CREATE POLICY "professors_write_options"
  ON public.qcm_options FOR ALL TO authenticated
  USING (get_my_role() = 'professor')
  WITH CHECK (get_my_role() = 'professor');

-- ── EXAM RESULTS ────────────────────────────────────────────
CREATE POLICY "professors_read_all_results"
  ON public.exam_results FOR SELECT TO authenticated
  USING (get_my_role() = 'professor');

CREATE POLICY "parents_read_own_results"
  ON public.exam_results FOR SELECT TO authenticated
  USING (
    get_my_role() = 'parent' AND
    student_id IN (SELECT id FROM public.students WHERE parent_id = auth.uid())
  );

CREATE POLICY "parents_insert_results"
  ON public.exam_results FOR INSERT TO authenticated
  WITH CHECK (
    get_my_role() = 'parent' AND
    student_id IN (SELECT id FROM public.students WHERE parent_id = auth.uid())
  );

CREATE POLICY "professors_delete_results"
  ON public.exam_results FOR DELETE TO authenticated
  USING (get_my_role() = 'professor');

-- ── MEMORIZATION ────────────────────────────────────────────
CREATE POLICY "professors_all_memo"
  ON public.student_memorization FOR ALL TO authenticated
  USING (get_my_role() = 'professor')
  WITH CHECK (get_my_role() = 'professor');

CREATE POLICY "parents_read_own_memo"
  ON public.student_memorization FOR SELECT TO authenticated
  USING (
    get_my_role() = 'parent' AND
    student_id IN (SELECT id FROM public.students WHERE parent_id = auth.uid())
  );
