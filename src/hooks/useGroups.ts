import { useState, useCallback } from 'react';
import { groupsService } from '@/services/groups.service';
import type { Group, GroupMember } from '@/types';

export function useGroups() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [publicGroups, setPublicGroups] = useState<Group[]>([]);
  const [currentGroup, setCurrentGroup] = useState<Group | null>(null);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGroups = useCallback(async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await groupsService.getGroups(userId);
      setGroups(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch groups');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPublicGroups = useCallback(async () => {
    setLoading(true);
    try {
      const data = await groupsService.getPublicGroups();
      setPublicGroups(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch public groups');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchGroup = useCallback(async (groupId: string) => {
    setLoading(true);
    try {
      const data = await groupsService.getGroup(groupId);
      setCurrentGroup(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch group');
    } finally {
      setLoading(false);
    }
  }, []);

  const createGroup = useCallback(async (group: Parameters<typeof groupsService.createGroup>[0]) => {
    setLoading(true);
    try {
      const data = await groupsService.createGroup(group);
      setGroups(prev => [...prev, data]);
      return data;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create group');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateGroup = useCallback(async (groupId: string, updates: Partial<Group>) => {
    setLoading(true);
    try {
      const data = await groupsService.updateGroup(groupId, updates);
      setGroups(prev => prev.map(g => g.id === groupId ? data : g));
      if (currentGroup?.id === groupId) setCurrentGroup(data);
      return data;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update group');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentGroup]);

  const deleteGroup = useCallback(async (groupId: string) => {
    try {
      await groupsService.deleteGroup(groupId);
      setGroups(prev => prev.filter(g => g.id !== groupId));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete group');
      throw err;
    }
  }, []);

  const fetchMembers = useCallback(async (groupId: string) => {
    try {
      const data = await groupsService.getMembers(groupId);
      setMembers(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch members');
    }
  }, []);

  const joinGroup = useCallback(async (groupId: string, userId: string) => {
    try {
      await groupsService.joinGroup(groupId, userId);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to join group');
      throw err;
    }
  }, []);

  const joinByInviteCode = useCallback(async (code: string, userId: string) => {
    try {
      await groupsService.joinByInviteCode(code, userId);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid invite code');
      throw err;
    }
  }, []);

  const leaveGroup = useCallback(async (groupId: string, userId: string) => {
    try {
      await groupsService.leaveGroup(groupId, userId);
      setGroups(prev => prev.filter(g => g.id !== groupId));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to leave group');
      throw err;
    }
  }, []);

  return {
    groups, publicGroups, currentGroup, members, loading, error,
    fetchGroups, fetchPublicGroups, fetchGroup, createGroup, updateGroup, deleteGroup,
    fetchMembers, joinGroup, joinByInviteCode, leaveGroup,
  };
}
