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

## Phase 5: Mobile-First Experience

**Goal:** Make the web app fully mobile-friendly so a native app is not needed.

- [x] Bottom navigation bar for mobile (Home, Groups, Calendar, Search, Alerts)
- [x] Bottom sheet modals for popovers/dropdowns on mobile (EventPopover, InviteModal, NotificationBell)
- [x] Collapsible filter panels with active filter count badges (Calendar, Search)
- [x] Responsive FullCalendar (list view default, simplified toolbar, narrow day headers)
- [x] PWA meta tags (viewport-fit, theme-color, apple-mobile-web-app-capable)
- [x] Safe-area-inset support for notched phones
- [x] 44px minimum touch targets on all interactive elements
- [x] 16px input font size to prevent iOS zoom-on-focus
- [x] Full-width stacked buttons on mobile forms
- [x] Active press states (`active:` feedback) on all buttons
- [x] Dynamic viewport height (`100dvh`) for mobile browser URL bar
- [x] Simplified header (no hamburger menu; bottom nav replaces mobile nav)
- [x] Shared `useIsMobile` hook for responsive component logic
- [x] Hidden footer on mobile for authenticated users (bottom nav replaces it)

---

## Future

Planned enhancements beyond the initial release:

- **Two-way Google Calendar sync** — Bi-directional sync with personal calendars (OAuth flow scaffolded in `calendar.service.ts`)
- **Native mobile app** — React Native app (note: web app is now fully mobile-friendly, reducing this priority)
- **Analytics dashboard** — Event stats, engagement, volunteer hours
- **Volunteer hour tracking** — Log and report volunteer hours per user/group
- **Offline support** — Service worker for offline-first experience
- **Push notifications** — Web push notifications for event reminders on mobile

---
