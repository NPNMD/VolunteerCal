import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Clock, MapPin, Users, ExternalLink, X } from 'lucide-react';
import { formatDate, formatTime } from '@/utils/dateHelpers';
import type { CalendarEvent } from '@/types';

interface Props {
  event: CalendarEvent | null;
  position: { x: number; y: number } | null;
  onClose: () => void;
}

export function EventPopover({ event, position, onClose }: Props) {
  const navigate = useNavigate();
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;

  // Lock body scroll on mobile when popover is open
  useEffect(() => {
    if (event && isMobile) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [event, isMobile]);

  if (!event || !position) return null;

  const groupName = (event.group as any)?.name ?? 'Unknown Group';
  const categoryLabel = event.category
    ? event.category.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    : null;

  const handleViewDetails = () => {
    onClose();
    navigate(`/events/${event.id}`);
  };

  // Mobile: bottom sheet modal
  if (isMobile) {
    return (
      <>
        <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose} />
        <div className="fixed inset-x-0 bottom-0 z-50 rounded-t-2xl bg-white shadow-2xl animate-slide-up"
          style={{ paddingBottom: 'env(safe-area-inset-bottom, 16px)' }}>
          {/* Drag handle */}
          <div className="flex justify-center py-3">
            <div className="h-1 w-10 rounded-full bg-gray-300" />
          </div>

          {/* Header */}
          <div className="flex items-start justify-between gap-2 px-5 pb-3">
            <div className="min-w-0 flex-1">
              <h3 className="text-base font-semibold text-gray-900">{event.title}</h3>
              <p className="mt-0.5 text-sm text-gray-500">{groupName}</p>
            </div>
            <button onClick={onClose} className="flex-shrink-0 rounded-full p-2 text-gray-400 hover:bg-gray-100">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body */}
          <div className="space-y-3 px-5 pb-4">
            <div className="flex items-center gap-2.5 text-sm text-gray-600">
              <Clock className="h-4 w-4 flex-shrink-0 text-gray-400" />
              <span>{formatDate(event.start_time)} &middot; {formatTime(event.start_time)} – {formatTime(event.end_time)}</span>
            </div>
            {(event.location || event.virtual_link) && (
              <div className="flex items-center gap-2.5 text-sm text-gray-600">
                <MapPin className="h-4 w-4 flex-shrink-0 text-gray-400" />
                <span>{event.location || 'Virtual'}</span>
              </div>
            )}
            {event.max_capacity && (
              <div className="flex items-center gap-2.5 text-sm text-gray-600">
                <Users className="h-4 w-4 flex-shrink-0 text-gray-400" />
                <span>{event.signup_count ?? 0} / {event.max_capacity} spots</span>
              </div>
            )}
            {categoryLabel && (
              <span className="inline-block rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">
                {categoryLabel}
              </span>
            )}
            {event.description && (
              <p className="line-clamp-3 text-sm text-gray-500">{event.description}</p>
            )}
          </div>

          {/* Footer */}
          <div className="px-5 pb-4">
            <button onClick={handleViewDetails}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 active:scale-[0.98]">
              View Details
              <ExternalLink className="h-4 w-4" />
            </button>
          </div>
        </div>
      </>
    );
  }

  // Desktop: positioned popover
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div
        className="fixed z-50 w-80 rounded-xl border border-gray-200 bg-white shadow-xl animate-fade-in"
        style={{
          top: Math.min(position.y, window.innerHeight - 320),
          left: Math.min(position.x, window.innerWidth - 340),
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-2 border-b border-gray-100 px-4 py-3">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-semibold text-gray-900">{event.title}</h3>
            <p className="mt-0.5 text-xs text-gray-500">{groupName}</p>
          </div>
          <button onClick={onClose} className="flex-shrink-0 rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-2.5 px-4 py-3">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Clock className="h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
            <span>{formatDate(event.start_time)} &middot; {formatTime(event.start_time)} – {formatTime(event.end_time)}</span>
          </div>
          {(event.location || event.virtual_link) && (
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
              <span className="truncate">{event.location || 'Virtual'}</span>
            </div>
          )}
          {event.max_capacity && (
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Users className="h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
              <span>{event.signup_count ?? 0} / {event.max_capacity} spots</span>
            </div>
          )}
          {categoryLabel && (
            <span className="inline-block rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
              {categoryLabel}
            </span>
          )}
          {event.description && (
            <p className="line-clamp-2 text-xs text-gray-500">{event.description}</p>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 px-4 py-2.5">
          <button onClick={handleViewDetails}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-indigo-700">
            View Details
            <ExternalLink className="h-3 w-3" />
          </button>
        </div>
      </div>
    </>
  );
}
