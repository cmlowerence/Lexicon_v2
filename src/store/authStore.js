import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      login: ({ access, refresh }) => set({
        accessToken: access,
        refreshToken: refresh,
        isAuthenticated: Boolean(access),
      }),

      setAccessToken: (accessToken) => set((state) => ({
        accessToken,
        isAuthenticated: Boolean(accessToken || state.refreshToken),
      })),

      logout: () => set({ accessToken: null, refreshToken: null, isAuthenticated: false }),
    }),
    {
      name: 'lexicon-auth-storage',
    }
  )
);
