-- Add DELETE policies for tickets and ticket_steps tables

-- Allow users to delete their own tickets
CREATE POLICY "Users can delete their own tickets" 
ON tickets FOR DELETE 
USING (auth.uid() = user_id);

-- Allow users to delete steps for their tickets
CREATE POLICY "Users can delete steps for their tickets" 
ON ticket_steps FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM tickets 
    WHERE tickets.id = ticket_steps.ticket_id 
    AND tickets.user_id = auth.uid()
  )
);

