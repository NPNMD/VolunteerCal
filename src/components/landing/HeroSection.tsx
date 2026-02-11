import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Heart, Users } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export function HeroSection() {
  const { user } = useAuth();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-purple-500 via-orchid-500 to-sunset-purple animate-gradient px-4 py-20 text-white sm:py-28 lg:py-36" style={{backgroundImage: 'linear-gradient(135deg, #9B4DCA 0%, #8B5CF6 50%, #C084FC 100%)'}}>
      {/* Decorative floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="animate-float absolute top-16 left-[10%] flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
          <Calendar className="h-7 w-7 text-white/80" strokeWidth={2.5} />
        </div>
        <div className="animate-float-delayed absolute top-32 right-[12%] flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
          <Heart className="h-6 w-6 text-yellow-400/80" strokeWidth={2.5} />
        </div>
        <div className="animate-float-slow absolute bottom-24 left-[18%] flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
          <Users className="h-5 w-5 text-white/80" strokeWidth={2.5} />
        </div>
        {/* Organic warm blob pattern instead of grid */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 right-10 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-20 left-10 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        </div>
      </div>

      <div className="relative mx-auto max-w-4xl text-center">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur-sm animate-fade-in">
          <span className="h-2 w-2 rounded-full bg-sage-500 animate-pulse" style={{backgroundColor: '#7FB069'}} />
          100% Free &middot; No credit card required
        </div>

        {/* Headline */}
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl animate-fade-in-up">
          Rally Your Volunteers.
          <br />
          <span className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 bg-clip-text text-transparent" style={{backgroundImage: 'linear-gradient(to right, #FFB830, #FFCA5A, #FFB830)'}}>
            Amplify Your Impact.
          </span>
        </h1>

        {/* Subheadline */}
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/90 sm:text-xl animate-fade-in-up stagger-1">
          Ditch the spreadsheets, group texts, and no-shows. VolunteerCal gives your
          organization a shared calendar where volunteers sign up, get reminded, and
          actually show up.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-wrap justify-center gap-4 animate-fade-in-up stagger-2">
          {user ? (
            <Link
              to="/dashboard"
              className="group inline-flex items-center gap-2 rounded-2xl px-8 py-4 text-base font-bold shadow-xl transition-all hover:shadow-2xl active:scale-[0.98] bg-cream-50 text-charcoal-900" 
              style={{backgroundColor: '#FAF8F5', color: '#2C2825', boxShadow: '0 10px 40px -10px rgba(155, 77, 202, 0.3)'}}
            >
              Go to Dashboard
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" strokeWidth={2.5} />
            </Link>
          ) : (
            <>
              <Link
                to="/register"
                className="group inline-flex items-center gap-2 rounded-2xl px-8 py-4 text-base font-bold shadow-xl transition-all hover:shadow-2xl animate-pulse-glow active:scale-[0.98] bg-cream-50 text-charcoal-900"
                style={{backgroundColor: '#FAF8F5', color: '#2C2825', boxShadow: '0 10px 40px -10px rgba(155, 77, 202, 0.3)'}}
              >
                Get Started Free
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" strokeWidth={2.5} />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-2xl border-2 border-white/30 px-8 py-4 text-base font-bold text-white transition-all hover:border-white/60 hover:bg-white/10 active:scale-[0.98]"
              >
                Sign In
              </Link>
            </>
          )}
        </div>

        {/* Micro-copy */}
        {!user && (
          <p className="mt-4 text-sm text-white/80 animate-fade-in-up stagger-3">
            Set up your first group in under 2 minutes
          </p>
        )}
      </div>
    </section>
  );
}
