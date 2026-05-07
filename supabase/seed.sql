-- ============================================================
--  Nur Al-Quran — Mock Seed Data
--  Run AFTER schema.sql in the Supabase SQL Editor
--  Idempotent: uses ON CONFLICT DO NOTHING throughout
-- ============================================================

-- ── 0. MIGRATIONS (safe to run on existing schema) ───────────
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS email TEXT UNIQUE;

-- Fixed UUIDs
-- Professors : 1111...1  (prof@nur.com)   2222...2 (sarah@nur.com)
-- Parents    : 3333...3  (parent@nur.com) 4444...4 (fatima@nur.com) 5555...5 (omar@nur.com)
-- Students   : aaaa-0001 … aaaa-0005
-- Questions  : cccc-0001 … cccc-0003  (c is valid hex; q is not)

-- ── 1. AUTH USERS ────────────────────────────────────────────
INSERT INTO auth.users (
  id, instance_id, aud, role, email,
  encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data,
  is_sso_user, created_at, updated_at
) VALUES
  (
    '11111111-1111-1111-1111-111111111111',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'prof@nur.com',
    crypt('prof123', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
    FALSE, NOW(), NOW()
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'sarah@nur.com',
    crypt('prof123', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
    FALSE, NOW(), NOW()
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'parent@nur.com',
    crypt('parent123', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
    FALSE, NOW(), NOW()
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'fatima@nur.com',
    crypt('parent123', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
    FALSE, NOW(), NOW()
  ),
  (
    '55555555-5555-5555-5555-555555555555',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'omar@nur.com',
    crypt('parent123', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
    FALSE, NOW(), NOW()
  )
ON CONFLICT (id) DO NOTHING;

-- ── 2. PROFILES ──────────────────────────────────────────────
INSERT INTO public.profiles (id, name, email, role, specialty) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Mohammed Hassan',  'prof@nur.com',    'professor', 'Tajweed & Hifz'),
  ('22222222-2222-2222-2222-222222222222', 'Sarah Benali',     'sarah@nur.com',   'professor', 'Langue Arabe'),
  ('33333333-3333-3333-3333-333333333333', 'Ahmed Karim',      'parent@nur.com',  'parent',    NULL),
  ('44444444-4444-4444-4444-444444444444', 'Fatima Mansour',   'fatima@nur.com',  'parent',    NULL),
  ('55555555-5555-5555-5555-555555555555', 'Omar Rachid',      'omar@nur.com',    'parent',    NULL)
ON CONFLICT (id) DO NOTHING;

-- ── 3. STUDENTS ──────────────────────────────────────────────
INSERT INTO public.students (id, name, age, level, parent_id) VALUES
  ('aaaaaaaa-0001-0001-0001-000000000001', 'Yusuf Karim',     12, 'Intermédiaire', '33333333-3333-3333-3333-333333333333'),
  ('aaaaaaaa-0002-0002-0002-000000000002', 'Maryam Karim',     9, 'Débutant',      '33333333-3333-3333-3333-333333333333'),
  ('aaaaaaaa-0003-0003-0003-000000000003', 'Ibrahim Mansour', 14, 'Avancé',        '44444444-4444-4444-4444-444444444444'),
  ('aaaaaaaa-0004-0004-0004-000000000004', 'Aisha Mansour',   11, 'Intermédiaire', '44444444-4444-4444-4444-444444444444'),
  ('aaaaaaaa-0005-0005-0005-000000000005', 'Hassan Rachid',   13, 'Hifz',          '55555555-5555-5555-5555-555555555555')
ON CONFLICT (id) DO NOTHING;

-- ── 4. SESSIONS ──────────────────────────────────────────────
INSERT INTO public.sessions (student_id, professor_id, date, present, discipline, memorization, comment) VALUES
  -- Yusuf (6 sessions)
  ('aaaaaaaa-0001-0001-0001-000000000001', '11111111-1111-1111-1111-111111111111', '2026-04-28', TRUE,  'excellent',   'Al-Baqara (1-10)',    'Très bonne mémorisation, continuer ainsi.'),
  ('aaaaaaaa-0001-0001-0001-000000000001', '11111111-1111-1111-1111-111111111111', '2026-04-21', TRUE,  'bon',         'Al-Fatiha révision',  'Bonne récitation, améliorer le tajweed.'),
  ('aaaaaaaa-0001-0001-0001-000000000001', '11111111-1111-1111-1111-111111111111', '2026-04-14', TRUE,  'excellent',   'An-Nas, Al-Falaq',    'Maîtrise parfaite des deux sourates.'),
  ('aaaaaaaa-0001-0001-0001-000000000001', '11111111-1111-1111-1111-111111111111', '2026-04-07', FALSE, 'bon',         '',                    'Absent pour raison de maladie.'),
  ('aaaaaaaa-0001-0001-0001-000000000001', '11111111-1111-1111-1111-111111111111', '2026-03-31', TRUE,  'bon',         'Al-Ikhlas, Al-Kafiroun', 'Progrès notable cette semaine.'),
  ('aaaaaaaa-0001-0001-0001-000000000001', '22222222-2222-2222-2222-222222222222', '2026-03-24', TRUE,  'passable',    'Al-Baqara (1-5)',     'Doit travailler la prononciation.'),

  -- Maryam (4 sessions)
  ('aaaaaaaa-0002-0002-0002-000000000002', '11111111-1111-1111-1111-111111111111', '2026-04-28', TRUE,  'bon',         'Al-Fatiha',           'Première semaine, bonne volonté.'),
  ('aaaaaaaa-0002-0002-0002-000000000002', '11111111-1111-1111-1111-111111111111', '2026-04-21', TRUE,  'bon',         'An-Nas',              'Mémorise bien avec la répétition.'),
  ('aaaaaaaa-0002-0002-0002-000000000002', '11111111-1111-1111-1111-111111111111', '2026-04-14', TRUE,  'passable',    'Al-Fatiha révision',  'Doit réviser davantage à la maison.'),
  ('aaaaaaaa-0002-0002-0002-000000000002', '22222222-2222-2222-2222-222222222222', '2026-04-07', FALSE, 'passable',    '',                    ''),

  -- Ibrahim (5 sessions)
  ('aaaaaaaa-0003-0003-0003-000000000003', '11111111-1111-1111-1111-111111111111', '2026-04-28', TRUE,  'excellent',   'Al-Baqara (100-120)', 'Élève exceptionnel, rythme soutenu.'),
  ('aaaaaaaa-0003-0003-0003-000000000003', '11111111-1111-1111-1111-111111111111', '2026-04-21', TRUE,  'excellent',   'Al-Baqara (80-99)',   'Parfaite mémorisation.'),
  ('aaaaaaaa-0003-0003-0003-000000000003', '11111111-1111-1111-1111-111111111111', '2026-04-14', TRUE,  'excellent',   'Al-Baqara (60-79)',   'Continue sur cette lancée.'),
  ('aaaaaaaa-0003-0003-0003-000000000003', '22222222-2222-2222-2222-222222222222', '2026-04-07', TRUE,  'bon',         'Al-Imran (1-20)',     'Bonne progression en langue arabe.'),
  ('aaaaaaaa-0003-0003-0003-000000000003', '11111111-1111-1111-1111-111111111111', '2026-03-31', TRUE,  'excellent',   'Al-Baqara (40-59)',   ''),

  -- Aisha (4 sessions)
  ('aaaaaaaa-0004-0004-0004-000000000004', '11111111-1111-1111-1111-111111111111', '2026-04-28', TRUE,  'bon',         'Al-Mulk (1-15)',      'Bonne progression cette semaine.'),
  ('aaaaaaaa-0004-0004-0004-000000000004', '11111111-1111-1111-1111-111111111111', '2026-04-21', TRUE,  'bon',         'Al-Mulk (1-10)',      'Améliorer les règles de tajweed.'),
  ('aaaaaaaa-0004-0004-0004-000000000004', '22222222-2222-2222-2222-222222222222', '2026-04-14', FALSE, 'bon',         '',                    ''),
  ('aaaaaaaa-0004-0004-0004-000000000004', '11111111-1111-1111-1111-111111111111', '2026-04-07', TRUE,  'passable',    'Révision générale',   'Concentration insuffisante.'),

  -- Hassan (5 sessions)
  ('aaaaaaaa-0005-0005-0005-000000000005', '11111111-1111-1111-1111-111111111111', '2026-04-28', TRUE,  'excellent',   'Yasin (1-30)',        'Hifz parfait, intonation magnifique.'),
  ('aaaaaaaa-0005-0005-0005-000000000005', '11111111-1111-1111-1111-111111111111', '2026-04-21', TRUE,  'excellent',   'Al-Kahf (1-30)',      'Progrès remarquable.'),
  ('aaaaaaaa-0005-0005-0005-000000000005', '11111111-1111-1111-1111-111111111111', '2026-04-14', TRUE,  'excellent',   'Al-Kahf révision',   ''),
  ('aaaaaaaa-0005-0005-0005-000000000005', '22222222-2222-2222-2222-222222222222', '2026-04-07', TRUE,  'bon',         'Grammaire arabe',    'Bon niveau en langue arabe.'),
  ('aaaaaaaa-0005-0005-0005-000000000005', '11111111-1111-1111-1111-111111111111', '2026-03-31', TRUE,  'excellent',   'Ar-Rahman (1-40)',   'Récitation très touchante.')
ON CONFLICT DO NOTHING;

-- ── 5. MEMORIZATION MAP ──────────────────────────────────────
-- Yusuf: Al-Fatiha + Al-Baqara (in progress) + short surahs memorized
INSERT INTO public.student_memorization (student_id, surah_number, status) VALUES
  ('aaaaaaaa-0001-0001-0001-000000000001',   1, 'memorized'),
  ('aaaaaaaa-0001-0001-0001-000000000001',   2, 'in_progress'),
  ('aaaaaaaa-0001-0001-0001-000000000001', 112, 'memorized'),
  ('aaaaaaaa-0001-0001-0001-000000000001', 113, 'memorized'),
  ('aaaaaaaa-0001-0001-0001-000000000001', 114, 'memorized'),
  -- Ibrahim: advanced — many surahs memorized
  ('aaaaaaaa-0003-0003-0003-000000000003',   1, 'memorized'),
  ('aaaaaaaa-0003-0003-0003-000000000003',   2, 'in_progress'),
  ('aaaaaaaa-0003-0003-0003-000000000003',   3, 'in_progress'),
  ('aaaaaaaa-0003-0003-0003-000000000003', 110, 'memorized'),
  ('aaaaaaaa-0003-0003-0003-000000000003', 111, 'memorized'),
  ('aaaaaaaa-0003-0003-0003-000000000003', 112, 'memorized'),
  ('aaaaaaaa-0003-0003-0003-000000000003', 113, 'memorized'),
  ('aaaaaaaa-0003-0003-0003-000000000003', 114, 'memorized'),
  -- Hassan: Hifz student — large portion memorized
  ('aaaaaaaa-0005-0005-0005-000000000005',   1, 'memorized'),
  ('aaaaaaaa-0005-0005-0005-000000000005',   2, 'memorized'),
  ('aaaaaaaa-0005-0005-0005-000000000005',  18, 'memorized'),
  ('aaaaaaaa-0005-0005-0005-000000000005',  36, 'memorized'),
  ('aaaaaaaa-0005-0005-0005-000000000005',  55, 'memorized'),
  ('aaaaaaaa-0005-0005-0005-000000000005',  67, 'in_progress'),
  ('aaaaaaaa-0005-0005-0005-000000000005', 108, 'memorized'),
  ('aaaaaaaa-0005-0005-0005-000000000005', 109, 'memorized'),
  ('aaaaaaaa-0005-0005-0005-000000000005', 110, 'memorized'),
  ('aaaaaaaa-0005-0005-0005-000000000005', 111, 'memorized'),
  ('aaaaaaaa-0005-0005-0005-000000000005', 112, 'memorized'),
  ('aaaaaaaa-0005-0005-0005-000000000005', 113, 'memorized'),
  ('aaaaaaaa-0005-0005-0005-000000000005', 114, 'memorized')
ON CONFLICT (student_id, surah_number) DO NOTHING;

-- ── 6. TOP ENTRIES ────────────────────────────────────────────
INSERT INTO public.top_entries (rank, student_id) VALUES
  (1, 'aaaaaaaa-0005-0005-0005-000000000005'),  -- Hassan
  (2, 'aaaaaaaa-0003-0003-0003-000000000003'),  -- Ibrahim
  (3, 'aaaaaaaa-0001-0001-0001-000000000001')   -- Yusuf
ON CONFLICT (rank) DO UPDATE SET student_id = EXCLUDED.student_id;

-- ── 7. ANNOUNCEMENTS ─────────────────────────────────────────
INSERT INTO public.announcements (title, body, date) VALUES
  (
    'زيارة الشيخ الفاضل أحمد الأزهري',
    'يسعدنا الإعلان عن زيارة الشيخ الفاضل أحمد الأزهري يوم الجمعة 2 مايو. ستُقام جلسة خاصة للتلاوة والحفظ مفتوحة لجميع الطلاب وأولياء الأمور.',
    '2026-04-30'
  ),
  (
    'Concours de récitation du Coran',
    'Un concours de récitation est organisé le 15 mai. Les inscriptions sont ouvertes jusqu''au 10 mai. Tous les niveaux sont acceptés — venez montrer vos progrès !',
    '2026-05-02'
  ),
  (
    'Fermeture exceptionnelle — Aïd Al-Adha',
    'L''école sera fermée du 6 au 9 juin à l''occasion de l''Aïd Al-Adha. Les cours reprendront normalement le lundi 10 juin. Aïd Moubarak à tous !',
    '2026-05-05'
  )
ON CONFLICT DO NOTHING;

-- ── 8. EXAM ──────────────────────────────────────────────────
INSERT INTO public.exams (id, title, professor_id, date) VALUES
  (
    'eeeeeeee-0001-0001-0001-000000000001',
    'اختبار سورة الفاتحة',
    '11111111-1111-1111-1111-111111111111',
    '2026-04-20'
  )
ON CONFLICT (id) DO NOTHING;

-- ── 9. QCM QUESTIONS ─────────────────────────────────────────
INSERT INTO public.qcm_questions (id, exam_id, text, correct_option_id, position) VALUES
  ('cccccccc-0001-0001-0001-000000000001', 'eeeeeeee-0001-0001-0001-000000000001', 'كم عدد آيات سورة الفاتحة؟',          'b', 0),
  ('cccccccc-0002-0002-0002-000000000002', 'eeeeeeee-0001-0001-0001-000000000001', 'ما معنى كلمة "الحمد"؟',              'a', 1),
  ('cccccccc-0003-0003-0003-000000000003', 'eeeeeeee-0001-0001-0001-000000000001', 'سورة الفاتحة هي السورة رقم كم في القرآن الكريم؟', 'a', 2)
ON CONFLICT (id) DO NOTHING;

-- ── 10. QCM OPTIONS ──────────────────────────────────────────
INSERT INTO public.qcm_options (id, question_id, text) VALUES
  -- Q1: عدد الآيات
  ('a', 'cccccccc-0001-0001-0001-000000000001', '5 آيات'),
  ('b', 'cccccccc-0001-0001-0001-000000000001', '7 آيات'),
  ('c', 'cccccccc-0001-0001-0001-000000000001', '6 آيات'),
  ('d', 'cccccccc-0001-0001-0001-000000000001', '8 آيات'),
  -- Q2: معنى الحمد
  ('a', 'cccccccc-0002-0002-0002-000000000002', 'الشكر والثناء'),
  ('b', 'cccccccc-0002-0002-0002-000000000002', 'الدعاء'),
  ('c', 'cccccccc-0002-0002-0002-000000000002', 'الصلاة'),
  ('d', 'cccccccc-0002-0002-0002-000000000002', 'القراءة'),
  -- Q3: رقم السورة
  ('a', 'cccccccc-0003-0003-0003-000000000003', 'السورة الأولى'),
  ('b', 'cccccccc-0003-0003-0003-000000000003', 'السورة الثانية'),
  ('c', 'cccccccc-0003-0003-0003-000000000003', 'السورة الثالثة'),
  ('d', 'cccccccc-0003-0003-0003-000000000003', 'السورة الرابعة')
ON CONFLICT (id, question_id) DO NOTHING;

-- ── 11. EXAM RESULTS ─────────────────────────────────────────
INSERT INTO public.exam_results (exam_id, student_id, answers, score, correct_count, total_count, date_taken) VALUES
  (
    'eeeeeeee-0001-0001-0001-000000000001',
    'aaaaaaaa-0001-0001-0001-000000000001',  -- Yusuf: 3/3
    '{
      "cccccccc-0001-0001-0001-000000000001": "b",
      "cccccccc-0002-0002-0002-000000000002": "a",
      "cccccccc-0003-0003-0003-000000000003": "a"
    }'::jsonb,
    100, 3, 3, '2026-04-22'
  ),
  (
    'eeeeeeee-0001-0001-0001-000000000001',
    'aaaaaaaa-0003-0003-0003-000000000003',  -- Ibrahim: 2/3
    '{
      "cccccccc-0001-0001-0001-000000000001": "b",
      "cccccccc-0002-0002-0002-000000000002": "a",
      "cccccccc-0003-0003-0003-000000000003": "b"
    }'::jsonb,
    67, 2, 3, '2026-04-23'
  )
ON CONFLICT DO NOTHING;
