-- ============================================================
--  Nur Al-Quran — Load test: 200 mock students with avatars
--  Run AFTER you have at least one parent profile in the DB.
-- ============================================================

DO $$
DECLARE
  parents_arr      UUID[];
  parent_id_pick   UUID;
  i                INT;
  fname            TEXT;
  lname            TEXT;
  full_name        TEXT;
  initials         TEXT;
  color            TEXT;
  svg_text         TEXT;
  photo_data       TEXT;
  student_age      INT;
  student_level    TEXT;

  level_arr        TEXT[] := ARRAY['Débutant', 'Intermédiaire', 'Avancé', 'Hifz'];

  first_names      TEXT[] := ARRAY[
    'Ahmed','Mohamed','Ali','Hassan','Hussein','Omar','Yusuf','Ibrahim','Khalil','Karim',
    'Tarek','Mahmoud','Mostafa','Bilal','Ismail','Younes','Adam','Iyad','Anas','Rayan',
    'Aisha','Fatima','Khadija','Maryam','Zaynab','Asma','Hafsa','Sara','Nour','Lina',
    'Yasmin','Rania','Salma','Dina','Hanane','Imane','Sofia','Rim','Leila','Amira'
  ];

  last_names       TEXT[] := ARRAY[
    'Karim','Mansour','Rachid','Ahmed','Benali','Hassani','Boukhari','Idrissi','Tazi','Alaoui',
    'Berrada','Cherkaoui','Lahlou','Bennani','Sefrioui','Saidi','Khalid','Belkacem','Meliani','Saad'
  ];

  colors           TEXT[] := ARRAY[
    '#2d6a4f','#c9a84c','#52b788','#e85d75','#5d6cc9',
    '#e8a44b','#22577a','#a0522d','#6a4c93','#1a3a2c',
    '#e76f51','#264653','#2a9d8f','#f4a261','#8d99ae'
  ];

BEGIN
  -- Collect all parent IDs
  SELECT array_agg(id) INTO parents_arr FROM public.profiles WHERE role = 'parent';

  IF parents_arr IS NULL OR array_length(parents_arr, 1) = 0 THEN
    RAISE EXCEPTION 'No parent profiles found. Create at least one parent first.';
  END IF;

  FOR i IN 1..200 LOOP
    fname          := first_names[1 + floor(random() * array_length(first_names, 1))::int];
    lname          := last_names[1 + floor(random() * array_length(last_names, 1))::int];
    full_name      := fname || ' ' || lname || ' #' || i;
    initials       := upper(substring(fname, 1, 1) || substring(lname, 1, 1));
    color          := colors[1 + floor(random() * array_length(colors, 1))::int];
    parent_id_pick := parents_arr[1 + floor(random() * array_length(parents_arr, 1))::int];
    student_age    := 5 + floor(random() * 13)::int;
    student_level  := level_arr[1 + floor(random() * array_length(level_arr, 1))::int];

    -- Build a colored SVG avatar with the student's initials
    svg_text :=
      '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">' ||
      '<rect width="100" height="100" fill="' || color || '"/>' ||
      '<text x="50" y="62" font-family="Arial" font-size="40" font-weight="bold" fill="white" text-anchor="middle">' || initials || '</text>' ||
      '</svg>';

    -- Base64-encode the SVG and strip any line breaks
    photo_data := 'data:image/svg+xml;base64,' || replace(encode(svg_text::bytea, 'base64'), E'\n', '');

    INSERT INTO public.students (name, age, level, parent_id, photo)
    VALUES (full_name, student_age, student_level, parent_id_pick, photo_data);
  END LOOP;

  RAISE NOTICE 'Inserted 200 mock students.';
END $$;

-- ── Verify ───────────────────────────────────────────────────
SELECT
  (SELECT COUNT(*) FROM public.students)                                       AS total_students,
  (SELECT COUNT(*) FROM public.students WHERE photo IS NOT NULL)               AS with_photo,
  (SELECT COUNT(DISTINCT parent_id) FROM public.students)                      AS distinct_parents,
  (SELECT COUNT(*) FROM public.students WHERE level = 'Hifz')                  AS hifz_count;
