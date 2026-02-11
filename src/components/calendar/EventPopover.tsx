import { useNavigate } from 'react-router-dom';
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

  if (!event || !position) return null;

  const groupName = (event.group as any)?.name ?? 'Unknown Group';
  const categoryLabel = event.category
    ? event.category.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    : null;

  return (
    <>
      {/* Backdrop -- closes popover on click */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      <div
        className="fixed z-50 w-80 rounded-xl border border-gray-200 bg-white shadow-xl animate-in fade-in zoom-in-95"
        style={{
          top: Math.min(position.y, window.innerHeight - 320),
          left: Math.min(position.x, window.innerWidth - 340),
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-2 border-b border-gray-100 px-4 py-3">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-semibold text-gray-900">
              {event.title}
            </h3>
            <p className="mt-0.5 text-xs text-gray-500">{groupName}</p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-2.5 px-4 py-3">
          {/* Date & Time */}
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Clock className="h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
            <span>
              {formatDate(event.start_time)} &middot; {formatTime(event.start_time)} – {formatTime(event.end_time)}
            </span>
          </div>

          {/* Location */}
          {(event.location || event.virtual_link) && (
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
              <span className="truncate">{event.location || 'Virtual'}</span>
            </div>
          )}

          {/* Capacity */}
          {event.max_capacity && (
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Users className="h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
              <span>
                {event.signup_count ?? 0} / {event.max_capacity} spots
              </span>
            </div>
          )}

          {/* Category badge */}
          {categoryLabel && (
            <span className="inline-block rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
              {categoryLabel}
            </span>
          )}

          {/* Description snippet */}
          {event.description && (
            <p className="line-clamp-2 text-xs text-gray-500">
              {event.description}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 px-4 py-2.5">
          <button
            onClick={() => {
              onClose();
              navigate(`/events/${event.id}`);
            }}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-indigo-700"
          >
            View Details
            <ExternalLink className="h-3 w-3" />
          </button>
        </div>
      </div>
    </>
  );
}
