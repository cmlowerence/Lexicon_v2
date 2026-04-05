import { apiClient } from './client';

export const adminApi = {
  // ==========================================
  // WORD MANAGEMENT
  // ==========================================
  
  getWordsList: async () => {
    const response = await apiClient.get('/manager/words/list/');
    return response.data;
  },

  createWord: async (data) => {
    const response = await apiClient.post('/manager/words/', data);
    return response.data;
  },

  getWordDetail: async (id) => {
    const response = await apiClient.get(`/manager/words/${id}/`);
    return response.data;
  },

  updateWord: async (id, data) => {
    const response = await apiClient.patch(`/manager/words/${id}/`, data);
    return response.data;
  },

  deleteWord: async (id) => {
    const response = await apiClient.delete(`/manager/words/${id}/`);
    return response.data;
  },

  // ==========================================
  // ENTITY MANAGEMENT (Meanings, Pronunciations, etc.)
  // ==========================================

  addEntity: async (wordId, entityType, data) => {
    const response = await apiClient.post(`/manager/words/${wordId}/add-${entityType}/`, data);
    return response.data;
  },

  removeEntity: async (wordId, entityType, entityId) => {
    const response = await apiClient.delete(`/manager/words/${wordId}/remove-${entityType}/${entityId}/`);
    return response.data;
  },

  // ==========================================
  // CATEGORY MANAGEMENT
  // ==========================================

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
    return response.data;
  },

  // ==========================================
  // OVERRIDES (WOTD & Practice)
  // ==========================================

  overrideWOTD: async (data) => {
    const response = await apiClient.post('/manager/word-of-the-day/override/', data);
    return response.data;
  },

  overridePractice: async (data) => {
    const response = await apiClient.post('/manager/daily-practice/override/', data);
    return response.data;
  }
};