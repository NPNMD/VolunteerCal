# VolunteerCal

A beautiful web application for organizing volunteer events through Foundation groups.

## Features

- **User Authentication** -- Email/password and Google sign-in via Supabase Auth
- **Foundation Groups** -- Create groups, invite members, manage roles (Admin/Member)
- **Event Management** -- Create events with goals, plans, location, capacity, recurrence
- **Sign-Ups** -- One-click sign-up for yourself or dependents, with waitlist support
- **Unified Calendar** -- FullCalendar with month/week/day/list views and filters
- **Smart Search** -- Search events by name, creator, type, date, group, or any combination
- **Google Calendar** -- "Add to Google Cal" links and .ics file downloads
- **Notifications** -- Real-time in-app notifications via Supabase Realtime
- **Reminders** -- Configurable email reminders via Supabase Edge Functions

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript, Vite |
| Styling | TailwindCSS v4, Lucide Icons |
| Calendar | FullCalendar.js |
| State | Zustand |
| Backend | Supabase (PostgreSQL, Auth, Realtime, Storage) |
| Deployment | Vercel + Supabase Cloud |

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) account (free tier works)

### Setup

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd VolunteerCal
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Supabase:
   - Create a new Supabase project
   - Copy your project URL and anon key from Settings > API
   - Update `.env.local`:
     ```
     VITE_SUPABASE_URL=https://your-project.supabase.co
     VITE_SUPABASE_ANON_KEY=your-anon-key
     ```

4. Run database migrations:
   - Go to Supabase SQL Editor
   - Run each file in `supabase/migrations/` in order (001 through 005)

5. Start the dev server:
   ```bash
   npm run dev
   ```

6. Open http://localhost:5173

### Build for Production

```bash
npm run build
```

## Project Structure

```
src/
  config/        -- Supabase client, app constants
  types/         -- TypeScript types and DB types
  hooks/         -- React hooks (useAuth, useGroups, useEvents, etc.)
  services/      -- API service layer (auth, groups, events, signups, notifications)
  components/
    layout/      -- Header, Footer, MainLayout
    auth/        -- LoginForm, RegisterForm, ProtectedRoute
    profile/     -- ProfileCard, ProfileForm, DependentsList
    groups/      -- GroupCard, GroupForm, GroupMemberList, InviteModal
    events/      -- EventCard, EventForm, EventDetail, SignUpButton
    calendar/    -- CalendarView, CalendarFilters
    search/      -- SearchBar, SearchFilters, SearchResults
    notifications/ -- NotificationBell, NotificationList
  pages/         -- All page components
  utils/         -- Date helpers, validators, Google Cal utils
  styles/        -- Global CSS

supabase/
  migrations/    -- SQL migration files (001-005)
```

## License

MIT
