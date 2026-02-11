import { MessageSquare, FileSpreadsheet, UserX, AlertTriangle } from 'lucide-react';

const painPoints = [
  {
    icon: FileSpreadsheet,
    title: 'Spreadsheet Chaos',
    desc: 'Sign-up sheets get lost, overwritten, or ignored. Nobody knows who\'s coming.',
  },
  {
    icon: MessageSquare,
    title: 'Endless Group Texts',
    desc: '"Can someone cover Saturday?" gets buried under 47 thumbs-up emojis.',
  },
  {
    icon: UserX,
    title: 'No-Shows & Confusion',
    desc: 'Volunteers forget, double-book, or never saw the invite in the first place.',
  },
  {
    icon: AlertTriangle,
    title: 'Admin Burnout',
    desc: 'One person ends up doing all the coordination. That\'s not sustainable.',
  },
];

export function ProblemSection() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center mb-14">
          <p className="text-sm font-bold uppercase tracking-widest text-red-500 mb-3">
            Sound Familiar?
          </p>
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Coordinating volunteers shouldn't feel like a{' '}
            <span className="text-gradient">second full-time job</span>
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            If any of these hit close to home, you're not alone. Most volunteer
            coordinators are stuck juggling tools that weren't built for the job.
          </p>
        </div>

        {/* Pain point cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {painPoints.map((p, i) => (
            <div
              key={p.title}
              className={`hover-lift group flex gap-4 rounded-2xl border border-red-100 bg-red-50/40 p-6 animate-fade-in-up stagger-${i + 1}`}
            >
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-red-100 transition-colors group-hover:bg-red-200">
                <p.icon className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{p.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-gray-600">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
