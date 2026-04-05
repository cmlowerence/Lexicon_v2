import { useMemo, useState } from 'react';
import SearchBar from '../components/SearchBar';
import WordCard from '../components/WordCard';
import QueryBoundary from '../components/QueryBoundary';
import { WordCardSkeleton } from '../components/Skeletons';
import useDebounce from '../hooks/useDebounce';
import { useSearchQuery } from '../hooks/useLexiconQueries';

const MIN_QUERY_LENGTH = 2;
const LANGUAGE = 'en';

export default function Search() {
  const [query, setQuery] = useState('');
  const [isSemantic, setIsSemantic] = useState(false);

  const debouncedQuery = useDebounce(query, 400);
  const normalizedQuery = debouncedQuery.trim();
  const hasValidQuery = normalizedQuery.length >= MIN_QUERY_LENGTH;

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useSearchQuery({
    query: normalizedQuery,
    isSemantic,
    language: LANGUAGE,
    enabled: hasValidQuery,
  });

  const results = useMemo(() => {
    if (!hasValidQuery) return [];
    if (!data) return [];
    return Array.isArray(data) ? data : (data.results || [data]);
  }, [data, hasValidQuery]);

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4 transition-colors">Discover Words</h1>
        <p className="text-gray-500 dark:text-gray-400">Use standard or semantic search to find definitions, concepts, and ideas.</p>
      </div>

      <SearchBar
        searchQuery={query}
        setSearchQuery={setQuery}
        isSemantic={isSemantic}
        setIsSemantic={setIsSemantic}
        onSearch={refetch}
      />

      <div className="mt-12 space-y-6">
        {!hasValidQuery && (
          <div className="text-center text-gray-500 dark:text-gray-300 py-12 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm animate-fade-in">
            Start typing at least {MIN_QUERY_LENGTH} characters to search.
          </div>
        )}

        {hasValidQuery && (
          <QueryBoundary
            isLoading={isLoading}
            isError={isError}
            error={error}
            onRetry={refetch}
            loadingFallback={
              <div className="space-y-6">
                <WordCardSkeleton />
                <WordCardSkeleton />
              </div>
            }
          >
            <>
              {isFetching && <p className="text-xs text-gray-500">Refreshing search results…</p>}

              {results.length === 0 && (
                <div className="text-center text-gray-500 dark:text-gray-300 py-12 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm animate-fade-in">
                  No results found for "{normalizedQuery}". Try a different word or toggle semantic search.
                </div>
              )}

              {results.map((word, index) => (
                <WordCard key={word.id || index} wordData={word} />
              ))}
            </>
          </QueryBoundary>
        )}
      </div>
    </div>
  );
}
