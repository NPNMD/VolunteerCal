import { supabase } from '@/config/supabase';
import type { CalendarEvent, SearchFilters } from '@/types';

export const eventsService = {
  async getEventsByGroup(groupId: string): Promise<CalendarEvent[]> {
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        creator:profiles!events_created_by_fkey(id, full_name, avatar_url),
        group:groups!events_group_id_fkey(id, name, category)
      `)
      .eq('group_id', groupId)
      .neq('status', 'draft')
      .order('start_time', { ascending: true });
    if (error) throw error;
    return (data || []) as unknown as CalendarEvent[];
  },

  async getUpcomingEvents(): Promise<CalendarEvent[]> {
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        creator:profiles!events_created_by_fkey(id, full_name, avatar_url),
        group:groups!events_group_id_fkey(id, name, category)
      `)
      .eq('status', 'published')
      .gte('start_time', new Date().toISOString())
      .order('start_time', { ascending: true })
      .limit(20);
    if (error) throw error;
    return (data || []) as unknown as CalendarEvent[];
  },

  async getEvent(eventId: string): Promise<CalendarEvent> {
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        creator:profiles!events_created_by_fkey(id, full_name, avatar_url),
        group:groups!events_group_id_fkey(id, name, category)
      `)
      .eq('id', eventId)
      .single();
    if (error) throw error;
    return data as unknown as CalendarEvent;
  },

  async createEvent(event: {
    group_id: string;
    created_by: string;
    title: string;
    description?: string;
    category?: string;
    goals?: string;
    plan?: string;
    location?: string;
    virtual_link?: string;
    start_time: string;
    end_time: string;
    timezone?: string;
    recurrence?: string;
    max_capacity?: number;
    signup_deadline?: string;
    status?: string;
  }) {
    const { data, error } = await supabase
      .from('events')
      .insert(event)
      .select()
      .single();
    if (error) throw error;
    return data as unknown as CalendarEvent;
  },

  async updateEvent(eventId: string, updates: Partial<CalendarEvent>) {
    const { data, error } = await supabase
      .from('events')
      .update(updates)
      .eq('id', eventId)
      .select()
      .single();
    if (error) throw error;
    return data as unknown as CalendarEvent;
  },

  async deleteEvent(eventId: string) {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId);
    if (error) throw error;
  },

  async searchEvents(filters: Partial<SearchFilters>): Promise<CalendarEvent[]> {
    let query = supabase
      .from('events')
      .select(`
        *,
        creator:profiles!events_created_by_fkey(id, full_name, avatar_url),
        group:groups!events_group_id_fkey(id, name, category)
      `)
      .eq('status', 'published');

    if (filters.query) {
      query = query.ilike('title', `%${filters.query}%`);
    }
    if (filters.creator) {
      query = query.eq('created_by', filters.creator);
    }
    if (filters.category) {
      query = query.eq('category', filters.category);
    }
    if (filters.group_id) {
      query = query.eq('group_id', filters.group_id);
    }
    if (filters.date_from) {
      query = query.gte('start_time', filters.date_from);
    }
    if (filters.date_to) {
      query = query.lte('start_time', filters.date_to);
    }

    query = query.order('start_time', { ascending: true }).limit(50);

    const { data, error } = await query;
    if (error) throw error;
    return (data || []) as unknown as CalendarEvent[];
  },

  async getCalendarEvents(startDate: string, endDate: string, groupIds?: string[]): Promise<CalendarEvent[]> {
    let query = supabase
      .from('events')
      .select(`
        *,
        group:groups!events_group_id_fkey(id, name, category)
      `)
      .eq('status', 'published')
      .gte('start_time', startDate)
      .lte('start_time', endDate);

    if (groupIds && groupIds.length > 0) {
      query = query.in('group_id', groupIds);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data || []) as unknown as CalendarEvent[];
  },
};
