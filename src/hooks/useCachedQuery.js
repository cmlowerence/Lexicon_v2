import { useCallback, useEffect, useMemo, useState } from 'react';
import { getCachedQuery, isTransientError, setCachedQuery } from '../lib/queryClient';

const DEFAULT_RETRY_COUNT = 2;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function useCachedQuery({
  queryKey,
  queryFn,
  staleTime = 0,
  enabled = true,
  retryCount = DEFAULT_RETRY_COUNT,
  shouldRetry = isTransientError,
}) {
  const [data, setData] = useState(() => getCachedQuery(queryKey)?.data);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(enabled && !getCachedQuery(queryKey));
  const [isFetching, setIsFetching] = useState(false);

  const key = useMemo(() => JSON.stringify(queryKey), [queryKey]);

  const fetchQuery = useCallback(async ({ force = false } = {}) => {
    if (!enabled) return;

    const cached = getCachedQuery(queryKey);
    const isFresh = cached && Date.now() - cached.updatedAt < staleTime;

    if (!force && isFresh) {
      setData(cached.data);
      setError(null);
      setIsLoading(false);
      return;
    }

    setIsFetching(true);
    setIsLoading(!cached);

    let failureCount = 0;
    while (failureCount <= retryCount) {
      try {
        const nextData = await queryFn();
        setCachedQuery(queryKey, { data: nextData, updatedAt: Date.now() });
        setData(nextData);
        setError(null);
        setIsLoading(false);
        setIsFetching(false);
        return;
      } catch (nextError) {
        const canRetry = failureCount < retryCount && shouldRetry(nextError);
        if (!canRetry) {
          setError(nextError);
          setIsLoading(false);
          setIsFetching(false);
          return;
        }

        failureCount += 1;
        await wait(300 * failureCount);
      }
    }
  }, [enabled, queryFn, queryKey, retryCount, shouldRetry, staleTime]);

  useEffect(() => {
    fetchQuery();
  }, [fetchQuery, key]);

  useEffect(() => {
    if (!enabled) return undefined;

    const onFocus = () => {
      fetchQuery();
    };

    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [enabled, fetchQuery]);

  return {
    data,
    error,
    isLoading,
    isFetching,
    isError: Boolean(error),
    refetch: () => fetchQuery({ force: true }),
  };
}
