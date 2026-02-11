/**
 * reminders.service.ts
 * ---------------------
 * CRUD operations for the `reminders` table.
 * Handles creating, reading, updating, and deleting reminders
 * that are later processed by the Edge Function cron job.
 */

import { supabase } from '@/config/supabase';
import type { Reminder } from '@/types';

export const remindersService = {
  /** Get all reminders for a specific user. */
  async getByUser(userId: string): Promise<Reminder[]> {
    const { data, error } = await supabase
      .from('reminders')
      .select('*')
      .eq('user_id', userId)
      .order('remind_at', { ascending: true });
    if (error) throw error;
    return (data || []) as Reminder[];
  },

  /** Get all reminders for a specific event. */
  async getByEvent(eventId: string): Promise<Reminder[]> {
    const { data, error } = await supabase
      .from('reminders')
      .select('*')
      .eq('event_id', eventId)
      .order('remind_at', { ascending: true });
    if (error) throw error;
    return (data || []) as Reminder[];
  },

  /** Create a new reminder. */
  async create(reminder: {
    event_id: string;
    user_id: string;
    remind_at: string;
    channel?: 'email' | 'in_app' | 'both';
  }): Promise<Reminder> {
    const { data, error } = await supabase
      .from('reminders')
      .insert({
        event_id: reminder.event_id,
        user_id: reminder.user_id,
        remind_at: reminder.remind_at,
        channel: reminder.channel ?? 'both',
        sent: false,
      })
      .select()
      .single();
    if (error) throw error;
    return data as Reminder;
  },

  /** Update an existing reminder (e.g. change time or channel). */
  async update(
    reminderId: string,
    updates: Partial<Pick<Reminder, 'remind_at' | 'channel'>>,
  ): Promise<Reminder> {
    const { data, error } = await supabase
      .from('reminders')
      .update(updates)
      .eq('id', reminderId)
      .select()
      .single();
    if (error) throw error;
    return data as Reminder;
  },

  /** Delete a reminder. */
  async remove(reminderId: string): Promise<void> {
    const { error } = await supabase
      .from('reminders')
      .delete()
      .eq('id', reminderId);
    if (error) throw error;
  },

  /** Delete all reminders for an event (e.g. when event is cancelled). */
  async removeByEvent(eventId: string): Promise<void> {
    const { error } = await supabase
      .from('reminders')
      .delete()
      .eq('event_id', eventId);
    if (error) throw error;
  },

  /**
   * Auto-create a default reminder when a user signs up for an event.
   * Defaults to 24 hours before the event start via both channels.
   */
  async createDefaultForSignup(
    eventId: string,
    userId: string,
    eventStartTime: string,
  ): Promise<Reminder> {
    const remindAt = new Date(
      new Date(eventStartTime).getTime() - 24 * 60 * 60 * 1000,
    ).toISOString();

    return this.create({
      event_id: eventId,
      user_id: userId,
      remind_at: remindAt,
      channel: 'both',
    });
  },
};
