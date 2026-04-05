import { useState } from 'react';
import SearchBar from '../components/SearchBar';
import WordCard from '../components/WordCard';
import { publicApi } from '../api/publicApi';

export default function Search() {
  const [query, setQuery] = useState('');
  const [isSemantic, setIsSemantic] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    setSearched(true);
    try {
      // The backend expects searchWord(word, semantic) based on our Stage 2 mapping
      const data = await publicApi.searchWord(query, isSemantic);
      // Ensure results are always an array
      setResults(Array.isArray(data) ? data : (data.results || [data]));
    } catch (error) {
      console.error("Search failed");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Discover Words</h1>
        <p className="text-gray-500">Use standard or semantic search to find definitions, concepts, and ideas.</p>
      </div>

      <SearchBar 
        searchQuery={query}
        setSearchQuery={setQuery}
        isSemantic={isSemantic}
        setIsSemantic={setIsSemantic}
        onSearch={handleSearch}
      />

      <div className="mt-12 space-y-6">
        {loading && <div className="text-center text-gray-500 animate-pulse">Searching the lexicon...</div>}
        
        {!loading && searched && results.length === 0 && (
          <div className="text-center text-gray-500 py-12 bg-white rounded-xl border border-gray-100 shadow-sm">
            No results found for "{query}". Try a different word or toggle semantic search.
          </div>
        )}

        {!loading && results.map((word, index) => (
          <WordCard key={word.id || index} wordData={word} />
        ))}
      </div>
    </div>
  );
}