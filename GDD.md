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
| **Frontend** | React 18, TypeScript, Vite |
| **Styling** | TailwindCSS, shadcn/ui |
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

## Target Audience

- **Small volunteer organizations** — Churches, community groups, local nonprofits
- **Foundation groups** — Groups within larger foundations (e.g., school PTOs, youth clubs)

---
