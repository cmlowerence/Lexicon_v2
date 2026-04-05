import { apiClient } from './client';
import { transformWord, transformWordList } from './transformers/wordTransformer';

export const adminApi = {
  getWordsList: async (filters = {}) => {
    const response = await apiClient.get('/manager/words/list/', { params: filters });
    return transformWordList(response.data || []);
  },

  createWord: async (data) => {
    const response = await apiClient.post('/manager/words/', data);
    return transformWord(response.data);
  },

  getWordDetail: async (id) => {
    const response = await apiClient.get(`/manager/words/${id}/`);
    return transformWord(response.data);
  },

  updateWord: async (id, data) => {
    const response = await apiClient.patch(`/manager/words/${id}/`, data);
    return transformWord(response.data);
  },

  deleteWord: async (id) => {
    await apiClient.delete(`/manager/words/${id}/`);
    return true;
  },

  addEntity: async (wordId, entityType, data) => {
    const response = await apiClient.post(`/manager/words/${wordId}/add-${entityType}/`, data);
    return transformWord(response.data);
  },

  removeEntity: async (wordId, entityType, entityId) => {
    const response = await apiClient.delete(`/manager/words/${wordId}/remove-${entityType}/${entityId}/`);
    return transformWord(response.data);
  },

  getCategories: async () => {
    const response = await apiClient.get('/manager/categories/');
    return response.data;
  },

  createCategory: async (data) => {
    const response = await apiClient.post('/manager/categories/', data);
    return response.data;
  },

  updateCategory: async (id, data) => {
    const response = await apiClient.patch(`/manager/categories/${id}/`, data);
    return response.data;
  },

  deleteCategory: async (id) => {
    const response = await apiClient.delete(`/manager/categories/${id}/`);
    return response.data;
  },

  assignCategory: async (wordId, categoryId) => {
    const response = await apiClient.post(`/manager/words/${wordId}/categories/${categoryId}/`);
    return transformWord(response.data);
  },

  removeCategory: async (wordId, categoryId) => {
    const response = await apiClient.delete(`/manager/words/${wordId}/categories/${categoryId}/`);
    return transformWord(response.data);
  },

  overrideWOTD: async (data) => {
    const response = await apiClient.post('/manager/word-of-the-day/override/', data);
    return response.data;
  },

  overridePractice: async (data) => {
    const response = await apiClient.post('/manager/daily-practice/override/', data);
    return response.data;
  },
};
