import { Calendar, Users, Search, Bell, UserCheck, Globe } from 'lucide-react';

const features = [
  {
    icon: Users,
    title: 'Foundation Groups',
    desc: 'Create groups for churches, PTOs, nonprofits, or any volunteer community. Manage members, roles, and invites all in one place.',
    color: 'indigo',
  },
  {
    icon: Calendar,
    title: 'Shared Calendar',
    desc: 'One beautiful calendar for all your events across every group. Month, week, day, or list view -- your volunteers always know what\'s next.',
    color: 'purple',
  },
  {
    icon: UserCheck,
    title: 'One-Tap Sign-Ups',
    desc: 'Volunteers sign up themselves or their dependents with a single click. Capacity limits and waitlists are handled automatically.',
    color: 'emerald',
  },
  {
    icon: Bell,
    title: 'Smart Reminders',
    desc: 'Automatic in-app and email reminders so nobody forgets. Real-time notifications when events change or spots open up.',
    color: 'amber',
  },
  {
    icon: Search,
    title: 'Powerful Search',
    desc: 'Find any event instantly by name, date, category, creator, or group. Combine filters to find exactly what you need.',
    color: 'sky',
  },
  {
    icon: Globe,
    title: 'Google Calendar Sync',
    desc: 'Export events or subscribe to your calendar feed. VolunteerCal events show up right alongside your personal schedule.',
    color: 'rose',
  },
];

const colorMap: Record<string, { bg: string; icon: string; border: string }> = {
  indigo:  { bg: 'bg-indigo-50',  icon: 'text-indigo-600',  border: 'border-indigo-100' },
  purple:  { bg: 'bg-purple-50',  icon: 'text-purple-600',  border: 'border-purple-100' },
  emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-600', border: 'border-emerald-100' },
  amber:   { bg: 'bg-amber-50',   icon: 'text-amber-600',   border: 'border-amber-100' },
  sky:     { bg: 'bg-sky-50',     icon: 'text-sky-600',     border: 'border-sky-100' },
  rose:    { bg: 'bg-rose-50',    icon: 'text-rose-600',    border: 'border-rose-100' },
};

export function FeaturesSection() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center mb-14">
          <p className="text-sm font-bold uppercase tracking-widest text-indigo-600 mb-3">
            Features
          </p>
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Everything your volunteer team needs,{' '}
            <span className="text-gradient">nothing it doesn't</span>
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Purpose-built tools that replace the spreadsheets, group chats, and
            sticky notes.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => {
            const c = colorMap[f.color];
            return (
              <div
                key={f.title}
                className={`hover-lift group rounded-2xl border ${c.border} bg-white p-7 animate-fade-in-up stagger-${i + 1}`}
              >
                <div
                  className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${c.bg} transition-transform group-hover:scale-110`}
                >
                  <f.icon className={`h-6 w-6 ${c.icon}`} />
                </div>
                <h3 className="text-base font-bold text-gray-900">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
