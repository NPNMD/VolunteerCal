import { Trash2 } from 'lucide-react';
import { formatRelative } from '@/utils/dateHelpers';
import { cn } from '@/utils/cn';
import type { Notification } from '@/types';

interface Props {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export function NotificationList({ notifications, onMarkAsRead, onDelete }: Props) {
  if (notifications.length === 0) {
    return (
      <div className="px-4 py-8 text-center text-sm text-gray-500">
        No notifications yet
      </div>
    );
  }

  return (
    <div className="max-h-96 overflow-y-auto">
      {notifications.map((n) => (
        <div
          key={n.id}
          onClick={() => !n.is_read && onMarkAsRead(n.id)}
          className={cn(
            'flex cursor-pointer items-start gap-3 border-b border-gray-100 px-4 py-3 transition-colors hover:bg-gray-50',
            !n.is_read && 'bg-indigo-50/50'
          )}
        >
          <div className={cn('mt-1 h-2 w-2 flex-shrink-0 rounded-full', n.is_read ? 'bg-transparent' : 'bg-indigo-500')} />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-900">{n.title}</p>
            {n.message && <p className="mt-0.5 text-xs text-gray-500 line-clamp-2">{n.message}</p>}
            <p className="mt-1 text-xs text-gray-400">{formatRelative(n.created_at)}</p>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(n.id); }}
            className="flex-shrink-0 rounded p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
