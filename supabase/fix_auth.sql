-- ============================================================
--  Nur Al-Quran — Auth Repair
--  Run this AFTER manually creating the 5 users in the
--  Supabase Dashboard (Authentication → Users → Add user).
--  It reads their real UUIDs and wires up all FK references.
-- ============================================================

-- ── 1. Insert/update profiles using the real auth UUIDs ──────
INSERT INTO public.profiles (id, name, email, role, specialty)
SELECT
  u.id,
  CASE u.email
    WHEN 'prof@nur.com'   THEN 'Mohammed Hassan'
    WHEN 'sarah@nur.com'  THEN 'Sarah Benali'
    WHEN 'parent@nur.com' THEN 'Ahmed Karim'
    WHEN 'fatima@nur.com' THEN 'Fatima Mansour'
    WHEN 'omar@nur.com'   THEN 'Omar Rachid'
  END,
  u.email,
  CASE u.email
    WHEN 'prof@nur.com'  THEN 'professor'
    WHEN 'sarah@nur.com' THEN 'professor'
    ELSE 'parent'
  END,
  CASE u.email
    WHEN 'prof@nur.com'  THEN 'Tajweed & Hifz'
    WHEN 'sarah@nur.com' THEN 'Langue Arabe'
    ELSE NULL
  END
FROM auth.users u
WHERE u.email IN (
  'prof@nur.com', 'sarah@nur.com',
  'parent@nur.com', 'fatima@nur.com', 'omar@nur.com'
)
ON CONFLICT (id) DO UPDATE
  SET name      = EXCLUDED.name,
      email     = EXCLUDED.email,
      role      = EXCLUDED.role,
      specialty = EXCLUDED.specialty;

-- ── 2. Re-point students to real parent UUIDs ────────────────
UPDATE public.students
SET parent_id = (SELECT id FROM auth.users WHERE email = 'parent@nur.com')
WHERE parent_id = '33333333-3333-3333-3333-333333333333';

UPDATE public.students
SET parent_id = (SELECT id FROM auth.users WHERE email = 'fatima@nur.com')
WHERE parent_id = '44444444-4444-4444-4444-444444444444';

UPDATE public.students
SET parent_id = (SELECT id FROM auth.users WHERE email = 'omar@nur.com')
WHERE parent_id = '55555555-5555-5555-5555-555555555555';

-- ── 3. Re-point sessions to real professor UUIDs ─────────────
UPDATE public.sessions
SET professor_id = (SELECT id FROM auth.users WHERE email = 'prof@nur.com')
WHERE professor_id = '11111111-1111-1111-1111-111111111111';

UPDATE public.sessions
SET professor_id = (SELECT id FROM auth.users WHERE email = 'sarah@nur.com')
WHERE professor_id = '22222222-2222-2222-2222-222222222222';

-- ── 4. Re-point exam to real professor UUID ──────────────────
UPDATE public.exams
SET professor_id = (SELECT id FROM auth.users WHERE email = 'prof@nur.com')
WHERE professor_id = '11111111-1111-1111-1111-111111111111';

-- ── 5. Delete the old fake-UUID profiles (now orphaned) ──────
DELETE FROM public.profiles
WHERE id IN (
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  '33333333-3333-3333-3333-333333333333',
  '44444444-4444-4444-4444-444444444444',
  '55555555-5555-5555-5555-555555555555'
);

-- ── 6. Delete the old fake-UUID auth users (profiles gone, safe now) ──
DELETE FROM auth.users
WHERE id IN (
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  '33333333-3333-3333-3333-333333333333',
  '44444444-4444-4444-4444-444444444444',
  '55555555-5555-5555-5555-555555555555'
);
