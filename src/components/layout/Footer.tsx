import { Calendar } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export function Footer() {
  const { user } = useAuth();

  return (
    <footer className={`border-t border-gray-200 bg-white ${user ? 'hidden md:block' : ''}`}>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2 text-gray-500">
            <Calendar className="h-5 w-5" />
            <span className="text-sm font-medium">VolunteerCal</span>
          </div>
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} VolunteerCal. Making volunteering easier.
          </p>
        </div>
      </div>
    </footer>
  );
}
