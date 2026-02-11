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
    <header className="sticky top-0 z-50 border-b backdrop-blur-md" style={{borderColor: '#F5F3F0', backgroundColor: 'rgba(250, 248, 245, 0.8)'}}>
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold sm:text-xl text-purple-500" style={{color: '#9B4DCA'}}>
          <Calendar className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={2.5} />
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
                className={`rounded-xl px-3 py-2 text-sm font-medium transition-colors`}
                style={isActive(to) 
                  ? {backgroundColor: '#F5F0FA', color: '#8B5CF6'} 
                  : {color: '#5C5854'}}
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
              <Link to="/profile" className="flex items-center gap-2 rounded-xl px-2 py-1.5 text-sm font-medium sm:px-3 sm:py-2 transition-colors hover:bg-cream-100" style={{color: '#5C5854', backgroundColor: isActive('/profile') ? '#F5F3F0' : 'transparent'}}>
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="" className="h-7 w-7 rounded-full object-cover" />
                ) : (
                  <User className="h-5 w-5" strokeWidth={2.5} />
                )}
                <span className="hidden sm:inline max-w-[120px] truncate">{profile?.full_name || 'Profile'}</span>
              </Link>
              <button
                onClick={handleSignOut}
                className="rounded-xl p-2 transition-colors hover:bg-cream-100"
                style={{color: '#9E9690'}}
                title="Sign out"
              >
                <LogOut className="h-5 w-5" strokeWidth={2.5} />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="rounded-xl px-3 py-2 text-sm font-medium sm:px-4 transition-colors hover:bg-cream-100" style={{color: '#5C5854'}}>
                Sign In
              </Link>
              <Link to="/register" className="rounded-xl px-3 py-2 text-sm font-medium text-white sm:px-4 bg-purple-500 hover:bg-purple-600 transition-colors" style={{backgroundColor: '#9B4DCA'}}>
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
