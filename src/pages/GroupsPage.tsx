import { useState, useEffect } from 'react';
import { Plus, UserPlus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useGroups } from '@/hooks/useGroups';
import { GroupCard } from '@/components/groups/GroupCard';
import { GroupForm } from '@/components/groups/GroupForm';

export function GroupsPage() {
  const { user } = useAuth();
  const { groups, publicGroups, fetchGroups, fetchPublicGroups, createGroup, joinByInviteCode } = useGroups();
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [joinError, setJoinError] = useState('');

  useEffect(() => {
    if (user) {
      fetchGroups(user.id);
      fetchPublicGroups();
    }
  }, [user, fetchGroups, fetchPublicGroups]);

  const handleCreate = async (values: { name: string; description: string; category: string; visibility: string }) => {
    if (!user) return;
    await createGroup({ ...values, created_by: user.id });
    setShowCreate(false);
    fetchGroups(user.id);
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !inviteCode.trim()) return;
    setJoinError('');
    try {
      await joinByInviteCode(inviteCode.trim(), user.id);
      setShowJoin(false);
      setInviteCode('');
      fetchGroups(user.id);
    } catch {
      setJoinError('Invalid invite code');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Groups</h1>
        <div className="flex gap-2">
          <button onClick={() => setShowJoin(!showJoin)}
            className="flex items-center gap-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            <UserPlus className="h-4 w-4" /> Join
          </button>
          <button onClick={() => setShowCreate(!showCreate)}
            className="flex items-center gap-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
            <Plus className="h-4 w-4" /> Create Group
          </button>
        </div>
      </div>

      {showJoin && (
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5">
          <h3 className="mb-3 font-semibold text-gray-900">Join with Invite Code</h3>
          <form onSubmit={handleJoin} className="flex gap-3">
            <input type="text" value={inviteCode} onChange={(e) => setInviteCode(e.target.value)}
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              placeholder="Paste invite code" />
            <button type="submit" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">Join</button>
          </form>
          {joinError && <p className="mt-2 text-sm text-red-600">{joinError}</p>}
        </div>
      )}

      {showCreate && (
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5">
          <h3 className="mb-4 font-semibold text-gray-900">Create New Group</h3>
          <GroupForm onSubmit={handleCreate} onCancel={() => setShowCreate(false)} />
        </div>
      )}

      {/* My Groups */}
      <div className="mb-10">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">My Groups</h2>
        {groups.length === 0 ? (
          <p className="text-sm text-gray-500">You haven't joined any groups yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {groups.map(g => <GroupCard key={g.id} group={g} />)}
          </div>
        )}
      </div>

      {/* Discover */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Discover Public Groups</h2>
        {publicGroups.length === 0 ? (
          <p className="text-sm text-gray-500">No public groups available.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {publicGroups.map(g => <GroupCard key={g.id} group={g} />)}
          </div>
        )}
      </div>
    </div>
  );
}
