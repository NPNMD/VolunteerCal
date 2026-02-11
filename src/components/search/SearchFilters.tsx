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
  const selectCls = 'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20';

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">Filters</h3>
        <button onClick={onReset} className="text-xs font-medium text-indigo-600 hover:text-indigo-500">Reset</button>
      </div>

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

      <div>
        <label className="mb-1 block text-xs font-medium text-gray-500">Date From</label>
        <input type="date" value={dateFrom} onChange={(e) => onDateFromChange(e.target.value)} className={selectCls} />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-gray-500">Date To</label>
        <input type="date" value={dateTo} onChange={(e) => onDateToChange(e.target.value)} className={selectCls} />
      </div>
    </div>
  );
}
