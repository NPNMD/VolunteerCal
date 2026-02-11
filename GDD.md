# VolunteerCal — Game Design Document (App Design Document)

## App Overview

**VolunteerCal** is a web app for creating Foundation groups and managing volunteer events on a shared calendar. Key capabilities include:

- **Foundation groups** — Create and manage groups for volunteer organizations
- **Shared calendar** — Unified view of volunteer events across groups
- **Sign-ups** — Volunteers can sign up for events (self and dependents)
- **Reminders** — In-app and email notifications for upcoming events
- **Google Calendar integration** — Subscribe to events and sync with personal calendars

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19, TypeScript, Vite |
| **Styling** | TailwindCSS v4 |
| **State** | Zustand |
| **Calendar** | FullCalendar.js |
| **Backend** | Supabase (PostgreSQL, Auth, Real-time, Storage) |
| **Serverless** | Supabase Edge Functions + Resend (email) |
| **Integrations** | Google Calendar API v3 |
| **Deployment** | Vercel + Supabase Cloud |

---

## Core Features

### Auth & Profiles

- User authentication (Supabase Auth)
- User profiles with editable details
- Role-based access (admin, member)

### Foundation Groups

- Create groups for volunteer organizations
- Invite members via shareable links
- Admin and member roles
- Group-level event management

### Events

- **Metadata**: Title, description, category
- **Planning**: Goals, plan, accomplishments
- **Scheduling**: Dates, location, capacity, recurrence
- **Status**: Draft, published, cancelled, completed

### Sign-Ups

- Self sign-up for events
- Sign up dependents (family members, etc.)
- Waitlist when capacity is reached

### Unified Calendar

- FullCalendar with month, week, day, and list views
- Filters (by group, creator, category)
- Color-coding by group or event type

### Search

- Search by creator, event type, name, dates, group combinations
- Combined filters for flexible discovery

### Reminders & Notifications

- In-app notifications
- Email reminders (Resend via Edge Functions)

### Google Calendar Integration

- Export events to Google Calendar
- Subscribe links for calendar sync

---

## Database Schema

| Table | Purpose |
|-------|---------|
| **users** | User accounts and profile data |
| **dependents** | Family members or dependents linked to users |
| **groups** | Foundation groups |
| **group_members** | Group membership (user, group, role) |
| **events** | Volunteer events with full metadata |
| **event_signups** | Event sign-ups (user/dependent, event, waitlist status) |
| **notifications** | In-app notifications |
| **reminders** | Scheduled reminders (email, in-app) |

---

## Mobile-First Experience

VolunteerCal is designed to be fully mobile-friendly with the following patterns:

### Navigation
- **Bottom navigation bar** — Authenticated users see a persistent bottom nav on mobile (Home, Groups, Calendar, Search, Alerts) with active state indicators and unread badge
- **Simplified header** — Desktop nav is hidden on mobile; header shows logo, profile, and sign-out only
- **Footer hidden on mobile** — Footer is hidden for authenticated users on mobile to avoid conflict with bottom nav

### Touch Optimization
- **44px minimum touch targets** — All buttons, links, and interactive elements meet Apple Human Interface Guidelines
- **16px font on inputs** — Prevents iOS zoom-on-focus behavior
- **Active states** — All interactive elements have `active:` press feedback for tactile response
- **Tap highlight removed** — `-webkit-tap-highlight-color: transparent` for clean touch experience

### Responsive Patterns
- **Bottom sheet modals** — EventPopover, InviteModal, and NotificationBell use bottom sheet pattern on mobile instead of positioned popovers/dropdowns
- **Collapsible filters** — Calendar and Search filters collapse into toggle sections on mobile with active filter count badges
- **Full-width buttons** — Form submit/cancel buttons stack vertically and span full width on mobile
- **Responsive calendar** — FullCalendar shows list view by default on mobile, with simplified toolbar (prev/next + month/list only), narrow day headers, and fewer max events per day

### PWA & Viewport
- `viewport-fit=cover` for edge-to-edge display on notched phones
- `safe-area-inset` padding throughout the UI
- `theme-color` meta tag for browser chrome matching
- `apple-mobile-web-app-capable` for Add to Home Screen support
- Dynamic viewport height (`100dvh`) for proper mobile browser URL bar behavior

### Layout Adaptations
- **Dashboard** — Quick actions span full-width on mobile; groups/events stack vertically
- **Group detail** — Action buttons wrap with labels visible on mobile (Create Event, Invite, Leave)
- **Event detail** — Calendar export buttons stack vertically on mobile
- **Search** — Date pickers display in 2-column grid on mobile for compact layout

---

## Target Audience

- **Small volunteer organizations** — Churches, community groups, local nonprofits
- **Foundation groups** — Groups within larger foundations (e.g., school PTOs, youth clubs)

---
