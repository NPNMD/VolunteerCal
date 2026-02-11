import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Calendar, LogOut, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { NotificationBell } from '@/components/notifications/NotificationBell';

export function Header() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold text-indigo-600 sm:text-xl">
          <Calendar className="h-6 w-6 sm:h-7 sm:w-7" />
          <span className="hidden xs:inline">VolunteerCal</span>
          <span className="xs:hidden">VC</span>
        </Link>

        {/* Desktop nav - hidden on mobile (bottom nav takes over) */}
        {user && (
          <nav className="hidden items-center gap-1 md:flex">
            {[
              { to: '/dashboard', label: 'Dashboard' },
              { to: '/groups', label: 'Groups' },
              { to: '/calendar', label: 'Calendar' },
              { to: '/search', label: 'Search' },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive(to) ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-1 sm:gap-3">
          {user ? (
            <>
              {/* Notification bell: hidden on mobile since bottom nav has alerts */}
              <div className="hidden md:block">
                <NotificationBell />
              </div>
              <Link to="/profile" className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 sm:px-3 sm:py-2">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="" className="h-7 w-7 rounded-full object-cover" />
                ) : (
                  <User className="h-5 w-5" />
                )}
                <span className="hidden sm:inline max-w-[120px] truncate">{profile?.full_name || 'Profile'}</span>
              </Link>
              <button
                onClick={handleSignOut}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                title="Sign out"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 sm:px-4">
                Sign In
              </Link>
              <Link to="/register" className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700 sm:px-4">
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
