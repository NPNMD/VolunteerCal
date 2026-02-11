import { supabase } from '@/config/supabase';
import type { EventSignup } from '@/types';

export const signupsService = {
  async getSignups(eventId: string): Promise<EventSignup[]> {
    const { data, error } = await supabase
      .from('event_signups')
      .select('*')
      .eq('event_id', eventId)
      .neq('status', 'cancelled')
      .order('signed_up_at', { ascending: true });
    if (error) throw error;
    const signups = (data || []) as unknown as EventSignup[];
    if (signups.length > 0) {
      const userIds = [...new Set(signups.map((s) => s.user_id))];
      const depIds = signups.map((s) => s.dependent_id).filter(Boolean) as string[];
      const [profilesRes, depsRes] = await Promise.all([
        userIds.length ? supabase.from('profiles').select('id, full_name, avatar_url, email').in('id', userIds) : Promise.resolve({ data: [] }),
        depIds.length ? supabase.from('dependents').select('id, name, age').in('id', depIds) : Promise.resolve({ data: [] }),
      ]);
      const profileMap = new Map((profilesRes.data || []).map((p) => [p.id, p]));
      const depMap = new Map((depsRes.data || []).map((d) => [d.id, d]));
      signups.forEach((s) => {
        (s as EventSignup & { profile?: unknown }).profile = (profileMap.get(s.user_id) ?? undefined) as EventSignup['profile'];
        (s as EventSignup & { dependent?: unknown }).dependent = (s.dependent_id ? depMap.get(s.dependent_id) ?? undefined : undefined) as EventSignup['dependent'];
      });
    }
    return signups;
  },

  async getUserSignups(userId: string): Promise<EventSignup[]> {
    const { data, error } = await supabase
      .from('event_signups')
      .select('*')
      .eq('user_id', userId)
      .neq('status', 'cancelled')
      .order('signed_up_at', { ascending: false });
    if (error) throw error;
    const signups = (data || []) as unknown as EventSignup[];
    if (signups.length > 0) {
      const eventIds = [...new Set(signups.map((s) => s.event_id))];
      const { data: events } = await supabase.from('events').select('id, title, start_time, end_time, status, group_id').in('id', eventIds);
      const groupIds = [...new Set((events || []).map((e) => e.group_id))];
      const { data: groups } = groupIds.length ? await supabase.from('groups').select('id, name').in('id', groupIds) : { data: [] };
      const eventMap = new Map((events || []).map((e) => [e.id, e]));
      const groupMap = new Map((groups || []).map((g) => [g.id, g]));
      signups.forEach((s) => {
        const ev = eventMap.get(s.event_id);
        const grp = ev ? groupMap.get(ev.group_id) : null;
        (s as EventSignup & { event?: unknown }).event = ev ? { ...ev, group: (grp ?? undefined) as { id: string; name: string } | undefined } : undefined;
      });
    }
    return signups;
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
