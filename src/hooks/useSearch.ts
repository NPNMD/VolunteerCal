import { useState, useCallback, useEffect, useRef } from 'react';
import { eventsService } from '@/services/events.service';
import type { CalendarEvent, SearchFilters } from '@/types';

const DEBOUNCE_MS = 300;

export function useSearch() {
  const [results, setResults] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Partial<SearchFilters>>({});
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /** Run a search with the given (or current) filters. */
  const search = useCallback(async (overrides?: Partial<SearchFilters>) => {
    const activeFilters = overrides ?? filters;
    setLoading(true);
    setError(null);
    try {
      const data = await eventsService.searchEvents(activeFilters);
      setResults(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  /** Update a single filter field and trigger a debounced search. */
  const updateFilter = useCallback(<K extends keyof SearchFilters>(
    key: K,
    value: SearchFilters[K] | undefined,
  ) => {
    setFilters(prev => {
      const next = { ...prev };
      if (value) {
        next[key] = value;
      } else {
        delete next[key];
      }
      return next;
    });
  }, []);

  /** Reset all filters and re-search. */
  const resetFilters = useCallback(() => {
    setFilters({});
    search({});
  }, [search]);

  // Debounce: re-search whenever filters change
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      search(filters);
    }, DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [filters]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    results,
    loading,
    error,
    filters,
    search,
    updateFilter,
    resetFilters,
    setFilters,
  };
}
