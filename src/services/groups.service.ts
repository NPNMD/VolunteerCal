import { supabase } from '@/config/supabase';
import type { Group, GroupMember } from '@/types';

/** Translate Supabase/Postgres errors into user-friendly messages for group creation. */
function translateGroupError(err: { code?: string; message?: string }): Error {
  const code = err?.code ?? '';
  const msg = err?.message ?? '';
  if (code === '23503' || msg.includes('foreign key constraint')) {
    return new Error(
      'Your profile may not be set up yet. Please refresh the page, complete your profile, and try again.'
    );
  }
  if (code === '42501' || msg.includes('row-level security') || msg.includes('policy')) {
    return new Error('You do not have permission to create groups. Please sign in and try again.');
  }
  if (code === '23505' || msg.includes('unique constraint')) {
    return new Error('A group with this name or invite code already exists. Please try a different name.');
  }
  return new Error(msg || 'Failed to create group. Please try again.');
}

export const groupsService = {
  async getGroups(userId: string): Promise<Group[]> {
    const { data, error } = await supabase
      .from('groups')
      .select(`
        *,
        group_members!inner(user_id),
        creator:profiles!groups_created_by_fkey(id, full_name, avatar_url)
      `)
      .eq('group_members.user_id', userId);
    if (error) throw error;
    return (data || []) as unknown as Group[];
  },

  async getPublicGroups(): Promise<Group[]> {
    const { data, error } = await supabase
      .from('groups')
      .select(`
        *,
        creator:profiles!groups_created_by_fkey(id, full_name, avatar_url)
      `)
      .eq('visibility', 'public')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []) as unknown as Group[];
  },

  async getGroup(groupId: string): Promise<Group> {
    const { data, error } = await supabase
      .from('groups')
      .select(`
        *,
        creator:profiles!groups_created_by_fkey(id, full_name, avatar_url)
      `)
      .eq('id', groupId)
      .single();
    if (error) throw error;
    return data as unknown as Group;
  },

  async createGroup(group: { name: string; description?: string; category?: string; visibility?: string; created_by: string }) {
    const { data, error } = await supabase
      .from('groups')
      .insert(group)
      .select()
      .single();
    if (error) throw translateGroupError(error);

    // Auto-add creator as admin
    const { error: memberError } = await supabase.from('group_members').insert({
      group_id: data.id,
      user_id: group.created_by,
      role: 'admin',
    });
    if (memberError) throw translateGroupError(memberError);

    return data as unknown as Group;
  },

  async updateGroup(groupId: string, updates: Partial<Group>) {
    const { data, error } = await supabase
      .from('groups')
      .update(updates)
      .eq('id', groupId)
      .select()
      .single();
    if (error) throw error;
    return data as unknown as Group;
  },

  async deleteGroup(groupId: string) {
    const { error } = await supabase
      .from('groups')
      .delete()
      .eq('id', groupId);
    if (error) throw error;
  },

  async getMembers(groupId: string): Promise<GroupMember[]> {
    const { data, error } = await supabase
      .from('group_members')
      .select(`
        *,
        profile:profiles(id, full_name, avatar_url, email)
      `)
      .eq('group_id', groupId)
      .order('joined_at', { ascending: true });
    if (error) throw error;
    return (data || []) as unknown as GroupMember[];
  },

  async joinGroup(groupId: string, userId: string, role: string = 'member') {
    const { data, error } = await supabase
      .from('group_members')
      .insert({ group_id: groupId, user_id: userId, role })
      .select()
      .single();
    if (error) throw error;
    return data as unknown as GroupMember;
  },

  async joinByInviteCode(inviteCode: string, userId: string) {
    const { data: group, error: groupError } = await supabase
      .from('groups')
      .select('id')
      .eq('invite_code', inviteCode)
      .single();
    if (groupError) throw new Error('Invalid invite code');
    return this.joinGroup(group.id, userId);
  },

  async leaveGroup(groupId: string, userId: string) {
    const { error } = await supabase
      .from('group_members')
      .delete()
      .eq('group_id', groupId)
      .eq('user_id', userId);
    if (error) throw error;
  },

  async updateMemberRole(memberId: string, role: string) {
    const { error } = await supabase
      .from('group_members')
      .update({ role })
      .eq('id', memberId);
    if (error) throw error;
  },

  async removeMember(memberId: string) {
    const { error } = await supabase
      .from('group_members')
      .delete()
      .eq('id', memberId);
    if (error) throw error;
  },
};
