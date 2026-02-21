-- ============================================================
-- MedRemind Database Migration
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================


-- ─── 1. PROFILES TABLE ───────────────────────────────────────────────────────
-- Extends Supabase auth.users with app-specific fields

CREATE TABLE IF NOT EXISTS public.profiles (
  id                UUID        REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name         TEXT,
  role              TEXT        DEFAULT 'both' CHECK (role IN ('patient', 'caretaker', 'both')),
  caretaker_email   TEXT,
  notification_time TIME        DEFAULT '20:00:00',
  created_at        TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at        TIMESTAMPTZ DEFAULT NOW() NOT NULL
);


-- ─── 2. MEDICATIONS TABLE ─────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.medications (
  id            UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID    REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name          TEXT    NOT NULL CHECK (char_length(name) <= 100),
  dosage        TEXT    NOT NULL CHECK (char_length(dosage) <= 50),
  frequency     TEXT    DEFAULT 'daily' CHECK (frequency IN (
                          'daily',
                          'twice_daily',
                          'three_times_daily',
                          'weekly'
                        )),
  reminder_time TIME,
  is_active     BOOLEAN DEFAULT TRUE NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL
);


-- ─── 3. MEDICATION LOGS TABLE ─────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.medication_logs (
  id             UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  medication_id  UUID    REFERENCES public.medications(id) ON DELETE CASCADE NOT NULL,
  user_id        UUID    REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  taken_at       TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  scheduled_date DATE    NOT NULL,
  status         TEXT    NOT NULL CHECK (status IN ('taken', 'missed', 'pending')),
  created_at     TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Prevent duplicate logs: one entry per medication per user per day
  UNIQUE(medication_id, user_id, scheduled_date)
);


-- ─── 4. INDEXES ───────────────────────────────────────────────────────────────
-- Speed up the most common queries

-- Fetch all medications for a user
CREATE INDEX IF NOT EXISTS idx_medications_user_id
  ON public.medications(user_id);

-- Fetch active medications for a user (used in dashboard)
CREATE INDEX IF NOT EXISTS idx_medications_user_active
  ON public.medications(user_id, is_active);

-- Fetch today's logs for a user (used on every page load)
CREATE INDEX IF NOT EXISTS idx_logs_user_date
  ON public.medication_logs(user_id, scheduled_date);

-- Fetch logs by medication (used in edge function)
CREATE INDEX IF NOT EXISTS idx_logs_medication_id
  ON public.medication_logs(medication_id);

-- Filter logs by status (used in edge function + reports)
CREATE INDEX IF NOT EXISTS idx_logs_status
  ON public.medication_logs(status);


-- ─── 5. ROW LEVEL SECURITY ────────────────────────────────────────────────────
-- Users can ONLY access their own data — enforced at DB level

ALTER TABLE public.profiles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medications     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medication_logs ENABLE ROW LEVEL SECURITY;


-- ─── 6. RLS POLICIES: PROFILES ───────────────────────────────────────────────

CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "profiles_insert_own"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);


-- ─── 7. RLS POLICIES: MEDICATIONS ────────────────────────────────────────────

CREATE POLICY "medications_select_own"
  ON public.medications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "medications_insert_own"
  ON public.medications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "medications_update_own"
  ON public.medications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "medications_delete_own"
  ON public.medications FOR DELETE
  USING (auth.uid() = user_id);


-- ─── 8. RLS POLICIES: MEDICATION LOGS ────────────────────────────────────────

CREATE POLICY "logs_select_own"
  ON public.medication_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "logs_insert_own"
  ON public.medication_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "logs_update_own"
  ON public.medication_logs FOR UPDATE
  USING (auth.uid() = user_id);


-- ─── 9. AUTO-UPDATE updated_at TRIGGER ───────────────────────────────────────
-- Automatically sets updated_at whenever a row is updated

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER medications_updated_at
  BEFORE UPDATE ON public.medications
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


-- ─── 10. AUTO-CREATE PROFILE ON SIGNUP ───────────────────────────────────────
-- When a user signs up via Supabase Auth, automatically create their profile

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    'both'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ─── 11. SCHEDULE EDGE FUNCTION (optional) ───────────────────────────────────
-- Requires pg_cron extension enabled in Supabase Dashboard
-- Dashboard → Database → Extensions → enable pg_cron
-- Then run this to check for missed medications every hour:

-- SELECT cron.schedule(
--   'check-missed-meds',
--   '0 * * * *',
--   $$
--     SELECT net.http_post(
--       url     := 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/check-missed-medications',
--       headers := '{"Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb
--     );
--   $$
-- );
