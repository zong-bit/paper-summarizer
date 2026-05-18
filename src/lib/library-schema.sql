-- ============================================
-- Paper Summarizer — Library Table
-- Run this in Supabase SQL Editor
-- ============================================

CREATE TABLE IF NOT EXISTS library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'paste',
  source_url TEXT,
  domain TEXT NOT NULL DEFAULT 'general',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE library ENABLE ROW LEVEL SECURITY;

-- Users can read, insert, update, and delete their own library items
CREATE POLICY "Users can read own library"
  ON library FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own library"
  ON library FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own library"
  ON library FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own library"
  ON library FOR DELETE
  USING (auth.uid() = user_id);

-- Index for faster queries by user
CREATE INDEX idx_library_user_id ON library(user_id);
CREATE INDEX idx_library_created_at ON library(created_at DESC);
