import { NavLink, useLocation } from 'react-router-dom';
import { Home, Users, Calendar, Search, Bell } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/utils/cn';

const navItems = [
  { to: '/dashboard', icon: Home, label: 'Home' },
  { to: '/groups', icon: Users, label: 'Groups' },
  { to: '/calendar', icon: Calendar, label: 'Calendar' },
  { to: '/search', icon: Search, label: 'Search' },
  { to: '/notifications', icon: Bell, label: 'Alerts' },
];

export function MobileNav() {
  const { user } = useAuth();
  const { unreadCount } = useNotifications(user?.id);
  const location = useLocation();

  if (!user) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white/95 backdrop-blur-md md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      <div className="flex items-center justify-around px-2">
        {navItems.map(({ to, icon: Icon, label }) => {
          const isActive = location.pathname === to || location.pathname.startsWith(to + '/');
          const isNotifications = to === '/notifications';

          return (
            <NavLink
              key={to}
              to={to}
              className={cn(
                'relative flex flex-col items-center justify-center gap-0.5 px-3 py-2 text-[10px] font-medium transition-colors',
                isActive ? 'text-indigo-600' : 'text-gray-500'
              )}
            >
              <div className="relative">
                <Icon className={cn('h-5 w-5', isActive && 'scale-110')} strokeWidth={isActive ? 2.5 : 2} />
                {isNotifications && unreadCount > 0 && (
                  <span className="absolute -right-1.5 -top-1 flex h-3.5 min-w-[14px] items-center justify-center rounded-full bg-red-500 px-0.5 text-[8px] font-bold text-white">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </div>
              <span>{label}</span>
              {isActive && (
                <span className="absolute -top-px left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-indigo-600" />
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
