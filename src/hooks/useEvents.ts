import { useState, useCallback } from 'react';
import { eventsService } from '@/services/events.service';
import type { CalendarEvent, SearchFilters } from '@/types';

export function useEvents() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [currentEvent, setCurrentEvent] = useState<CalendarEvent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEventsByGroup = useCallback(async (groupId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await eventsService.getEventsByGroup(groupId);
      setEvents(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUpcomingEvents = useCallback(async () => {
    setLoading(true);
    try {
      const data = await eventsService.getUpcomingEvents();
      setEvents(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchEvent = useCallback(async (eventId: string) => {
    setLoading(true);
    try {
      const data = await eventsService.getEvent(eventId);
      setCurrentEvent(data);
      return data;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch event');
    } finally {
      setLoading(false);
    }
  }, []);

  const createEvent = useCallback(async (event: Parameters<typeof eventsService.createEvent>[0]) => {
    setLoading(true);
    try {
      const data = await eventsService.createEvent(event);
      setEvents(prev => [...prev, data]);
      return data;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create event');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateEvent = useCallback(async (eventId: string, updates: Partial<CalendarEvent>) => {
    setLoading(true);
    try {
      const data = await eventsService.updateEvent(eventId, updates);
      setEvents(prev => prev.map(e => e.id === eventId ? data : e));
      if (currentEvent?.id === eventId) setCurrentEvent(data);
      return data;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update event');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentEvent]);

  const deleteEvent = useCallback(async (eventId: string) => {
    try {
      await eventsService.deleteEvent(eventId);
      setEvents(prev => prev.filter(e => e.id !== eventId));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete event');
      throw err;
    }
  }, []);

  const searchEvents = useCallback(async (filters: Partial<SearchFilters>) => {
    setLoading(true);
    try {
      const data = await eventsService.searchEvents(filters);
      setEvents(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to search events');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCalendarEvents = useCallback(async (start: string, end: string, groupIds?: string[]) => {
    setLoading(true);
    try {
      const data = await eventsService.getCalendarEvents(start, end, groupIds);
      setEvents(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch calendar events');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    events, currentEvent, loading, error,
    fetchEventsByGroup, fetchUpcomingEvents, fetchEvent,
    createEvent, updateEvent, deleteEvent,
    searchEvents, fetchCalendarEvents,
  };
}
