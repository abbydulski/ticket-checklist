import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database tables
export interface Ticket {
  id: string;
  ticket_name: string;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
  is_complete: boolean;
  total_steps: number;
  completed_steps: number;
  user_id: string | null;
  created_by_email: string | null;
  assigned_to_user_id: string | null;
  assigned_to_email: string | null;
  calendar_event_id: string | null;
  calendar_event_summary: string | null;
  calendar_event_start: string | null;
  calendar_event_link: string | null;
  auto_created: boolean | null;
}

export interface TicketStep {
  id: string;
  ticket_id: string;
  step_id: number;
  step_title: string;
  step_description: string | null;
  is_completed: boolean;
  completed_at: string | null;
  created_at: string;
}

