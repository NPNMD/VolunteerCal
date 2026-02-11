import { EventCard } from '@/components/events/EventCard';
import type { CalendarEvent } from '@/types';

interface Props {
  events: CalendarEvent[];
  loading: boolean;
}

export function SearchResults({ events, loading }: Props) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-lg font-medium text-gray-900">No events found</p>
        <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {events.map(event => <EventCard key={event.id} event={event} />)}
    </div>
  );
}
