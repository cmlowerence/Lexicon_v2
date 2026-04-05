export default function QueryBoundary({
  isLoading,
  isError,
  error,
  onRetry,
  loadingFallback,
  children,
}) {
  if (isLoading) {
    return loadingFallback;
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        <p className="font-medium">We could not load this data.</p>
        <p className="mt-1 text-red-600">{error?.message || 'Please try again.'}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-3 rounded-md bg-red-600 px-3 py-1.5 text-white hover:bg-red-700"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  return children;
}
