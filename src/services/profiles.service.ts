import { supabase } from '@/config/supabase';
import type { Profile, Dependent } from '@/types';

export const profilesService = {
  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) throw error;
    return data as Profile;
  },

  async updateProfile(userId: string, updates: Partial<Profile>) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    if (error) throw error;
    return data as Profile;
  },

  async getDependents(userId: string): Promise<Dependent[]> {
    const { data, error } = await supabase
      .from('dependents')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });
    if (error) throw error;
    return (data || []) as Dependent[];
  },

  async addDependent(userId: string, dependent: { name: string; age?: number; notes?: string }) {
    const { data, error } = await supabase
      .from('dependents')
      .insert({ user_id: userId, ...dependent })
      .select()
      .single();
    if (error) throw error;
    return data as Dependent;
  },

  async updateDependent(dependentId: string, updates: Partial<Dependent>) {
    const { data, error } = await supabase
      .from('dependents')
      .update(updates)
      .eq('id', dependentId)
      .select()
      .single();
    if (error) throw error;
    return data as Dependent;
  },

  async deleteDependent(dependentId: string) {
    const { error } = await supabase
      .from('dependents')
      .delete()
      .eq('id', dependentId);
    if (error) throw error;
  },
};
