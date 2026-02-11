import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSearch } from '@/hooks/useSearch';
import { useGroups } from '@/hooks/useGroups';
import { SearchBar } from '@/components/search/SearchBar';
import { SearchFilters } from '@/components/search/SearchFilters';
import { SearchResults } from '@/components/search/SearchResults';

export function SearchPage() {
  const { user } = useAuth();
  const { results, loading, filters, search, updateFilter, resetFilters } = useSearch();
  const { groups, fetchGroups } = useGroups();

  useEffect(() => {
    if (user) fetchGroups(user.id);
  }, [user, fetchGroups]);

  // Run initial search on mount
  useEffect(() => {
    search({});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Search Events</h1>
      <div className="mb-6">
        <SearchBar
          value={filters.query ?? ''}
          onChange={(v) => updateFilter('query', v || undefined)}
          onSubmit={() => search()}
        />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <SearchFilters
            category={filters.category ?? ''}
            groupId={filters.group_id ?? ''}
            dateFrom={filters.date_from ?? ''}
            dateTo={filters.date_to ?? ''}
            groups={groups}
            onCategoryChange={(v) => updateFilter('category', v || undefined)}
            onGroupChange={(v) => updateFilter('group_id', v || undefined)}
            onDateFromChange={(v) => updateFilter('date_from', v || undefined)}
            onDateToChange={(v) => updateFilter('date_to', v || undefined)}
            onReset={resetFilters}
          />
        </div>
        <div className="lg:col-span-3">
          <SearchResults events={results} loading={loading} />
        </div>
      </div>
    </div>
  );
}
