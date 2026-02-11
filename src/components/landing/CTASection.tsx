import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export function CTASection() {
  const { user } = useAuth();

  if (user) return null;

  return (
    <section className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 animate-gradient px-6 py-16 text-center text-white shadow-2xl shadow-indigo-900/20 sm:px-12 sm:py-20">
        {/* Decorative dots */}
        <div
          className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-40"
          aria-hidden="true"
        />

        <div className="relative">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
            <Sparkles className="h-7 w-7 text-amber-300" />
          </div>

          <h2 className="text-3xl font-extrabold sm:text-4xl lg:text-5xl">
            Ready to simplify your volunteer life?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-indigo-100/90">
            Join organizations already using VolunteerCal to coordinate events,
            reduce no-shows, and focus on what matters -- making a difference.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              to="/register"
              className="group inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-bold text-indigo-600 shadow-xl transition-all hover:bg-indigo-50 hover:shadow-2xl animate-pulse-glow active:scale-[0.98]"
            >
              Create Your Free Account
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <span className="text-sm text-indigo-200/70">
              Free forever &middot; No credit card &middot; 2-minute setup
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
