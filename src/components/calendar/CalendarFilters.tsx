import { useState } from 'react';
import { Filter, ChevronDown, ChevronUp } from 'lucide-react';
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
  const [expanded, setExpanded] = useState(false);

  const activeFilterCount = (showMyEvents ? 1 : 0) + (selectedCategory ? 1 : 0) + selectedGroups.length;

  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      {/* Header - always visible, acts as toggle on mobile */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between p-4 lg:cursor-default"
      >
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
          <Filter className="h-4 w-4" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-indigo-100 px-1.5 text-xs font-medium text-indigo-700">
              {activeFilterCount}
            </span>
          )}
        </div>
        <span className="lg:hidden text-gray-400">
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </span>
      </button>

      {/* Filter content - collapsible on mobile, always visible on desktop */}
      <div className={`space-y-4 px-4 pb-4 ${expanded ? 'block' : 'hidden lg:block'}`}>
        <div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={showMyEvents} onChange={onMyEventsToggle} className="rounded text-indigo-600" />
            My events only
          </label>
        </div>

        <div>
          <p className="mb-2 text-xs font-medium uppercase text-gray-500">Category</p>
          <select value={selectedCategory} onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none">
            <option value="">All categories</option>
            {EVENT_CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1).replace('-', ' ')}</option>)}
          </select>
        </div>

        {groups.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-medium uppercase text-gray-500">Groups</p>
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {groups.map(g => (
                <label key={g.id} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={selectedGroups.includes(g.id)} onChange={() => onGroupToggle(g.id)} className="rounded text-indigo-600" />
                  <span className="truncate">{g.name}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
