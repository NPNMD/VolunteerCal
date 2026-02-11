import { Filter } from 'lucide-react';
import type { Group } from '@/types';
import { EVENT_CATEGORIES } from '@/config/constants';

interface Props {
  groups: Group[];
  selectedGroups: string[];
  selectedCategory: string;
  showMyEvents: boolean;
  onGroupToggle: (groupId: string) => void;
  onCategoryChange: (category: string) => void;
  onMyEventsToggle: () => void;
}

export function CalendarFilters({ groups, selectedGroups, selectedCategory, showMyEvents, onGroupToggle, onCategoryChange, onMyEventsToggle }: Props) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
        <Filter className="h-4 w-4" /> Filters
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={showMyEvents} onChange={onMyEventsToggle} className="rounded text-indigo-600" />
          My events only
        </label>
      </div>

      <div>
        <p className="mb-2 text-xs font-medium uppercase text-gray-500">Category</p>
        <select value={selectedCategory} onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-sm focus:border-indigo-500 focus:outline-none">
          <option value="">All categories</option>
          {EVENT_CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1).replace('-', ' ')}</option>)}
        </select>
      </div>

      {groups.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-medium uppercase text-gray-500">Groups</p>
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {groups.map(g => (
              <label key={g.id} className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={selectedGroups.includes(g.id)} onChange={() => onGroupToggle(g.id)} className="rounded text-indigo-600" />
                {g.name}
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
