import { adminApi } from '../api/adminApi';
import { publicApi } from '../api/publicApi';
import useCachedQuery from './useCachedQuery';

export const queryKeys = {
  wotd: ['public', 'wotd'],
  trending: ['public', 'trending'],
  practice: ['public', 'practice'],
  search: (query, isSemantic, language) => ['public', 'search', query, isSemantic, language],
  adminWords: ['admin', 'words'],
  adminCategories: ['admin', 'categories'],
};

export const useWotdQuery = () => useCachedQuery({
  queryKey: queryKeys.wotd,
  queryFn: publicApi.getWOTD,
  staleTime: 1000 * 60 * 60,
});

export const useTrendingQuery = () => useCachedQuery({
  queryKey: queryKeys.trending,
  queryFn: publicApi.getTrending,
  staleTime: 1000 * 60 * 5,
});

export const usePracticeQuery = () => useCachedQuery({
  queryKey: queryKeys.practice,
  queryFn: publicApi.getDailyPractice,
  staleTime: 1000 * 60 * 30,
});

export const useSearchQuery = ({ query, isSemantic, language = 'en', enabled = true }) => useCachedQuery({
  queryKey: queryKeys.search(query, isSemantic, language),
  queryFn: () => publicApi.searchWord(query, isSemantic, language),
  enabled,
  staleTime: 1000 * 30,
});

export const useAdminWordsQuery = () => useCachedQuery({
  queryKey: queryKeys.adminWords,
  queryFn: () => adminApi.getWordsList(),
  staleTime: 1000 * 60 * 2,
});

export const useAdminCategoriesQuery = () => useCachedQuery({
  queryKey: queryKeys.adminCategories,
  queryFn: adminApi.getCategories,
  staleTime: 1000 * 60 * 5,
});
