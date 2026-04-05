import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AUTH_USE_COOKIE_REFRESH } from '../config/api';

const STORAGE_KEY = 'lexicon-auth-storage';

const initialState = {
  accessToken: null,
  refreshToken: null,
  hasRefreshSession: false,
  isAuthenticated: false,
};

export const useAuthStore = create(
  persist(
    (set) => ({
      ...initialState,

      login: ({ access, refresh }) => {
        const normalizedRefreshToken = refresh ?? null;
        const hasRefreshSession = AUTH_USE_COOKIE_REFRESH || Boolean(normalizedRefreshToken);

        set({
          accessToken: access ?? null,
          refreshToken: normalizedRefreshToken,
          hasRefreshSession,
          isAuthenticated: Boolean(access) || hasRefreshSession,
        });
      },

      setAccessToken: (accessToken) =>
        set((state) => ({
          accessToken: accessToken ?? null,
          isAuthenticated: Boolean(accessToken) || state.hasRefreshSession,
        })),

      setRefreshToken: (refreshToken) =>
        set((state) => {
          const normalizedRefreshToken = refreshToken ?? null;
          const hasRefreshSession = AUTH_USE_COOKIE_REFRESH || Boolean(normalizedRefreshToken);

          return {
            refreshToken: normalizedRefreshToken,
            hasRefreshSession,
            isAuthenticated: Boolean(state.accessToken) || hasRefreshSession,
          };
        }),

      forceLogout: () => {
        set({ ...initialState });
        useAuthStore.persist.clearStorage();
      },

      logout: () => {
        set({ ...initialState });
        useAuthStore.persist.clearStorage();
      },
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({
        refreshToken: AUTH_USE_COOKIE_REFRESH ? null : state.refreshToken,
        hasRefreshSession: state.hasRefreshSession,
      }),
    }
  )
);
