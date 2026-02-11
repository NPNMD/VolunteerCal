import { Shield, Zap, Clock, Heart } from 'lucide-react';

const trustSignals = [
  { icon: Zap,    label: 'Instant Setup',       detail: 'No downloads needed' },
  { icon: Shield, label: 'Privacy First',        detail: 'Your data stays yours' },
  { icon: Clock,  label: '2-Minute Onboarding',  detail: 'Group ready in no time' },
  { icon: Heart,  label: 'Built for Nonprofits', detail: 'By volunteers, for volunteers' },
];

export function SocialProofBar() {
  return (
    <section className="relative -mt-6 z-10 mx-auto max-w-5xl px-4 sm:-mt-8">
      <div className="glass-card rounded-2xl px-6 py-6 shadow-xl shadow-indigo-900/5 sm:px-10 sm:py-8">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {trustSignals.map((item) => (
            <div key={item.label} className="flex flex-col items-center text-center gap-2">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50">
                <item.icon className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{item.label}</p>
                <p className="text-xs text-gray-500">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
