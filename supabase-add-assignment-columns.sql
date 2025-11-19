-- Add assignment columns to tickets table
-- Run this in your Supabase SQL Editor

-- Add assigned_to_user_id column
ALTER TABLE tickets 
ADD COLUMN IF NOT EXISTS assigned_to_user_id UUID REFERENCES auth.users(id);

-- Add assigned_to_email column
ALTER TABLE tickets 
ADD COLUMN IF NOT EXISTS assigned_to_email TEXT;

-- Create index for faster queries on assigned tickets
CREATE INDEX IF NOT EXISTS idx_tickets_assigned_to_user_id 
ON tickets(assigned_to_user_id);

