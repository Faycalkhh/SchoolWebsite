-- ============================================================
--  Nur Al-Quran — Database Health Check
--  Run each section in Supabase SQL Editor and check results.
--  Anything returning "MISSING" or "BAD" needs the fix below.
-- ============================================================

-- ── 1. Are required columns present on profiles? ──────────────
SELECT
  CASE WHEN COUNT(*) FILTER (WHERE column_name = 'bio')   = 1 THEN 'OK' ELSE 'MISSING bio'   END AS bio_check,
  CASE WHEN COUNT(*) FILTER (WHERE column_name = 'photo') = 1 THEN 'OK' ELSE 'MISSING photo' END AS photo_check,
  CASE WHEN COUNT(*) FILTER (WHERE column_name = 'email') = 1 THEN 'OK' ELSE 'MISSING email' END AS email_check
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'profiles';

-- ── 2. Are all the right RLS policies present? ────────────────
SELECT tablename, policyname, cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, cmd;
-- Expected on profiles: SELECT, INSERT, UPDATE, DELETE
-- If UPDATE missing → admin can't edit professors

-- ── 3. Are auth users + profiles consistent? ──────────────────
SELECT
  u.email,
  u.encrypted_password IS NOT NULL AS has_password,
  u.email_confirmed_at IS NOT NULL AS email_confirmed,
  p.id IS NOT NULL                 AS has_profile,
  p.role
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
ORDER BY u.email;

-- ── 4. Do students reference real parent profiles? ────────────
SELECT s.name AS student, s.parent_id, p.name AS parent, p.role
FROM public.students s
LEFT JOIN public.profiles p ON p.id = s.parent_id;
-- If parent is NULL → broken FK / orphaned student

-- ── 5. Do sessions reference real professor profiles? ─────────
SELECT COUNT(*) AS broken_sessions
FROM public.sessions s
LEFT JOIN public.profiles p ON p.id = s.professor_id
WHERE p.id IS NULL;
-- Should be 0

-- ── 6. Do exams reference real professor profiles? ────────────
SELECT COUNT(*) AS broken_exams
FROM public.exams e
LEFT JOIN public.profiles p ON p.id = e.professor_id
WHERE p.id IS NULL;
-- Should be 0

-- ── 7. Counts ─────────────────────────────────────────────────
SELECT
  (SELECT COUNT(*) FROM public.profiles)             AS profiles,
  (SELECT COUNT(*) FROM public.profiles WHERE role='professor') AS professors,
  (SELECT COUNT(*) FROM public.profiles WHERE role='parent')    AS parents,
  (SELECT COUNT(*) FROM public.students)             AS students,
  (SELECT COUNT(*) FROM public.sessions)             AS sessions,
  (SELECT COUNT(*) FROM public.announcements)        AS announcements,
  (SELECT COUNT(*) FROM public.exams)                AS exams,
  (SELECT COUNT(*) FROM public.top_entries)          AS top_entries;
