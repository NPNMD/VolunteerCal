import { Link } from 'react-router-dom';
import { MapPin, Users, Clock } from 'lucide-react';
import { formatDate, formatTime, isUpcoming } from '@/utils/dateHelpers';
import { GROUP_COLORS } from '@/config/constants';
import { cn } from '@/utils/cn';
import type { CalendarEvent } from '@/types';

interface Props {
  event: CalendarEvent;
  compact?: boolean;
}

export function EventCard({ event, compact = false }: Props) {
  const upcoming = isUpcoming(event.start_time);
  const groupColor = GROUP_COLORS[(event.group as any)?.category || 'other'] || GROUP_COLORS.other;

  return (
    <Link to={`/events/${event.id}`}
      className={cn(
        'group block rounded-2xl border transition-all hover:shadow-md',
        compact ? 'p-4' : 'p-5'
      )}
      style={{
        backgroundColor: '#FAF8F5',
        borderColor: '#F5F3F0',
      }}>
      <div className="flex items-start gap-4">
        <div className={cn('flex flex-col items-center justify-center rounded-xl px-3 py-2 text-center')} 
          style={{
            backgroundColor: upcoming ? '#F5F0FA' : '#F5F3F0'
          }}>
          <span className={cn('text-xs font-medium uppercase')} 
            style={{
              color: upcoming ? '#9B4DCA' : '#9E9690'
            }}>
            {formatDate(event.start_time).split(' ')[0]}
          </span>
          <span className={cn('text-xl font-bold')} 
            style={{
              color: upcoming ? '#8B5CF6' : '#8B8480'
            }}>
            {new Date(event.start_time).getDate()}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className={cn('font-semibold truncate transition-colors', compact ? 'text-sm' : 'text-base')} 
              style={{
                color: '#2C2825',
              }}>
              {event.title}
            </h3>
            {event.status === 'cancelled' && (
              <span className="rounded-full px-2 py-0.5 text-xs font-medium" style={{backgroundColor: '#F5F0FA', color: '#E76F51'}}>Cancelled</span>
            )}
          </div>
          {!compact && event.description && (
            <p className="mt-1 text-sm line-clamp-2" style={{color: '#8B8480'}}>{event.description}</p>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs" style={{color: '#9E9690'}}>
            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" strokeWidth={2.5} /> {formatTime(event.start_time)}</span>
            {event.location && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" strokeWidth={2.5} /> {event.location}</span>}
            {event.max_capacity && (
              <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" strokeWidth={2.5} /> {event.signup_count ?? 0}/{event.max_capacity}</span>
            )}
            {(event.group as any)?.name && (
              <span className="rounded-full px-2 py-0.5 text-xs font-medium" style={{ backgroundColor: `${groupColor}15`, color: groupColor }}>
                {(event.group as any).name}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
