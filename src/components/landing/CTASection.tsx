import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export function CTASection() {
  const { user } = useAuth();

  if (user) return null;

  return (
    <section className="px-4 py-24 sm:px-6 lg:px-8" style={{backgroundColor: '#FAF8F5'}}>
      <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl animate-gradient px-6 py-16 text-center text-white shadow-2xl sm:px-12 sm:py-20" style={{backgroundImage: 'linear-gradient(135deg, #9B4DCA 0%, #8B5CF6 50%, #C084FC 100%)', boxShadow: '0 25px 50px -12px rgba(155, 77, 202, 0.25)'}}>
        {/* Organic warm blobs instead of dots */}
        <div
          className="absolute inset-0 opacity-20"
          aria-hidden="true"
        >
          <div className="absolute top-10 right-10 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-10 left-10 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        </div>

        <div className="relative">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
            <Sparkles className="h-7 w-7" style={{color: '#FFB830'}} strokeWidth={2.5} />
          </div>

          <h2 className="text-3xl font-extrabold sm:text-4xl lg:text-5xl">
            Ready to simplify your volunteer life?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/90">
            Join organizations already using VolunteerCal to coordinate events,
            reduce no-shows, and focus on what matters -- making a difference.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              to="/register"
              className="group inline-flex items-center gap-2 rounded-2xl px-8 py-4 text-base font-bold shadow-xl transition-all hover:shadow-2xl animate-pulse-glow active:scale-[0.98]"
              style={{backgroundColor: '#FAF8F5', color: '#2C2825', boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.2)'}}
            >
              Create Your Free Account
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" strokeWidth={2.5} />
            </Link>
            <span className="text-sm text-white/80">
              Free forever &middot; No credit card &middot; 2-minute setup
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
