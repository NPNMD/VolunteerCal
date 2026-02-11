import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useEvents } from '@/hooks/useEvents';
import { useGroups } from '@/hooks/useGroups';
import { CalendarView } from '@/components/calendar/CalendarView';
import { CalendarFilters } from '@/components/calendar/CalendarFilters';

export function CalendarPage() {
  const { user } = useAuth();
  const { events, fetchCalendarEvents } = useEvents();
  const { groups, fetchGroups } = useGroups();
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showMyEvents, setShowMyEvents] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  useEffect(() => {
    if (user) fetchGroups(user.id);
  }, [user, fetchGroups]);

  useEffect(() => {
    if (dateRange.start && dateRange.end) {
      const groupIds = selectedGroups.length > 0 ? selectedGroups : undefined;
      fetchCalendarEvents(dateRange.start, dateRange.end, groupIds);
    }
  }, [dateRange, selectedGroups, fetchCalendarEvents]);

  const filteredEvents = events.filter(e => {
    if (selectedCategory && e.category !== selectedCategory) return false;
    if (showMyEvents && e.created_by !== user?.id) return false;
    return true;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Calendar</h1>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <CalendarFilters
            groups={groups}
            selectedGroups={selectedGroups}
            selectedCategory={selectedCategory}
            showMyEvents={showMyEvents}
            onGroupToggle={(id) => setSelectedGroups(prev => prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id])}
            onCategoryChange={setSelectedCategory}
            onMyEventsToggle={() => setShowMyEvents(!showMyEvents)}
          />
        </div>
        <div className="lg:col-span-3">
          <CalendarView events={filteredEvents} onDateRangeChange={(s, e) => setDateRange({ start: s, end: e })} />
        </div>
      </div>
    </div>
  );
}
