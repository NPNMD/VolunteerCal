/**
 * calendar.service.ts
 * --------------------
 * Centralises all Google Calendar integration logic.
 *
 * Phase 1 — generates "Add to Google Calendar" URLs and .ics downloads
 *           (no OAuth required).
 * Phase 2 — placeholder for full OAuth two-way sync via Google Calendar
 *           API v3 (when ready, add OAuth token exchange + push/pull here).
 */

import type { CalendarEvent } from '@/types';

// ─── helpers ────────────────────────────────────────────────────────────

/** Convert a Date/ISO string to the compact format Google Calendar expects. */
function toGoogleDateStr(iso: string): string {
  return new Date(iso)
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}/, '');
}

/** Escape special chars for iCalendar TEXT values. */
function icsEscape(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

// ─── Phase 1: link-based integration ────────────────────────────────────

/** Build a Google Calendar "add event" URL. */
export function generateGoogleCalUrl(event: CalendarEvent): string {
  const start = toGoogleDateStr(event.start_time);
  const end = toGoogleDateStr(event.end_time);

  const details = [
    event.description ?? '',
    event.goals ? `\nGoals: ${event.goals}` : '',
    event.plan ? `\nPlan: ${event.plan}` : '',
  ].join('');

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${start}/${end}`,
    details,
    location: event.location || event.virtual_link || '',
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/** Generate RFC 5545-compliant .ics content for a single event. */
export function generateICSContent(event: CalendarEvent): string {
  const start = toGoogleDateStr(event.start_time);
  const end = toGoogleDateStr(event.end_time);
  const uid = `${event.id}@volunteercal`;

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//VolunteerCal//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${icsEscape(event.title)}`,
    `DESCRIPTION:${icsEscape(event.description || '')}`,
    `LOCATION:${icsEscape(event.location || '')}`,
    event.virtual_link ? `URL:${event.virtual_link}` : '',
    'END:VEVENT',
    'END:VCALENDAR',
  ]
    .filter(Boolean)
    .join('\r\n');
}

/** Trigger a browser download of an .ics file for the event. */
export function downloadICS(event: CalendarEvent): void {
  const content = generateICSContent(event);
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${event.title.replace(/\s+/g, '_')}.ics`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

// ─── Phase 2: OAuth sync (placeholder) ─────────────────────────────────

/**
 * Initiates Google OAuth consent flow for Calendar access.
 * Requires GOOGLE_CLIENT_ID to be set in environment.
 *
 * TODO: Implement when ready for two-way sync.
 */
export function initiateGoogleOAuthSync(): void {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  if (!clientId) {
    console.warn('[calendar.service] VITE_GOOGLE_CLIENT_ID not configured — OAuth sync unavailable.');
    return;
  }

  const redirectUri = `${window.location.origin}/auth/google/callback`;
  const scope = 'https://www.googleapis.com/auth/calendar.events';

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope,
    access_type: 'offline',
    prompt: 'consent',
  });

  window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

/**
 * Push a VolunteerCal event to the user's Google Calendar via API.
 *
 * TODO: Implement after OAuth token storage is in place.
 */
export async function pushEventToGoogleCal(
  _event: CalendarEvent,
  _accessToken: string,
): Promise<void> {
  // Will call Google Calendar API v3 POST /calendars/primary/events
  console.warn('[calendar.service] pushEventToGoogleCal is not yet implemented.');
}
