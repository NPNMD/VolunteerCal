# VolunteerCal — Roadmap

---

## Phase 1: Foundation

**Goal:** Core project structure, backend, and authentication.

- [x] Project scaffold (Vite + React + TypeScript)
- [x] Supabase setup (project, environment variables)
- [x] Authentication (sign up, sign in, password reset)
- [x] User profiles (create, edit, view)

---

## Phase 2: Groups & Events

**Goal:** Groups, events, and sign-ups.

- [x] Group CRUD (create, view, edit, delete)
- [x] Member management (invite via link, roles)
- [x] Event CRUD (full event metadata)
- [x] Sign-ups (self and dependents, waitlist)

---

## Phase 3: Calendar & Search

**Goal:** Calendar experience and discovery.

- [x] FullCalendar integration (month, week, day, list views)
- [x] Multi-criteria search (creator, type, name, dates, group)
- [x] Google Calendar links (subscribe, export)
- [x] Calendar event popover (quick-view details without navigating)
- [x] Dedicated search hook (useSearch) for modular state management

---

## Phase 4: Notifications & Polish

**Goal:** Engagement and UX refinement.

- [x] In-app notifications (real-time via Supabase Realtime)
- [x] Email reminders (Resend + Edge Functions)
- [x] Reminder scheduling service (CRUD for reminders table)
- [x] Calendar integration service (Google Cal URL + ICS + OAuth placeholder)
- [x] UI polish and error handling

---

## Future

Planned enhancements beyond the initial release:

- **Two-way Google Calendar sync** — Bi-directional sync with personal calendars (OAuth flow scaffolded in `calendar.service.ts`)
- **Mobile app** — Native or React Native app
- **Analytics dashboard** — Event stats, engagement, volunteer hours
- **Volunteer hour tracking** — Log and report volunteer hours per user/group

---
