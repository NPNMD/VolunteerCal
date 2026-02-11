import { Link } from 'react-router-dom';
import { Calendar, Users, Search, Bell, ArrowRight, CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const features = [
  { icon: Users, title: 'Foundation Groups', desc: 'Create and join groups to organize your volunteer community.' },
  { icon: Calendar, title: 'Unified Calendar', desc: 'View all events across groups in one beautiful calendar.' },
  { icon: Search, title: 'Smart Search', desc: 'Find events by name, type, date, creator, or any combination.' },
  { icon: Bell, title: 'Reminders', desc: 'Never miss an event with in-app and email reminders.' },
];

const benefits = [
  'Create events with goals, plans, and track accomplishments',
  'Sign up yourself or your dependents with one click',
  'Invite members with shareable links',
  'Export events to Google Calendar',
  'Real-time notifications when events change',
  'Waitlist support when events are full',
];

export function HomePage() {
  const { user } = useAuth();

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 px-4 py-20 text-white sm:py-28">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="relative mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            Organize Volunteers.<br />Make a Difference.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-indigo-100">
            VolunteerCal helps foundation groups create, manage, and track volunteer events with a beautiful shared calendar.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {user ? (
              <Link to="/dashboard" className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-indigo-600 shadow-lg hover:bg-indigo-50">
                Go to Dashboard <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <>
                <Link to="/register" className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-indigo-600 shadow-lg hover:bg-indigo-50">
                  Get Started Free <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/login" className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10">
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Everything you need to organize volunteers</h2>
          <p className="mt-3 text-gray-600">Simple, powerful tools for your foundation group.</p>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="rounded-xl border border-gray-200 bg-white p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100">
                <f.icon className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-gray-900">{f.title}</h3>
              <p className="mt-2 text-sm text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-gray-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-3xl font-bold text-gray-900 mb-10">Why VolunteerCal?</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {benefits.map((b) => (
              <div key={b} className="flex items-start gap-3 rounded-lg bg-white p-4">
                <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                <span className="text-sm text-gray-700">{b}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      {!user && (
        <section className="px-4 py-20 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900">Ready to get started?</h2>
          <p className="mt-3 text-gray-600">Create your free account and start organizing today.</p>
          <Link to="/register" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700">
            Create Free Account <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      )}
    </div>
  );
}
