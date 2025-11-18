import { supabase } from './supabase';

export interface ChecklistStep {
  id: number;
  title: string;
  description: string;
}

// Create a new ticket
export async function createTicket(
  ticketName: string,
  steps: ChecklistStep[],
  userId?: string,
  userEmail?: string
) {
  try {
    console.log('Creating ticket:', ticketName);

    // Insert ticket
    const { data: ticket, error: ticketError } = await supabase
      .from('tickets')
      .insert({
        ticket_name: ticketName,
        total_steps: steps.length,
        completed_steps: 0,
        is_complete: false,
        user_id: userId,
        created_by_email: userEmail,
      })
      .select()
      .single();

    if (ticketError) {
      console.error('Ticket creation error:', ticketError);
      throw ticketError;
    }

    console.log('Ticket created:', ticket);

    // Insert all steps
    const ticketSteps = steps.map((step) => ({
      ticket_id: ticket.id,
      step_id: step.id,
      step_title: step.title,
      step_description: step.description,
      is_completed: false,
    }));

    const { error: stepsError } = await supabase
      .from('ticket_steps')
      .insert(ticketSteps);

    if (stepsError) {
      console.error('Steps creation error:', stepsError);
      throw stepsError;
    }

    console.log('All steps created successfully');
    return { success: true, ticketId: ticket.id };
  } catch (error) {
    console.error('Error creating ticket:', error);
    return { success: false, error };
  }
}

// Update step completion status
export async function updateStepCompletion(
  ticketId: string,
  stepId: number,
  isCompleted: boolean
) {
  try {
    console.log('Updating step:', { ticketId, stepId, isCompleted });

    const { error } = await supabase
      .from('ticket_steps')
      .update({
        is_completed: isCompleted,
        completed_at: isCompleted ? new Date().toISOString() : null,
      })
      .eq('ticket_id', ticketId)
      .eq('step_id', stepId);

    if (error) {
      console.error('Step update error:', error);
      throw error;
    }

    console.log('Step updated successfully');

    // Update ticket's completed_steps count
    await updateTicketProgress(ticketId);

    return { success: true };
  } catch (error) {
    console.error('Error updating step:', error);
    return { success: false, error };
  }
}

// Update ticket progress
async function updateTicketProgress(ticketId: string) {
  try {
    // Count completed steps
    const { data: steps, error: stepsError } = await supabase
      .from('ticket_steps')
      .select('is_completed')
      .eq('ticket_id', ticketId);

    if (stepsError) throw stepsError;

    const completedCount = steps.filter((s) => s.is_completed).length;
    const totalSteps = steps.length;
    const isComplete = completedCount === totalSteps;

    // Update ticket
    const { error: updateError } = await supabase
      .from('tickets')
      .update({
        completed_steps: completedCount,
        is_complete: isComplete,
        completed_at: isComplete ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', ticketId);

    if (updateError) throw updateError;

    return { success: true };
  } catch (error) {
    console.error('Error updating ticket progress:', error);
    return { success: false, error };
  }
}

// Get ticket with all steps
export async function getTicket(ticketId: string) {
  try {
    const { data: ticket, error: ticketError } = await supabase
      .from('tickets')
      .select('*')
      .eq('id', ticketId)
      .single();

    if (ticketError) throw ticketError;

    const { data: steps, error: stepsError } = await supabase
      .from('ticket_steps')
      .select('*')
      .eq('ticket_id', ticketId)
      .order('step_id', { ascending: true });

    if (stepsError) throw stepsError;

    return { success: true, ticket, steps };
  } catch (error) {
    console.error('Error getting ticket:', error);
    return { success: false, error };
  }
}

// Get all tickets (for history view)
export async function getAllTickets() {
  try {
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return { success: true, tickets: data };
  } catch (error) {
    console.error('Error getting tickets:', error);
    return { success: false, error };
  }
}

// Get incomplete tickets for current user
export async function getIncompleteTickets() {
  try {
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .eq('is_complete', false)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return { success: true, tickets: data };
  } catch (error) {
    console.error('Error getting incomplete tickets:', error);
    return { success: false, error };
  }
}

