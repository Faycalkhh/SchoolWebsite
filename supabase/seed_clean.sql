-- ============================================================
--  Nur Al-Quran — Clean Seed
--  Run AFTER creating the 5 users in Supabase Dashboard.
-- ============================================================

DO $$
DECLARE
  prof_id   UUID;
  sarah_id  UUID;
  par1_id   UUID;
  par2_id   UUID;
  par3_id   UUID;
  s1 UUID := gen_random_uuid();
  s2 UUID := gen_random_uuid();
  s3 UUID := gen_random_uuid();
  s4 UUID := gen_random_uuid();
  s5 UUID := gen_random_uuid();
  exam1  UUID := gen_random_uuid();
  q1 UUID := gen_random_uuid();
  q2 UUID := gen_random_uuid();
  q3 UUID := gen_random_uuid();
BEGIN

  -- ── Get real auth UUIDs ──────────────────────────────────────
  SELECT id INTO prof_id  FROM auth.users WHERE email = 'prof@nur.com';
  SELECT id INTO sarah_id FROM auth.users WHERE email = 'sarah@nur.com';
  SELECT id INTO par1_id  FROM auth.users WHERE email = 'parent@nur.com';
  SELECT id INTO par2_id  FROM auth.users WHERE email = 'fatima@nur.com';
  SELECT id INTO par3_id  FROM auth.users WHERE email = 'omar@nur.com';

  IF prof_id IS NULL OR sarah_id IS NULL OR par1_id IS NULL OR par2_id IS NULL OR par3_id IS NULL THEN
    RAISE EXCEPTION 'One or more auth users not found. Create them in the Dashboard first.';
  END IF;

  -- ── Profiles ─────────────────────────────────────────────────
  INSERT INTO public.profiles (id, name, email, role, specialty) VALUES
    (prof_id,  'Mohammed Hassan', 'prof@nur.com',   'professor', 'Tajweed & Hifz'),
    (sarah_id, 'Sarah Benali',    'sarah@nur.com',  'professor', 'Langue Arabe'),
    (par1_id,  'Ahmed Karim',     'parent@nur.com', 'parent',    NULL),
    (par2_id,  'Fatima Mansour',  'fatima@nur.com', 'parent',    NULL),
    (par3_id,  'Omar Rachid',     'omar@nur.com',   'parent',    NULL)
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name, email = EXCLUDED.email,
    role = EXCLUDED.role, specialty = EXCLUDED.specialty;

  -- ── Students ─────────────────────────────────────────────────
  INSERT INTO public.students (id, name, age, level, parent_id) VALUES
    (s1, 'Yusuf Karim',    10, 'Intermédiaire', par1_id),
    (s2, 'Maryam Karim',    8, 'Débutant',       par1_id),
    (s3, 'Ibrahim Mansour',12, 'Avancé',          par2_id),
    (s4, 'Aisha Rachid',    9, 'Intermédiaire',  par3_id),
    (s5, 'Hassan Rachid',  11, 'Hifz',            par3_id);

  -- ── Sessions ─────────────────────────────────────────────────
  INSERT INTO public.sessions (student_id, professor_id, date, present, discipline, memorization, comment) VALUES
    (s1, prof_id,  '2026-04-28', true,  'excellent',    'Al-Fatiha complète',   'Très bonne récitation'),
    (s1, prof_id,  '2026-04-21', true,  'bon',          'Al-Baqara 1-5',        'Bonne progression'),
    (s1, prof_id,  '2026-04-14', true,  'bon',          'Al-Baqara 1-3',        'Continue les efforts'),
    (s2, sarah_id, '2026-04-28', true,  'bon',          'Alphabets arabes',     'Apprend vite'),
    (s2, sarah_id, '2026-04-21', false, 'bon',          '',                     'Absent excusé'),
    (s2, sarah_id, '2026-04-14', true,  'passable',     'Lettres de base',      'Besoin de révision'),
    (s3, prof_id,  '2026-04-28', true,  'excellent',    'Sourate Yassin',       'Excellent niveau'),
    (s3, prof_id,  '2026-04-21', true,  'excellent',    'Al-Baqara 1-20',       'Mémorisation remarquable'),
    (s3, prof_id,  '2026-04-14', true,  'excellent',    'Al-Baqara 1-10',       'Progrès constants'),
    (s4, sarah_id, '2026-04-28', true,  'passable',     'Al-Fatiha',            'Besoin de révision'),
    (s4, sarah_id, '2026-04-21', true,  'bon',          'Al-Ikhlas',            'Amélioration visible'),
    (s5, prof_id,  '2026-04-28', true,  'excellent',    'Juz Amma complet',     'Hafiz en progression'),
    (s5, prof_id,  '2026-04-21', true,  'excellent',    'Al-Mulk',              'Mémorisation parfaite');

  -- ── Memorization maps ────────────────────────────────────────
  INSERT INTO public.student_memorization (student_id, surah_number, status) VALUES
    (s1, 1,   'memorized'), (s1, 2,   'in_progress'),
    (s1, 112, 'memorized'), (s1, 113, 'memorized'), (s1, 114, 'memorized'),
    (s3, 1,   'memorized'), (s3, 2,   'memorized'),
    (s3, 36,  'memorized'), (s3, 67,  'memorized'),
    (s5, 78,  'memorized'), (s5, 79,  'memorized'), (s5, 80,  'memorized'),
    (s5, 81,  'memorized'), (s5, 82,  'memorized'), (s5, 83,  'memorized'),
    (s5, 84,  'memorized'), (s5, 85,  'memorized'), (s5, 86,  'memorized'),
    (s5, 87,  'memorized'), (s5, 88,  'memorized'), (s5, 89,  'memorized'),
    (s5, 90,  'memorized'), (s5, 91,  'memorized'), (s5, 92,  'memorized'),
    (s5, 93,  'memorized'), (s5, 94,  'memorized'), (s5, 95,  'memorized'),
    (s5, 96,  'memorized'), (s5, 97,  'memorized'), (s5, 98,  'memorized'),
    (s5, 99,  'memorized'), (s5, 100, 'memorized'), (s5, 101, 'memorized'),
    (s5, 102, 'memorized'), (s5, 103, 'memorized'), (s5, 104, 'memorized'),
    (s5, 105, 'memorized'), (s5, 106, 'memorized'), (s5, 107, 'memorized'),
    (s5, 108, 'memorized'), (s5, 109, 'memorized'), (s5, 110, 'memorized'),
    (s5, 111, 'memorized'), (s5, 112, 'memorized'), (s5, 113, 'memorized'),
    (s5, 114, 'memorized');

  -- ── Top 3 ────────────────────────────────────────────────────
  INSERT INTO public.top_entries (rank, student_id) VALUES
    (1, s5), (2, s3), (3, s1)
  ON CONFLICT (rank) DO UPDATE SET student_id = EXCLUDED.student_id;

  -- ── Announcements ────────────────────────────────────────────
  INSERT INTO public.announcements (title, body, date) VALUES
    (
      'زيارة الشيخ الفاضل أحمد الأزهري',
      'يسعدنا الإعلان عن زيارة الشيخ الفاضل أحمد الأزهري يوم الجمعة 2 مايو. ستُقام جلسة خاصة للتلاوة والحفظ مفتوحة لجميع الطلاب وأولياء الأمور.',
      '2026-04-30'
    ),
    (
      'امتحانات نهاية الفصل',
      'تُذكّر إدارة المدرسة جميع الطلاب بأن امتحانات نهاية الفصل ستُقام خلال شهر مايو. يُرجى المراجعة الجيدة.',
      '2026-05-05'
    ),
    (
      'عطلة عيد الفطر',
      'ستكون المدرسة مغلقة خلال عطلة عيد الفطر المبارك. نتمنى لجميع الطلاب وأسرهم عيداً مباركاً سعيداً.',
      '2026-03-28'
    );

  -- ── Exam ─────────────────────────────────────────────────────
  INSERT INTO public.exams (id, title, professor_id, date) VALUES
    (exam1, 'Examen Tajweed — Niveau 1', prof_id, '2026-05-10');

  INSERT INTO public.qcm_questions (id, exam_id, text, correct_option_id, position) VALUES
    (q1, exam1, 'Combien de sourates contient le Coran ?',    'b', 0),
    (q2, exam1, 'Quelle est la première sourate du Coran ?',  'a', 1),
    (q3, exam1, 'Combien de versets contient Al-Fatiha ?',    'c', 2);

  INSERT INTO public.qcm_options (id, question_id, text) VALUES
    ('a', q1, '100'),  ('b', q1, '114'),  ('c', q1, '120'),  ('d', q1, '99'),
    ('a', q2, 'Al-Fatiha'), ('b', q2, 'Al-Baqara'), ('c', q2, 'Al-Ikhlas'), ('d', q2, 'An-Nas'),
    ('a', q3, '5'),    ('b', q3, '6'),    ('c', q3, '7'),    ('d', q3, '8');

END $$;
