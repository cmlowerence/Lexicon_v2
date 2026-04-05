import { Search } from 'lucide-react';

export default function SearchBar({ searchQuery, setSearchQuery, isSemantic, setIsSemantic, onSearch }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) onSearch();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto space-y-4">
      <div className="relative flex items-center">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for a word or concept..."
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all shadow-sm text-lg"
        />
        <Search className="absolute left-4 text-gray-400" size={24} />
        <button 
          type="submit" 
          className="absolute right-2 px-4 py-1.5 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
        >
          Search
        </button>
      </div>
      
      <div className="flex items-center justify-center gap-2">
        <label className="flex items-center cursor-pointer relative">
          <input 
            type="checkbox" 
            className="sr-only peer"
            checked={isSemantic}
            onChange={(e) => setIsSemantic(e.target.checked)}
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
          <span className="ml-3 text-sm font-medium text-gray-700">Semantic Search</span>
        </label>
      </div>
    </form>
  );
}