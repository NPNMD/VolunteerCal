import { User, Mail, Phone, Edit2 } from 'lucide-react';
import type { Profile } from '@/types';

interface Props {
  profile: Profile;
  onEdit?: () => void;
  isOwn?: boolean;
}

export function ProfileCard({ profile, onEdit, isOwn = false }: Props) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="flex items-start gap-4">
        {profile.avatar_url ? (
          <img src={profile.avatar_url} alt="" className="h-16 w-16 rounded-full object-cover" />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
            <User className="h-8 w-8 text-indigo-600" />
          </div>
        )}
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">{profile.full_name || 'Unnamed User'}</h2>
            {isOwn && onEdit && (
              <button onClick={onEdit} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                <Edit2 className="h-4 w-4" />
              </button>
            )}
          </div>
          {profile.bio && <p className="mt-1 text-sm text-gray-600">{profile.bio}</p>}
          <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1"><Mail className="h-4 w-4" /> {profile.email}</span>
            {profile.phone && <span className="flex items-center gap-1"><Phone className="h-4 w-4" /> {profile.phone}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
