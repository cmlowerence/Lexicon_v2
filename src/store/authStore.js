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

const ADMIN_ROLES = new Set(['admin', 'administrator', 'superadmin', 'staff']);

const parseJwtPayload = (token) => {
  if (!token) return null;

  try {
    const payloadBase64 = token.split('.')[1];
    if (!payloadBase64) return null;

    const normalized = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
};

const normalizeRole = (value) => (typeof value === 'string' ? value.trim().toLowerCase() : null);

const extractUserClaims = ({ accessToken, profile, claims }) => {
  const jwtClaims = parseJwtPayload(accessToken);
  const mergedClaims = {
    ...(jwtClaims || {}),
    ...(profile || {}),
    ...(claims || {}),
  };

  const role = normalizeRole(
    mergedClaims.role
    || mergedClaims.user_role
    || mergedClaims.group
    || mergedClaims.user_type
  );

  const isStaff = Boolean(mergedClaims.is_staff);
  const isSuperuser = Boolean(mergedClaims.is_superuser);
  const isAdminRole = role ? ADMIN_ROLES.has(role) : false;

  return {
    role,
    isStaff,
    isSuperuser,
    claims: mergedClaims,
    isAdmin: isStaff || isSuperuser || isAdminRole,
  };
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
