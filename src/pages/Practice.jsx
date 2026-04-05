import { useMemo, useState } from 'react';
import WordCard from '../components/WordCard';
import QueryBoundary from '../components/QueryBoundary';
import { WordCardSkeleton } from '../components/Skeletons';
import { ArrowRight, Trophy } from 'lucide-react';
import { usePracticeQuery } from '../hooks/useLexiconQueries';

export default function Practice() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const {
    data,
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
  } = usePracticeQuery();

  const practiceWords = useMemo(() => (Array.isArray(data) ? data : data?.words || []), [data]);

  const handleNext = () => {
    if (currentIndex < practiceWords.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  return (
    <QueryBoundary
      isLoading={isLoading}
      isError={isError}
      error={error}
      onRetry={refetch}
      loadingFallback={<WordCardSkeleton />}
    >
      {practiceWords.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100 mt-8">
          <Trophy className="mx-auto text-brand-400 mb-4" size={48} />
          <h2 className="text-2xl font-bold text-gray-800">No practice available right now.</h2>
          <p className="text-gray-500 mt-2">Check back later for your daily words!</p>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto py-8">
          {isFetching && <p className="mb-3 text-xs text-gray-500">Updating practice set in the background…</p>}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Daily Practice</h1>
            <span className="bg-brand-100 text-brand-700 font-medium px-3 py-1 rounded-full text-sm">
              {currentIndex + 1} / {practiceWords.length}
            </span>
          </div>

          <div className="relative">
            <WordCard wordData={practiceWords[currentIndex]} />
          </div>

          <div className="mt-8 flex justify-end">
            {currentIndex < practiceWords.length - 1 ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 bg-brand-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-brand-700 transition-colors shadow-sm"
              >
                Next Word <ArrowRight size={20} />
              </button>
            ) : (
              <div className="w-full bg-green-50 text-green-700 border border-green-200 p-4 rounded-xl text-center font-medium flex flex-col items-center justify-center gap-2">
                <Trophy size={24} className="text-green-500" />
                Practice Complete for Today!
              </div>
            )}
          </div>
        </div>
      )}
    </QueryBoundary>
  );
}
