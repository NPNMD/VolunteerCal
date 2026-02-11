import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Calendar, Users, ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useGroups } from '@/hooks/useGroups';
import { useEvents } from '@/hooks/useEvents';
import { GroupCard } from '@/components/groups/GroupCard';
import { EventCard } from '@/components/events/EventCard';

export function DashboardPage() {
  const { user, profile } = useAuth();
  const { groups, fetchGroups } = useGroups();
  const { events, fetchUpcomingEvents } = useEvents();

  useEffect(() => {
    if (user) {
      fetchGroups(user.id);
      fetchUpcomingEvents();
    }
  }, [user, fetchGroups, fetchUpcomingEvents]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {profile?.full_name || 'Volunteer'}!</h1>
        <p className="mt-1 text-gray-500">Here's what's happening with your groups and events.</p>
      </div>

      {/* Quick actions */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Link to="/groups" className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 hover:border-indigo-200 hover:shadow-md transition-all">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100">
            <Users className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">My Groups</p>
            <p className="text-sm text-gray-500">{groups.length} groups</p>
          </div>
        </Link>
        <Link to="/calendar" className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 hover:border-indigo-200 hover:shadow-md transition-all">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
            <Calendar className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">Calendar</p>
            <p className="text-sm text-gray-500">View all events</p>
          </div>
        </Link>
        <Link to="/search" className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 hover:border-indigo-200 hover:shadow-md transition-all">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
            <Plus className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">Discover</p>
            <p className="text-sm text-gray-500">Find events & groups</p>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Groups */}
        <div className="lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">My Groups</h2>
            <Link to="/groups" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 flex items-center gap-1">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {groups.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white p-6 text-center">
              <Users className="mx-auto h-8 w-8 text-gray-400" />
              <p className="mt-2 text-sm font-medium text-gray-900">No groups yet</p>
              <p className="mt-1 text-xs text-gray-500">Create or join a group to get started</p>
              <Link to="/groups" className="mt-3 inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700">
                <Plus className="h-3 w-3" /> Create Group
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {groups.slice(0, 5).map(g => <GroupCard key={g.id} group={g} />)}
            </div>
          )}
        </div>

        {/* Upcoming Events */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Events</h2>
            <Link to="/calendar" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 flex items-center gap-1">
              Calendar <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {events.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
              <Calendar className="mx-auto h-8 w-8 text-gray-400" />
              <p className="mt-2 text-sm font-medium text-gray-900">No upcoming events</p>
              <p className="mt-1 text-xs text-gray-500">Events from your groups will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {events.slice(0, 8).map(e => <EventCard key={e.id} event={e} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
