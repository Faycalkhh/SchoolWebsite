-- ============================================================
--  Nur Al-Quran — Fix All Known Issues
--  Safe to run multiple times (idempotent).
-- ============================================================

-- ── 1. Add missing columns ────────────────────────────────────
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS bio   TEXT,
  ADD COLUMN IF NOT EXISTS photo TEXT;

-- ── 2. Add missing UPDATE policy on profiles ─────────────────
DROP POLICY IF EXISTS "professors_update_profiles" ON public.profiles;
CREATE POLICY "professors_update_profiles"
  ON public.profiles FOR UPDATE TO authenticated
  USING      (get_my_role() = 'professor' OR id = auth.uid())
  WITH CHECK (get_my_role() = 'professor' OR id = auth.uid());

-- ── 3. Make sure RLS is enabled ──────────────────────────────
ALTER TABLE public.profiles      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.top_entries   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_results  ENABLE ROW LEVEL SECURITY;

-- ── 4. Reset broken auth users (only if you have orphans) ────
-- Uncomment if diagnose.sql section #3 shows users without profiles.
-- DELETE FROM auth.users
-- WHERE email IN ('prof@nur.com','sarah@nur.com','parent@nur.com','fatima@nur.com','omar@nur.com')
--   AND id NOT IN (SELECT id FROM public.profiles);
