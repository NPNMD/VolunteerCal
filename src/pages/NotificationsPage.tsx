import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';
import { NotificationList } from '@/components/notifications/NotificationList';

export function NotificationsPage() {
  const { user } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications(user?.id);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        {unreadCount > 0 && (
          <button onClick={markAllAsRead} className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
            Mark all as read
          </button>
        )}
      </div>
      <div className="rounded-xl border border-gray-200 bg-white">
        <NotificationList notifications={notifications} onMarkAsRead={markAsRead} onDelete={deleteNotification} />
      </div>
    </div>
  );
}
