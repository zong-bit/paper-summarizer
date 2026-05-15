-- ============================================
-- Paper Summarizer — Supabase Database Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan TEXT NOT NULL CHECK (plan IN ('free', 'pro')),
  gumroad_order_id TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'refunded')),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tokens table (for pro users)
CREATE TABLE IF NOT EXISTS tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token TEXT NOT NULL UNIQUE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan TEXT NOT NULL DEFAULT 'pro' CHECK (plan IN ('free', 'pro')),
  max_requests INT NOT NULL DEFAULT 100,
  used_requests INT NOT NULL DEFAULT 0,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Row Level Security (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tokens ENABLE ROW LEVEL SECURITY;

-- Users: users can read their own data
CREATE POLICY "Users can read own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Subscriptions: users can read their own, admins can all
CREATE POLICY "Users can read own subscriptions"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Tokens: users can read their own, admins can all
CREATE POLICY "Users can read own tokens"
  ON tokens FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own tokens"
  ON tokens FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- Triggers: auto-create user profile on signup
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'name')
  ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email,
        name = COALESCE(EXCLUDED.name, users.name),
        updated_at = NOW();

  -- Free subscription by default
  INSERT INTO public.subscriptions (user_id, plan, status)
  VALUES (NEW.id, 'free', 'active')
  ON CONFLICT DO NOTHING;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- Helper functions
-- ============================================

-- Get current user profile
CREATE OR REPLACE FUNCTION public.get_current_user_profile()
RETURNS SETOF users
LANGUAGE sql
SECURITY DEFINER SET search_path = public
AS $$
  SELECT * FROM users WHERE id = auth.uid();
$$;

-- Get user's active subscription
CREATE OR REPLACE FUNCTION public.get_user_subscription(p_user_id UUID)
RETURNS SETOF subscriptions
LANGUAGE sql
SECURITY DEFINER SET search_path = public
AS $$
  SELECT * FROM subscriptions
  WHERE user_id = p_user_id AND status = 'active'
  ORDER BY created_at DESC LIMIT 1;
$$;

-- Get user's active tokens
CREATE OR REPLACE FUNCTION public.get_user_active_tokens(p_user_id UUID)
RETURNS SETOF tokens
LANGUAGE sql
SECURITY DEFINER SET search_path = public
AS $$
  SELECT * FROM tokens
  WHERE user_id = p_user_id
    AND (expires_at IS NULL OR expires_at > NOW())
  ORDER BY created_at DESC;
$$;
