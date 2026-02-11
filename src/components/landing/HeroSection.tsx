import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Heart, Users } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export function HeroSection() {
  const { user } = useAuth();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 animate-gradient px-4 py-20 text-white sm:py-28 lg:py-36">
      {/* Decorative floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="animate-float absolute top-16 left-[10%] flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
          <Calendar className="h-7 w-7 text-white/70" />
        </div>
        <div className="animate-float-delayed absolute top-32 right-[12%] flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
          <Heart className="h-6 w-6 text-pink-300/70" />
        </div>
        <div className="animate-float-slow absolute bottom-24 left-[18%] flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
          <Users className="h-5 w-5 text-white/70" />
        </div>
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />
      </div>

      <div className="relative mx-auto max-w-4xl text-center">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur-sm animate-fade-in">
          <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
          100% Free &middot; No credit card required
        </div>

        {/* Headline */}
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl animate-fade-in-up">
          Rally Your Volunteers.
          <br />
          <span className="bg-gradient-to-r from-amber-200 via-yellow-200 to-amber-200 bg-clip-text text-transparent">
            Amplify Your Impact.
          </span>
        </h1>

        {/* Subheadline */}
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-indigo-100/90 sm:text-xl animate-fade-in-up stagger-1">
          Ditch the spreadsheets, group texts, and no-shows. VolunteerCal gives your
          organization a shared calendar where volunteers sign up, get reminded, and
          actually show up.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-wrap justify-center gap-4 animate-fade-in-up stagger-2">
          {user ? (
            <Link
              to="/dashboard"
              className="group inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-bold text-indigo-600 shadow-xl shadow-indigo-900/20 transition-all hover:bg-indigo-50 hover:shadow-2xl active:scale-[0.98]"
            >
              Go to Dashboard
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          ) : (
            <>
              <Link
                to="/register"
                className="group inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-bold text-indigo-600 shadow-xl shadow-indigo-900/20 transition-all hover:bg-indigo-50 hover:shadow-2xl animate-pulse-glow active:scale-[0.98]"
              >
                Get Started Free
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-white/30 px-8 py-4 text-base font-bold text-white transition-all hover:border-white/60 hover:bg-white/10 active:scale-[0.98]"
              >
                Sign In
              </Link>
            </>
          )}
        </div>

        {/* Micro-copy */}
        {!user && (
          <p className="mt-4 text-sm text-indigo-200/70 animate-fade-in-up stagger-3">
            Set up your first group in under 2 minutes
          </p>
        )}
      </div>
    </section>
  );
}
