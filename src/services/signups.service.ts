import { supabase } from '@/config/supabase';
import type { EventSignup } from '@/types';

export const signupsService = {
  async getSignups(eventId: string): Promise<EventSignup[]> {
    const { data, error } = await supabase
      .from('event_signups')
      .select(`
        *,
        profile:profiles(id, full_name, avatar_url, email),
        dependent:dependents(id, name, age)
      `)
      .eq('event_id', eventId)
      .neq('status', 'cancelled')
      .order('signed_up_at', { ascending: true });
    if (error) throw error;
    return (data || []) as unknown as EventSignup[];
  },

  async getUserSignups(userId: string): Promise<EventSignup[]> {
    const { data, error } = await supabase
      .from('event_signups')
      .select(`
        *,
        event:events(id, title, start_time, end_time, status, group:groups(id, name))
      `)
      .eq('user_id', userId)
      .neq('status', 'cancelled')
      .order('signed_up_at', { ascending: false });
    if (error) throw error;
    return (data || []) as unknown as EventSignup[];
  },

  async signUp(eventId: string, userId: string, dependentId?: string): Promise<EventSignup> {
    // Check capacity
    const { data: event } = await supabase
      .from('events')
      .select('max_capacity')
      .eq('id', eventId)
      .single();

    let status = 'confirmed';

    if (event?.max_capacity) {
      const { count } = await supabase
        .from('event_signups')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', eventId)
        .eq('status', 'confirmed');

      if (count !== null && count >= event.max_capacity) {
        status = 'waitlisted';
      }
    }

    const { data, error } = await supabase
      .from('event_signups')
      .insert({
        event_id: eventId,
        user_id: userId,
        dependent_id: dependentId || null,
        status,
      })
      .select()
      .single();
    if (error) throw error;
    return data as unknown as EventSignup;
  },

  async cancelSignup(signupId: string) {
    const { error } = await supabase
      .from('event_signups')
      .update({ status: 'cancelled' })
      .eq('id', signupId);
    if (error) throw error;
  },

  async isSignedUp(eventId: string, userId: string): Promise<EventSignup | null> {
    const { data } = await supabase
      .from('event_signups')
      .select('*')
      .eq('event_id', eventId)
      .eq('user_id', userId)
      .is('dependent_id', null)
      .neq('status', 'cancelled')
      .maybeSingle();
    return data as EventSignup | null;
  },

  async getSignupCount(eventId: string): Promise<number> {
    const { count, error } = await supabase
      .from('event_signups')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', eventId)
      .eq('status', 'confirmed');
    if (error) throw error;
    return count || 0;
  },
};
