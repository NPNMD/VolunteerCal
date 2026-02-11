/**
 * send-reminder  —  Supabase Edge Function
 * ------------------------------------------
 * Called by the schedule-reminders cron (or directly via HTTP POST)
 * to send a single email reminder for an upcoming volunteer event.
 *
 * Expected JSON body:
 * {
 *   "reminder_id": "uuid",
 *   "user_email": "user@example.com",
 *   "user_name":  "Jane Doe",
 *   "event_title": "Beach Cleanup",
 *   "event_start": "2026-03-15T09:00:00Z",
 *   "event_location": "Main Beach"
 * }
 *
 * Environment variables (set in Supabase Dashboard):
 *   RESEND_API_KEY   — API key from Resend (or SENDGRID_API_KEY)
 *   SENDER_EMAIL     — Verified sender address
 *   SUPABASE_URL     — Auto-injected by Supabase
 *   SUPABASE_SERVICE_ROLE_KEY — Auto-injected by Supabase
 */

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  // Handle CORS pre-flight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS });
  }

  try {
    const {
      reminder_id,
      user_email,
      user_name,
      event_title,
      event_start,
      event_location,
    } = await req.json();

    if (!reminder_id || !user_email || !event_title) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } },
      );
    }

    // ── Send email via Resend ───────────────────────────────────────────
    const resendKey = Deno.env.get('RESEND_API_KEY');
    const senderEmail = Deno.env.get('SENDER_EMAIL') ?? 'noreply@volunteercal.app';

    if (!resendKey) {
      console.error('RESEND_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'Email provider not configured' }),
        { status: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } },
      );
    }

    const startDate = new Date(event_start).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });

    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `VolunteerCal <${senderEmail}>`,
        to: [user_email],
        subject: `Reminder: ${event_title}`,
        html: `
          <div style="font-family:sans-serif; max-width:520px; margin:0 auto;">
            <h2 style="color:#4F46E5;">Upcoming Event Reminder</h2>
            <p>Hi ${user_name || 'Volunteer'},</p>
            <p>This is a friendly reminder that you're signed up for:</p>
            <div style="background:#F9FAFB; border-left:4px solid #4F46E5; padding:16px; border-radius:8px; margin:16px 0;">
              <strong style="font-size:16px;">${event_title}</strong><br/>
              <span style="color:#6B7280;">${startDate}</span><br/>
              ${event_location ? `<span style="color:#6B7280;">📍 ${event_location}</span>` : ''}
            </div>
            <p>Thank you for volunteering!</p>
            <p style="color:#9CA3AF; font-size:12px;">— The VolunteerCal Team</p>
          </div>
        `,
      }),
    });

    if (!emailRes.ok) {
      const errBody = await emailRes.text();
      console.error('Resend API error:', errBody);
      return new Response(
        JSON.stringify({ error: 'Failed to send email', details: errBody }),
        { status: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } },
      );
    }

    // ── Mark reminder as sent ───────────────────────────────────────────
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    await supabase
      .from('reminders')
      .update({ sent: true })
      .eq('id', reminder_id);

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    console.error('send-reminder error:', err);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } },
    );
  }
});
