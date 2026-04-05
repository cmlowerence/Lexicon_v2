export function WordCardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-6 w-full animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <div className="space-y-3 flex-1">
          <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/4"></div>
        </div>
        <div className="h-10 w-10 bg-gray-200 dark:bg-slate-700 rounded-full"></div>
      </div>
      <div className="h-px w-full bg-gray-100 dark:bg-slate-700 my-4"></div>
      <div className="space-y-4 mt-4">
        <div className="h-5 bg-brand-100 dark:bg-brand-900/30 rounded w-16 mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-full"></div>
        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-5/6"></div>
      </div>
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4">
      <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
      <p className="text-gray-500 dark:text-gray-400 font-medium animate-pulse">Loading lexicon...</p>
    </div>
  );
}