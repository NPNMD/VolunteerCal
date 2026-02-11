import { Link } from 'react-router-dom';
import { Users, Lock, Globe } from 'lucide-react';
import { GROUP_COLORS } from '@/config/constants';
import type { Group } from '@/types';

interface Props {
  group: Group;
}

export function GroupCard({ group }: Props) {
  const color = GROUP_COLORS[group.category || 'other'] || GROUP_COLORS.other;

  return (
    <Link to={`/groups/${group.id}`} className="group block rounded-xl border border-gray-200 bg-white p-5 transition-all hover:border-gray-300 hover:shadow-md">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg" style={{ backgroundColor: `${color}15` }}>
          <Users className="h-6 w-6" style={{ color }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 truncate">{group.name}</h3>
            {group.visibility === 'private' ? (
              <Lock className="h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
            ) : (
              <Globe className="h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
            )}
          </div>
          {group.description && (
            <p className="mt-1 text-sm text-gray-500 line-clamp-2">{group.description}</p>
          )}
          <div className="mt-3 flex items-center gap-3">
            {group.category && (
              <span className="rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ backgroundColor: `${color}15`, color }}>
                {group.category}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
