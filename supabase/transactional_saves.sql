-- ============================================================
--  Transactional replacements for the two "delete then insert" saves.
--
--  Without these, a delete that succeeds followed by a failed insert wipes the
--  data with nothing to report it — losing the weekly podium, or a student's
--  entire memorization map. Inside a function both run in one transaction, so a
--  failed insert rolls the delete back.
--
--  Run this whole file in the Supabase SQL Editor. Safe to run repeatedly.
--  SECURITY INVOKER (the default) keeps RLS applied to the caller, so only
--  professors can write, exactly as the table policies already require.
-- ============================================================

-- ── Replace the whole top-3 podium ───────────────────────────
-- entries: [{ "rank": 1, "student_id": "<uuid>" }, ...]
CREATE OR REPLACE FUNCTION public.set_top_entries(entries JSONB)
RETURNS VOID
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.top_entries;

  IF jsonb_array_length(entries) > 0 THEN
    INSERT INTO public.top_entries (rank, student_id)
    SELECT (e->>'rank')::INTEGER, (e->>'student_id')::UUID
    FROM jsonb_array_elements(entries) e;
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION public.set_top_entries(JSONB) TO authenticated;

-- ── Replace one student's memorization map ───────────────────
-- entries: [{ "surah_number": 1, "status": "memorized" }, ...]
CREATE OR REPLACE FUNCTION public.set_student_memorization(p_student_id UUID, entries JSONB)
RETURNS VOID
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.student_memorization WHERE student_id = p_student_id;

  IF jsonb_array_length(entries) > 0 THEN
    INSERT INTO public.student_memorization (student_id, surah_number, status)
    SELECT p_student_id, (e->>'surah_number')::SMALLINT, e->>'status'
    FROM jsonb_array_elements(entries) e;
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION public.set_student_memorization(UUID, JSONB) TO authenticated;
