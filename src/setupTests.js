import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Zustand persist to prevent local storage errors in test environment
vi.mock('zustand/middleware', () => ({
  persist: (config) => config,
}));

// Mock browser APIs if needed
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), 
    removeListener: vi.fn(), 
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});