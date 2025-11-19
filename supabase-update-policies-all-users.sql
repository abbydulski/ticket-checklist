-- Update RLS policies to allow all users to see and work on all tickets
-- Run this in your Supabase SQL Editor

-- First, drop existing policies
DROP POLICY IF EXISTS "Users can view their own tickets" ON tickets;
DROP POLICY IF EXISTS "Users can insert their own tickets" ON tickets;
DROP POLICY IF EXISTS "Users can update their own tickets" ON tickets;
DROP POLICY IF EXISTS "Users can view steps for their tickets" ON ticket_steps;
DROP POLICY IF EXISTS "Users can insert steps for their tickets" ON ticket_steps;
DROP POLICY IF EXISTS "Users can update steps for their tickets" ON ticket_steps;

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

-- Keep DELETE restricted to ticket creators only
-- (This policy should already exist from supabase-delete-policies.sql)
-- If not, uncomment the line below:
-- CREATE POLICY "Users can delete their own tickets" ON tickets FOR DELETE USING (auth.uid() = user_id);

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

-- Keep DELETE restricted to ticket creators only
-- (This policy should already exist from supabase-delete-policies.sql)
-- If not, uncomment the lines below:
-- CREATE POLICY "Users can delete steps for their tickets" ON ticket_steps FOR DELETE 
-- USING (
--   EXISTS (
--     SELECT 1 FROM tickets 
--     WHERE tickets.id = ticket_steps.ticket_id 
--     AND tickets.user_id = auth.uid()
--   )
-- );

