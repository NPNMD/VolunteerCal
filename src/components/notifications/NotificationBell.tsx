import { Bell, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';
import { NotificationList } from './NotificationList';

export function NotificationBell() {
  const { user } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications(user?.id);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Lock body scroll on mobile when open
  useEffect(() => {
    if (open && window.innerWidth < 768) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)} className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          {/* Mobile: bottom sheet overlay */}
          <div className="fixed inset-0 z-40 bg-black/40 md:hidden" onClick={() => setOpen(false)} />
          <div className="fixed inset-x-0 bottom-0 z-50 rounded-t-2xl bg-white shadow-2xl animate-slide-up md:absolute md:inset-auto md:right-0 md:top-full md:mt-2 md:w-96 md:rounded-xl md:border md:border-gray-200 md:shadow-lg md:animate-slide-down"
            style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
            {/* Mobile drag handle */}
            <div className="flex justify-center py-2 md:hidden">
              <div className="h-1 w-10 rounded-full bg-gray-300" />
            </div>
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
              <h3 className="font-semibold text-gray-900">Notifications</h3>
              <div className="flex items-center gap-3">
                {unreadCount > 0 && (
                  <button onClick={markAllAsRead} className="text-xs font-medium text-indigo-600 hover:text-indigo-500">
                    Mark all read
                  </button>
                )}
                <button onClick={() => setOpen(false)} className="rounded-full p-1 text-gray-400 hover:bg-gray-100 md:hidden">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="max-h-[60vh] md:max-h-96 overflow-y-auto">
              <NotificationList
                notifications={notifications}
                onMarkAsRead={markAsRead}
                onDelete={deleteNotification}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
