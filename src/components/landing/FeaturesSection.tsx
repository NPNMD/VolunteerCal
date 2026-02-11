import { Calendar, Users, Search, Bell, UserCheck, Globe } from 'lucide-react';

const features = [
  {
    icon: Users,
    title: 'Foundation Groups',
    desc: 'Create groups for churches, PTOs, nonprofits, or any volunteer community. Manage members, roles, and invites all in one place.',
    color: 'purple',
  },
  {
    icon: Calendar,
    title: 'Shared Calendar',
    desc: 'One beautiful calendar for all your events across every group. Month, week, day, or list view -- your volunteers always know what\'s next.',
    color: 'orchid',
  },
  {
    icon: UserCheck,
    title: 'One-Tap Sign-Ups',
    desc: 'Volunteers sign up themselves or their dependents with a single click. Capacity limits and waitlists are handled automatically.',
    color: 'sage',
  },
  {
    icon: Bell,
    title: 'Smart Reminders',
    desc: 'Automatic in-app and email reminders so nobody forgets. Real-time notifications when events change or spots open up.',
    color: 'yellow',
  },
  {
    icon: Search,
    title: 'Powerful Search',
    desc: 'Find any event instantly by name, date, category, creator, or group. Combine filters to find exactly what you need.',
    color: 'sunset',
  },
  {
    icon: Globe,
    title: 'Google Calendar Sync',
    desc: 'Export events or subscribe to your calendar feed. VolunteerCal events show up right alongside your personal schedule.',
    color: 'lavender',
  },
];

const colorMap: Record<string, { bg: string; bgStyle?: string; icon: string; iconStyle?: string; border: string; borderStyle?: string }> = {
  purple:    { bg: 'bg-purple-50', bgStyle: '#F5F0FA', icon: 'text-purple-500', iconStyle: '#9B4DCA', border: 'border-cream-100', borderStyle: '#F5F3F0' },
  orchid:    { bg: 'bg-purple-50', bgStyle: '#F5F0FA', icon: 'text-orchid-500', iconStyle: '#8B5CF6', border: 'border-cream-100', borderStyle: '#F5F3F0' },
  sage:      { bg: 'bg-purple-50', bgStyle: '#F5F0FA', icon: 'text-sage-500', iconStyle: '#7FB069', border: 'border-cream-100', borderStyle: '#F5F3F0' },
  yellow:    { bg: 'bg-purple-50', bgStyle: '#F5F0FA', icon: 'text-yellow-500', iconStyle: '#FFB830', border: 'border-cream-100', borderStyle: '#F5F3F0' },
  sunset:    { bg: 'bg-purple-50', bgStyle: '#F5F0FA', icon: 'text-sunset-purple', iconStyle: '#C084FC', border: 'border-cream-100', borderStyle: '#F5F3F0' },
  lavender:  { bg: 'bg-purple-50', bgStyle: '#F5F0FA', icon: 'text-lavender-300', iconStyle: '#B8A4D4', border: 'border-cream-100', borderStyle: '#F5F3F0' },
};

export function FeaturesSection() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8" style={{backgroundColor: '#FAF8F5'}}>
      <div className="mx-auto max-w-6xl">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center mb-14">
          <p className="text-sm font-bold uppercase tracking-widest mb-3 text-purple-500" style={{color: '#9B4DCA'}}>
            Features
          </p>
          <h2 className="text-3xl font-extrabold sm:text-4xl text-charcoal-900" style={{color: '#2C2825'}}>
            Everything your volunteer team needs,{' '}
            <span className="text-gradient">nothing it doesn't</span>
          </h2>
          <p className="mt-4 text-lg text-warm-gray-600" style={{color: '#8B8480'}}>
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
                className={`hover-lift group rounded-2xl border p-7 animate-fade-in-up stagger-${i + 1}`}
                style={{
                  backgroundColor: '#FAF8F5',
                  borderColor: c.borderStyle || '#F5F3F0',
                }}
              >
                <div
                  className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110`}
                  style={{backgroundColor: c.bgStyle || '#F5F0FA'}}
                >
                  <f.icon className={`h-6 w-6`} style={{color: c.iconStyle}} strokeWidth={2.5} />
                </div>
                <h3 className="text-base font-bold text-charcoal-900" style={{color: '#2C2825'}}>{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-warm-gray-600" style={{color: '#8B8480'}}>{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
