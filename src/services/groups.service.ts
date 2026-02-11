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
    const { data: memberships, error: membersError } = await supabase
      .from('group_members')
      .select('group_id')
      .eq('user_id', userId);
    if (membersError) throw membersError;
    const groupIds = (memberships || []).map((m) => m.group_id);
    if (groupIds.length === 0) return [];
    const { data, error } = await supabase
      .from('groups')
      .select('*')
      .in('id', groupIds)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []) as unknown as Group[];
  },

  async getPublicGroups(): Promise<Group[]> {
    const { data, error } = await supabase
      .from('groups')
      .select('*')
      .eq('visibility', 'public')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []) as unknown as Group[];
  },

  async getGroup(groupId: string): Promise<Group> {
    const { data, error } = await supabase
      .from('groups')
      .select('*')
      .eq('id', groupId)
      .single();
    if (error) throw error;
    return data as unknown as Group;
  },

  async createGroup(group: { name: string; description?: string; category?: string; visibility?: string; created_by: string }) {
    const inviteCode = crypto.randomUUID().replace(/-/g, '').slice(0, 12);
    const { data, error } = await supabase
      .from('groups')
      .insert({ ...group, invite_code: inviteCode })
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
      .select('*')
      .eq('group_id', groupId)
      .order('joined_at', { ascending: true });
    if (error) throw error;
    const members = (data || []) as unknown as GroupMember[];
    if (members.length > 0) {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, email')
        .in('id', members.map((m) => m.user_id));
      const profileMap = new Map((profiles || []).map((p) => [p.id, p]));
      members.forEach((m) => {
        (m as GroupMember & { profile?: unknown }).profile = profileMap.get(m.user_id) ?? null;
      });
    }
    return members;
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
