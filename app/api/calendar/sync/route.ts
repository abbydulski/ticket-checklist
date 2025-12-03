import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { createClient } from '@supabase/supabase-js';
import { CHECKLIST_STEPS } from '@/lib/constants';

export async function POST(request: NextRequest) {
  try {
    // Check if required environment variables are configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      return NextResponse.json(
        { error: 'Google OAuth not configured' },
        { status: 500 }
      );
    }

    const { userId, userEmail } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Create server-side Supabase client with service role key (bypasses RLS)
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Get user's Google tokens from database
    const { data: tokenData, error: tokenError } = await supabaseAdmin
      .from('user_google_tokens')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (tokenError || !tokenData) {
      return NextResponse.json(
        { error: 'Google Calendar not connected. Please connect your calendar first.' },
        { status: 401 }
      );
    }

    // Set up OAuth client with stored tokens
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    oauth2Client.setCredentials({
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expiry_date: tokenData.token_expiry ? new Date(tokenData.token_expiry).getTime() : undefined,
    });

    // Check if token needs refresh
    if (tokenData.token_expiry && new Date(tokenData.token_expiry) < new Date()) {
      const { credentials } = await oauth2Client.refreshAccessToken();
      oauth2Client.setCredentials(credentials);

      // Update tokens in database
      await supabaseAdmin
        .from('user_google_tokens')
        .update({
          access_token: credentials.access_token,
          token_expiry: credentials.expiry_date ? new Date(credentials.expiry_date).toISOString() : null,
        })
        .eq('user_id', userId);
    }

    // Get calendar events
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    // Get events from the last 7 days to now + 30 days
    const timeMin = new Date();
    timeMin.setDate(timeMin.getDate() - 7);
    const timeMax = new Date();
    timeMax.setDate(timeMax.getDate() + 30);

    const response = await calendar.events.list({
      calendarId: tokenData.calendar_id || 'primary',
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = response.data.items || [];

    // Filter events that start with "PROJ-"
    const projEvents = events.filter(event => 
      event.summary && event.summary.startsWith('PROJ-')
    );

    console.log(`Found ${projEvents.length} calendar events starting with PROJ-`);

    // Check which events already have tickets
    const { data: existingTickets } = await supabaseAdmin
      .from('tickets')
      .select('calendar_event_id')
      .not('calendar_event_id', 'is', null);

    const existingEventIds = new Set(existingTickets?.map(t => t.calendar_event_id) || []);

    // Create tickets for new events
    const newTickets = [];
    for (const event of projEvents) {
      if (!event.id || existingEventIds.has(event.id)) {
        console.log(`Skipping event ${event.summary} - already has ticket`);
        continue;
      }

      // Create ticket
      const ticketName = event.summary || 'Untitled';
      const eventStart = event.start?.dateTime || event.start?.date;
      const eventLink = event.htmlLink;

      // Insert ticket
      const { data: ticket, error: ticketError } = await supabaseAdmin
        .from('tickets')
        .insert({
          ticket_name: ticketName,
          total_steps: CHECKLIST_STEPS.length,
          completed_steps: 0,
          is_complete: false,
          user_id: userId,
          created_by_email: userEmail,
          calendar_event_id: event.id,
          calendar_event_summary: event.summary,
          calendar_event_start: eventStart,
          calendar_event_link: eventLink,
          auto_created: true,
        })
        .select()
        .single();

      if (ticketError) {
        console.error('Error creating ticket:', ticketError);
        continue;
      }

      // Insert all steps
      const ticketSteps = CHECKLIST_STEPS.map((step) => ({
        ticket_id: ticket.id,
        step_id: step.id,
        step_title: step.title,
        step_description: step.description,
        is_completed: false,
      }));

      const { error: stepsError } = await supabaseAdmin
        .from('ticket_steps')
        .insert(ticketSteps);

      if (stepsError) {
        console.error('Error creating steps:', stepsError);
        continue;
      }

      newTickets.push({
        ticketId: ticket.id,
        ticketName: ticketName,
        eventStart: eventStart,
      });

      console.log(`Created ticket for event: ${ticketName}`);
    }

    return NextResponse.json({
      success: true,
      message: `Synced ${projEvents.length} calendar events. Created ${newTickets.length} new tickets.`,
      newTickets,
    });

  } catch (error) {
    console.error('Error syncing calendar:', error);
    return NextResponse.json(
      { error: 'Failed to sync calendar', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

