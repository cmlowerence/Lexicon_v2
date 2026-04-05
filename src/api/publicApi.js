import { apiClient } from './client';
import { transformDailyPractice, transformWOTD, transformWord, transformWordList } from './transformers/wordTransformer';

export const publicApi = {
  searchWord: async (word, semantic = false, lang = 'en', requestOptions = {}) => {
    const response = await apiClient.get('/public/search/', {
      params: {
        word,
        lang,
        semantic: semantic ? 'true' : 'false',
      },
      ...requestOptions,
    });

    const payload = response.data;

    if (Array.isArray(payload)) return transformWordList(payload);
    if (payload?.results) return { ...payload, results: transformWordList(payload.results) };

    return transformWord(payload);
  },

  getWOTD: async () => {
    const response = await apiClient.get('/public/word-of-the-day/');
    return transformWOTD(response.data);
  },

  getDailyPractice: async () => {
    const response = await apiClient.get('/public/daily-practice/');
    return transformDailyPractice(response.data);
  },

  getTrending: async () => {
    const response = await apiClient.get('/public/trending/');
    return transformWordList(response.data || []);
  },
};
