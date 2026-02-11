import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Plus, Share2, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useGroups } from '@/hooks/useGroups';
import { useEvents } from '@/hooks/useEvents';
import { EventCard } from '@/components/events/EventCard';
import { GroupMemberList } from '@/components/groups/GroupMemberList';
import { InviteModal } from '@/components/groups/InviteModal';

export function GroupDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { currentGroup, members, fetchGroup, fetchMembers, leaveGroup, joinGroup } = useGroups();
  const { events, fetchEventsByGroup } = useEvents();
  const [showInvite, setShowInvite] = useState(false);

  useEffect(() => {
    if (id) {
      fetchGroup(id);
      fetchMembers(id);
      fetchEventsByGroup(id);
    }
  }, [id, fetchGroup, fetchMembers, fetchEventsByGroup]);

  if (!currentGroup) {
    return <div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" /></div>;
  }

  const isMember = members.some(m => m.user_id === user?.id);
  const isAdmin = members.some(m => m.user_id === user?.id && m.role === 'admin');

  const handleLeave = async () => {
    if (!user || !id) return;
    if (confirm('Are you sure you want to leave this group?')) {
      await leaveGroup(id, user.id);
      navigate('/groups');
    }
  };

  const handleJoin = async () => {
    if (!user || !id) return;
    await joinGroup(id, user.id);
    fetchMembers(id);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="space-y-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">{currentGroup.name}</h1>
            {currentGroup.description && <p className="mt-1 text-sm text-gray-600 sm:text-base">{currentGroup.description}</p>}
            {currentGroup.category && (
              <span className="mt-2 inline-block rounded-full bg-indigo-100 px-3 py-0.5 text-xs font-medium text-indigo-700">
                {currentGroup.category}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {isMember ? (
              <>
                <Link to={`/events/create?group=${id}`}
                  className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 active:bg-indigo-800 sm:flex-none">
                  <Plus className="h-4 w-4" /> Create Event
                </Link>
                <button onClick={() => setShowInvite(true)}
                  className="flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 active:bg-gray-100">
                  <Share2 className="h-4 w-4" /> <span className="sm:hidden">Invite</span>
                </button>
                <button onClick={handleLeave}
                  className="flex items-center gap-1 rounded-lg border border-red-200 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 active:bg-red-100">
                  <LogOut className="h-4 w-4" /> <span className="sm:hidden">Leave</span>
                </button>
              </>
            ) : (
              <button onClick={handleJoin}
                className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-medium text-white hover:bg-indigo-700 active:bg-indigo-800 sm:w-auto sm:py-2">
                Join Group
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Events</h2>
          {events.length === 0 ? (
            <p className="text-sm text-gray-500">No events yet. Create one to get started!</p>
          ) : (
            events.map(e => <EventCard key={e.id} event={e} />)
          )}
        </div>
        <div>
          <GroupMemberList members={members} currentUserId={user?.id || ''} isAdmin={isAdmin} />
        </div>
      </div>

      {showInvite && (
        <InviteModal inviteCode={currentGroup.invite_code} groupName={currentGroup.name} onClose={() => setShowInvite(false)} />
      )}
    </div>
  );
}
