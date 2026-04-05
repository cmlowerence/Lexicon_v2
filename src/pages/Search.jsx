import { useState, useEffect, useCallback } from 'react';
import SearchBar from '../components/SearchBar';
import WordCard from '../components/WordCard';
import { WordCardSkeleton } from '../components/Skeletons';
import { publicApi } from '../api/publicApi';
import useDebounce from '../hooks/useDebounce';

export default function Search() {
  const [query, setQuery] = useState('');
  const [isSemantic, setIsSemantic] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const debouncedQuery = useDebounce(query, 400);

  const performSearch = useCallback(async (searchWord, semanticFlag) => {
    if (!searchWord.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }

    setLoading(true);
    setSearched(true);
    try {
      const data = await publicApi.searchWord(searchWord, semanticFlag, 'en');
      setResults(Array.isArray(data) ? data : (data.results || [data]));
    } catch (error) {
      console.error('Search failed', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    performSearch(debouncedQuery, isSemantic);
  }, [debouncedQuery, isSemantic, performSearch]);

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
        onSearch={() => performSearch(query, isSemantic)}
      />

      <div className="mt-12 space-y-6">
        {loading && (
          <div className="space-y-6">
            <WordCardSkeleton />
            <WordCardSkeleton />
          </div>
        )}

        {!loading && searched && results.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-300 py-12 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm animate-fade-in">
            No results found for "{debouncedQuery}". Try a different word or toggle semantic search.
          </div>
        )}

        {!loading && results.map((word, index) => (
          <WordCard key={word.id || index} wordData={word} />
        ))}
      </div>
    </div>
  );
}
