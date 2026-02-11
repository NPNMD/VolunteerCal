/**
 * schedule-reminders  —  Supabase Edge Function (Cron)
 * ------------------------------------------------------
 * Designed to run on a schedule (e.g. every 5 minutes via pg_cron or
 * Supabase Cron Jobs).
 *
 * 1. Queries the `reminders` table for unsent reminders whose
 *    `remind_at` timestamp has passed.
 * 2. For each, resolves the user's email and event details.
 * 3. Calls the `send-reminder` Edge Function (or sends in-app
 *    notifications directly).
 * 4. Marks processed reminders as sent.
 *
 * Environment variables (auto-injected by Supabase):
 *   SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  try {
    const now = new Date().toISOString();

    // ── 1. Fetch due, unsent reminders ──────────────────────────────────
    const { data: dueReminders, error: fetchErr } = await supabase
      .from('reminders')
      .select(`
        id,
        event_id,
        user_id,
        remind_at,
        channel,
        event:events!reminders_event_id_fkey(
          id, title, start_time, location
        ),
        user:profiles!reminders_user_id_fkey(
          id, email, full_name
        )
      `)
      .eq('sent', false)
      .lte('remind_at', now)
      .limit(100);

    if (fetchErr) {
      console.error('Error fetching due reminders:', fetchErr);
      return new Response(
        JSON.stringify({ error: fetchErr.message }),
        { status: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } },
      );
    }

    if (!dueReminders || dueReminders.length === 0) {
      return new Response(
        JSON.stringify({ processed: 0, message: 'No reminders due' }),
        { status: 200, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } },
      );
    }

    console.log(`Processing ${dueReminders.length} due reminder(s)…`);

    let emailSent = 0;
    let inAppSent = 0;

    for (const reminder of dueReminders) {
      const event = reminder.event as any;
      const user = reminder.user as any;

      if (!event || !user) {
        // Orphaned reminder — mark sent to avoid re-processing
        await supabase.from('reminders').update({ sent: true }).eq('id', reminder.id);
        continue;
      }

      // ── 2a. In-app notification ─────────────────────────────────────
      if (reminder.channel === 'in_app' || reminder.channel === 'both') {
        await supabase.from('notifications').insert({
          user_id: user.id,
          type: 'event_reminder',
          title: `Reminder: ${event.title}`,
          message: `Your event "${event.title}" starts at ${new Date(event.start_time).toLocaleString()}.`,
          related_event_id: event.id,
        });
        inAppSent++;
      }

      // ── 2b. Email via send-reminder function ────────────────────────
      if (reminder.channel === 'email' || reminder.channel === 'both') {
        try {
          const sendRes = await fetch(`${supabaseUrl}/functions/v1/send-reminder`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${serviceRoleKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              reminder_id: reminder.id,
              user_email: user.email,
              user_name: user.full_name,
              event_title: event.title,
              event_start: event.start_time,
              event_location: event.location,
            }),
          });

          if (sendRes.ok) emailSent++;
          else console.error(`send-reminder failed for ${reminder.id}:`, await sendRes.text());
        } catch (err) {
          console.error(`send-reminder call error for ${reminder.id}:`, err);
        }
      }

      // ── 3. Mark as sent ─────────────────────────────────────────────
      await supabase.from('reminders').update({ sent: true }).eq('id', reminder.id);
    }

    return new Response(
      JSON.stringify({
        processed: dueReminders.length,
        emailSent,
        inAppSent,
      }),
      { status: 200, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    console.error('schedule-reminders error:', err);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } },
    );
  }
});
