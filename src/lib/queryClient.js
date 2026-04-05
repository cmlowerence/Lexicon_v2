const queryStore = new Map();

const NON_RETRYABLE_STATUSES = new Set([401, 403, 404]);

export const isTransientError = (error) => {
  const status = error?.response?.status;

  if (status && NON_RETRYABLE_STATUSES.has(status)) return false;
  if (!status) return true;

  return status >= 500 || status === 408 || status === 429;
};

export const serializeQueryKey = (queryKey) => JSON.stringify(queryKey);

export const getCachedQuery = (queryKey) => queryStore.get(serializeQueryKey(queryKey));

export const setCachedQuery = (queryKey, value) => {
  queryStore.set(serializeQueryKey(queryKey), value);
};

export const invalidateQuery = (queryKey) => {
  const key = serializeQueryKey(queryKey);
  const entry = queryStore.get(key);
  if (!entry) return;

  queryStore.set(key, {
    ...entry,
    updatedAt: 0,
  });
};
