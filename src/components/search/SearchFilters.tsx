import { useState } from 'react';
import { Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { EVENT_CATEGORIES } from '@/config/constants';
import type { Group } from '@/types';

interface Props {
  category: string;
  groupId: string;
  dateFrom: string;
  dateTo: string;
  groups: Group[];
  onCategoryChange: (v: string) => void;
  onGroupChange: (v: string) => void;
  onDateFromChange: (v: string) => void;
  onDateToChange: (v: string) => void;
  onReset: () => void;
}

export function SearchFilters({ category, groupId, dateFrom, dateTo, groups, onCategoryChange, onGroupChange, onDateFromChange, onDateToChange, onReset }: Props) {
  const [expanded, setExpanded] = useState(false);
  const selectCls = 'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20';

  const activeFilterCount = (category ? 1 : 0) + (groupId ? 1 : 0) + (dateFrom ? 1 : 0) + (dateTo ? 1 : 0);

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
        <div className="flex items-center gap-2">
          {activeFilterCount > 0 && (
            <span
              onClick={(e) => { e.stopPropagation(); onReset(); }}
              className="text-xs font-medium text-indigo-600 hover:text-indigo-500"
            >
              Reset
            </span>
          )}
          <span className="lg:hidden text-gray-400">
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </span>
        </div>
      </button>

      {/* Filter content - collapsible on mobile, always visible on desktop */}
      <div className={`space-y-4 px-4 pb-4 ${expanded ? 'block' : 'hidden lg:block'}`}>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">Category</label>
          <select value={category} onChange={(e) => onCategoryChange(e.target.value)} className={selectCls}>
            <option value="">All categories</option>
            {EVENT_CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1).replace('-', ' ')}</option>)}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">Group</label>
          <select value={groupId} onChange={(e) => onGroupChange(e.target.value)} className={selectCls}>
            <option value="">All groups</option>
            {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-1">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">Date From</label>
            <input type="date" value={dateFrom} onChange={(e) => onDateFromChange(e.target.value)} className={selectCls} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">Date To</label>
            <input type="date" value={dateTo} onChange={(e) => onDateToChange(e.target.value)} className={selectCls} />
          </div>
        </div>
      </div>
    </div>
  );
}
