-- =====================================================
-- Google Calendar Integration Setup
-- =====================================================
-- This script adds the necessary database schema for Google Calendar integration
-- Run this in your Supabase SQL Editor

-- =====================================================
-- 1. Add calendar columns to tickets table
-- =====================================================

-- Add calendar event columns to tickets
ALTER TABLE tickets 
ADD COLUMN IF NOT EXISTS calendar_event_id TEXT,
ADD COLUMN IF NOT EXISTS calendar_event_summary TEXT,
ADD COLUMN IF NOT EXISTS calendar_event_start TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS calendar_event_link TEXT,
ADD COLUMN IF NOT EXISTS auto_created BOOLEAN DEFAULT FALSE;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_tickets_calendar_event_id 
ON tickets(calendar_event_id);

CREATE INDEX IF NOT EXISTS idx_tickets_auto_created 
ON tickets(auto_created);

-- =====================================================
-- 2. Create user_google_tokens table
-- =====================================================

-- Table to store Google OAuth tokens for each user
CREATE TABLE IF NOT EXISTS user_google_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  token_expiry TIMESTAMPTZ,
  calendar_id TEXT DEFAULT 'primary',
  scope TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create index for faster user lookups
CREATE INDEX IF NOT EXISTS idx_user_google_tokens_user_id 
ON user_google_tokens(user_id);

-- =====================================================
-- 3. Row Level Security (RLS) Policies
-- =====================================================

-- Enable RLS on user_google_tokens
ALTER TABLE user_google_tokens ENABLE ROW LEVEL SECURITY;

-- Users can only view their own tokens
CREATE POLICY "Users can view own google tokens" 
ON user_google_tokens FOR SELECT 
USING (auth.uid() = user_id);

-- Users can only insert their own tokens
CREATE POLICY "Users can insert own google tokens" 
ON user_google_tokens FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can only update their own tokens
CREATE POLICY "Users can update own google tokens" 
ON user_google_tokens FOR UPDATE 
USING (auth.uid() = user_id);

-- Users can only delete their own tokens
CREATE POLICY "Users can delete own google tokens" 
ON user_google_tokens FOR DELETE 
USING (auth.uid() = user_id);

-- =====================================================
-- 4. Function to update updated_at timestamp
-- =====================================================

CREATE OR REPLACE FUNCTION update_user_google_tokens_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at
DROP TRIGGER IF EXISTS user_google_tokens_updated_at ON user_google_tokens;
CREATE TRIGGER user_google_tokens_updated_at
  BEFORE UPDATE ON user_google_tokens
  FOR EACH ROW
  EXECUTE FUNCTION update_user_google_tokens_updated_at();

-- =====================================================
-- Verification Queries
-- =====================================================

-- Check if calendar columns were added to tickets
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'tickets' 
AND column_name IN ('calendar_event_id', 'calendar_event_summary', 'calendar_event_start', 'calendar_event_link', 'auto_created');

-- Check if user_google_tokens table exists
SELECT table_name 
FROM information_schema.tables 
WHERE table_name = 'user_google_tokens';

-- Check RLS policies
SELECT policyname 
FROM pg_policies 
WHERE tablename = 'user_google_tokens';

