-- Update RLS policies to allow all users to see and work on all tickets
-- Run this in your Supabase SQL Editor

-- First, drop existing policies (both old and new names)
DROP POLICY IF EXISTS "Users can view their own tickets" ON tickets;
DROP POLICY IF EXISTS "Users can insert their own tickets" ON tickets;
DROP POLICY IF EXISTS "Users can update their own tickets" ON tickets;
DROP POLICY IF EXISTS "Users can delete their own tickets" ON tickets;
DROP POLICY IF EXISTS "All users can view all tickets" ON tickets;
DROP POLICY IF EXISTS "All users can create tickets" ON tickets;
DROP POLICY IF EXISTS "All users can update all tickets" ON tickets;
DROP POLICY IF EXISTS "All users can delete all tickets" ON tickets;

DROP POLICY IF EXISTS "Users can view steps for their tickets" ON ticket_steps;
DROP POLICY IF EXISTS "Users can insert steps for their tickets" ON ticket_steps;
DROP POLICY IF EXISTS "Users can update steps for their tickets" ON ticket_steps;
DROP POLICY IF EXISTS "Users can delete steps for their tickets" ON ticket_steps;
DROP POLICY IF EXISTS "All users can view all ticket steps" ON ticket_steps;
DROP POLICY IF EXISTS "All users can insert ticket steps" ON ticket_steps;
DROP POLICY IF EXISTS "All users can update all ticket steps" ON ticket_steps;
DROP POLICY IF EXISTS "All users can delete all ticket steps" ON ticket_steps;

-- TICKETS TABLE POLICIES

-- Allow all authenticated users to view ALL tickets
CREATE POLICY "All users can view all tickets" 
ON tickets FOR SELECT 
USING (auth.role() = 'authenticated');

-- Allow all authenticated users to create tickets
CREATE POLICY "All users can create tickets" 
ON tickets FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- Allow all authenticated users to update ALL tickets (for reassignment and progress)
CREATE POLICY "All users can update all tickets"
ON tickets FOR UPDATE
USING (auth.role() = 'authenticated');

-- Allow all authenticated users to delete ANY ticket
CREATE POLICY "All users can delete all tickets"
ON tickets FOR DELETE
USING (auth.role() = 'authenticated');

-- TICKET_STEPS TABLE POLICIES

-- Allow all authenticated users to view ALL ticket steps
CREATE POLICY "All users can view all ticket steps" 
ON ticket_steps FOR SELECT 
USING (auth.role() = 'authenticated');

-- Allow all authenticated users to insert ticket steps
CREATE POLICY "All users can insert ticket steps" 
ON ticket_steps FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- Allow all authenticated users to update ALL ticket steps
CREATE POLICY "All users can update all ticket steps"
ON ticket_steps FOR UPDATE
USING (auth.role() = 'authenticated');

-- Allow all authenticated users to delete ANY ticket steps
CREATE POLICY "All users can delete all ticket steps"
ON ticket_steps FOR DELETE
USING (auth.role() = 'authenticated');

