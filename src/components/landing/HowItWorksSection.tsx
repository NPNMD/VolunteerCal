import { UserPlus, CalendarPlus, PartyPopper } from 'lucide-react';

const steps = [
  {
    num: '1',
    icon: UserPlus,
    title: 'Create Your Group',
    desc: 'Sign up in seconds and create a Foundation Group for your organization. Invite members with a single shareable link.',
    color: 'indigo',
  },
  {
    num: '2',
    icon: CalendarPlus,
    title: 'Post Events to the Calendar',
    desc: 'Add volunteer events with goals, capacity limits, and all the details. Your team sees everything in one shared calendar.',
    color: 'purple',
  },
  {
    num: '3',
    icon: PartyPopper,
    title: 'Volunteers Show Up',
    desc: 'Members sign up with one tap, get automatic reminders, and export to Google Calendar. No more no-shows.',
    color: 'pink',
  },
];

const colorMap: Record<string, { bg: string; icon: string; num: string; ring: string }> = {
  indigo: { bg: 'bg-indigo-50',  icon: 'text-indigo-600', num: 'bg-indigo-600', ring: 'ring-indigo-100' },
  purple: { bg: 'bg-purple-50',  icon: 'text-purple-600', num: 'bg-purple-600', ring: 'ring-purple-100' },
  pink:   { bg: 'bg-pink-50',    icon: 'text-pink-600',   num: 'bg-pink-600',   ring: 'ring-pink-100'   },
};

export function HowItWorksSection() {
  return (
    <section className="bg-gray-50 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <p className="text-sm font-bold uppercase tracking-widest text-indigo-600 mb-3">
            How It Works
          </p>
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Up and running in three simple steps
          </h2>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-8">
          {steps.map((s, i) => {
            const c = colorMap[s.color];
            return (
              <div
                key={s.num}
                className={`relative text-center animate-fade-in-up stagger-${i + 1}`}
              >
                {/* Step number badge */}
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center">
                  <span
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl ${c.num} text-xl font-extrabold text-white shadow-lg ring-4 ${c.ring}`}
                  >
                    {s.num}
                  </span>
                </div>

                {/* Icon */}
                <div
                  className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl ${c.bg}`}
                >
                  <s.icon className={`h-8 w-8 ${c.icon}`} />
                </div>

                <h3 className="text-lg font-bold text-gray-900">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">{s.desc}</p>

                {/* Connector line (desktop only, skip last) */}
                {i < steps.length - 1 && (
                  <div
                    className="absolute right-0 top-7 hidden h-0.5 w-8 translate-x-full bg-gradient-to-r from-indigo-200 to-purple-200 sm:block"
                    aria-hidden="true"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
