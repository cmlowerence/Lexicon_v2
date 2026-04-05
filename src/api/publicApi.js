import { apiClient } from './client';

export const publicApi = {
  /**
   * Search for a word (Normal or Semantic)
   * @param {string} word - The search query
   * @param {boolean} semantic - Toggle semantic search
   */
  searchWord: async (word, semantic = false) => {
    const response = await apiClient.get('/public/search/', {
      params: { word, semantic }
    });
    return response.data;
  },

  /**
   * Get the current Word of the Day
   */
  getWOTD: async () => {
    const response = await apiClient.get('/public/word-of-the-day/');
    return response.data;
  },

  /**
   * Get the daily practice set
   */
  getDailyPractice: async () => {
    const response = await apiClient.get('/public/daily-practice/');
    return response.data;
  },

  /**
   * Get trending words
   */
  getTrending: async () => {
    const response = await apiClient.get('/public/trending/');
    return response.data;
  }
};