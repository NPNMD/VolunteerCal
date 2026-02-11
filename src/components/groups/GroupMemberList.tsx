import { Crown, UserMinus } from 'lucide-react';
import type { GroupMember } from '@/types';

interface Props {
  members: GroupMember[];
  currentUserId: string;
  isAdmin: boolean;
  onRemove?: (memberId: string) => void;
}

export function GroupMemberList({ members, currentUserId, isAdmin, onRemove }: Props) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <div className="border-b border-gray-200 px-5 py-3">
        <h3 className="font-semibold text-gray-900">Members ({members.length})</h3>
      </div>
      <div className="divide-y divide-gray-100">
        {members.map((m) => {
          const profile = m.profile as any;
          return (
            <div key={m.id} className="flex items-center justify-between px-5 py-3">
              <div className="flex items-center gap-3">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="" className="h-8 w-8 rounded-full object-cover" />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-sm font-medium text-gray-600">
                    {(profile?.full_name || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-900">{profile?.full_name || profile?.email || 'User'}</p>
                  <p className="text-xs text-gray-500">{profile?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {m.role === 'admin' && (
                  <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                    <Crown className="h-3 w-3" /> Admin
                  </span>
                )}
                {isAdmin && m.user_id !== currentUserId && onRemove && (
                  <button onClick={() => onRemove(m.id)}
                    className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-red-500" title="Remove member">
                    <UserMinus className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
