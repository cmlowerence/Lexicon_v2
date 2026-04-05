import { describe, it, expect, vi } from 'vitest';
import { adminApi } from '../adminApi';
import { apiClient } from '../client';

// Mock the Axios client instance
vi.mock('../client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  }
}));

describe('Admin API Mapping', () => {
  it('fetches words list via GET /manager/words/list/', async () => {
    apiClient.get.mockResolvedValueOnce({ data: [] });
    await adminApi.getWordsList();
    expect(apiClient.get).toHaveBeenCalledWith('/manager/words/list/');
  });

  it('creates word via POST /manager/words/', async () => {
    const newWord = { word: 'test' };
    apiClient.post.mockResolvedValueOnce({ data: newWord });
    await adminApi.createWord(newWord);
    expect(apiClient.post).toHaveBeenCalledWith('/manager/words/', newWord);
  });

  it('adds an entity via POST to dynamic route', async () => {
    const payload = { part_of_speech: 'noun' };
    apiClient.post.mockResolvedValueOnce({ data: { success: true } });
    await adminApi.addEntity('123', 'meaning', payload);
    expect(apiClient.post).toHaveBeenCalledWith('/manager/words/123/add-meaning/', payload);
  });

  it('assigns a category via POST', async () => {
    apiClient.post.mockResolvedValueOnce({ data: { success: true } });
    await adminApi.assignCategory('word1', 'cat1');
    expect(apiClient.post).toHaveBeenCalledWith('/manager/words/word1/categories/cat1/');
  });
});