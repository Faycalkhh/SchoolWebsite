-- Add date_of_birth column to students (nullable, keeps existing age as fallback)
ALTER TABLE public.students
  ADD COLUMN IF NOT EXISTS date_of_birth DATE;
