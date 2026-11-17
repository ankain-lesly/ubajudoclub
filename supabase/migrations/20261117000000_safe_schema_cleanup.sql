-- ==============================================================================
-- Migration: Safe Schema Cleanup, Column Standardization & View Refresh
-- UBa Judo Club (Production Supabase Project: yumqjwowofgwsxnbedwo)
-- ==============================================================================

BEGIN;

-- 1. Drop dependent views to allow column alterations
DROP VIEW IF EXISTS public.members_with_stats;
DROP VIEW IF EXISTS public.sessions_with_turnout;

-- 2. Clean training_sessions
-- Drop stale physical counter and redundant session_date (keep 'coach')
ALTER TABLE public.training_sessions DROP COLUMN IF EXISTS attended_count;
ALTER TABLE public.training_sessions DROP COLUMN IF EXISTS session_date;

-- 3. Clean members
-- Drop redundant current_belt, belt_awarded_date and stale physical aggregates
ALTER TABLE public.members DROP COLUMN IF EXISTS current_belt;
ALTER TABLE public.members DROP COLUMN IF EXISTS belt_awarded_date;
ALTER TABLE public.members DROP COLUMN IF EXISTS sessions_total;
ALTER TABLE public.members DROP COLUMN IF EXISTS sessions_since_promotion;
ALTER TABLE public.members DROP COLUMN IF EXISTS last_attended;
ALTER TABLE public.members DROP COLUMN IF EXISTS last_promotion_date;

-- Standardize timestamp column on members
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'members' AND column_name = 'created_date'
  ) THEN
    ALTER TABLE public.members RENAME COLUMN created_date TO created_at;
  END IF;
END $$;

-- 4. Clean join_requests
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'join_requests' AND column_name = 'created_date'
  ) THEN
    ALTER TABLE public.join_requests RENAME COLUMN created_date TO created_at;
  END IF;
END $$;

ALTER TABLE public.join_requests ADD COLUMN IF NOT EXISTS updated_at timestamptz not null default now();

-- 5. Clean events
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS updated_at timestamptz not null default now();

-- 6. Drop legacy unused empty tables (verified 0 rows)
DROP TABLE IF EXISTS public.attendance CASCADE;
DROP TABLE IF EXISTS public.promotions CASCADE;

-- 7. Recreate authoritative members_with_stats view
CREATE OR REPLACE VIEW public.members_with_stats AS
SELECT
  m.id,
  m.profile_id,
  m.full_name,
  m.matricule,
  m.program,
  m.belt_rank,
  m.status,
  m.joined_on,
  m.phone,
  m.email,
  m.notes,
  m.created_at,
  m.updated_at,
  COALESCE(COUNT(a.id), 0)::int AS sessions_total,
  COALESCE(COUNT(a.id) FILTER (
    WHERE s.start_time >= COALESCE(m.joined_on, '1970-01-01'::date)
  ), 0)::int AS sessions_since_promotion,
  MAX(s.start_time) AS last_attended
FROM public.members m
LEFT JOIN public.attendances a ON a.member_id = m.id
LEFT JOIN public.training_sessions s ON s.id = a.session_id
GROUP BY m.id;

-- 8. Recreate authoritative sessions_with_turnout view
CREATE OR REPLACE VIEW public.sessions_with_turnout AS
SELECT
  s.id,
  s.start_time,
  s.end_time,
  s.focus,
  s.coach,
  s.notes,
  s.created_at,
  s.updated_at,
  COALESCE(COUNT(a.id), 0)::int AS attended_count
FROM public.training_sessions s
LEFT JOIN public.attendances a ON a.session_id = s.id
GROUP BY s.id;

COMMIT;
