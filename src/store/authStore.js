import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AUTH_USE_COOKIE_REFRESH, TOKEN_REFRESH_ENDPOINT } from '../config/api';

const STORAGE_KEY = 'lexicon-auth-storage';

const initialState = {
  accessToken: null,
  refreshToken: null,
  hasRefreshSession: false,
  isAuthenticated: false,
  role: null,
  isStaff: false,
  isSuperuser: false,
  claims: {},
  isAdmin: false,
  hasHydrated: false,
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
const deriveIsAuthenticated = ({ accessToken, hasRefreshSession }) =>
  Boolean(accessToken) || Boolean(hasRefreshSession);

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
    (set, get) => ({
      ...initialState,

      login: ({ access, refresh }) => {
        const normalizedRefreshToken = refresh ?? null;
        const hasRefreshSession = AUTH_USE_COOKIE_REFRESH || Boolean(normalizedRefreshToken);
        const authClaims = extractUserClaims({ accessToken: access ?? null });

        set({
          accessToken: access ?? null,
          refreshToken: normalizedRefreshToken,
          hasRefreshSession,
          isAuthenticated: deriveIsAuthenticated({ accessToken: access, hasRefreshSession }),
          ...authClaims,
        });
      },

      setAccessToken: (accessToken) =>
        set((state) => {
          const normalizedAccessToken = accessToken ?? null;
          const authClaims = extractUserClaims({ accessToken: normalizedAccessToken });

          return {
            accessToken: normalizedAccessToken,
            isAuthenticated: deriveIsAuthenticated({
              accessToken: normalizedAccessToken,
              hasRefreshSession: state.hasRefreshSession,
            }),
            ...authClaims,
          };
        }),

      setRefreshToken: (refreshToken) =>
        set((state) => {
          const normalizedRefreshToken = refreshToken ?? null;
          const hasRefreshSession = AUTH_USE_COOKIE_REFRESH || Boolean(normalizedRefreshToken);

          return {
            refreshToken: normalizedRefreshToken,
            hasRefreshSession,
            isAuthenticated: deriveIsAuthenticated({
              accessToken: state.accessToken,
              hasRefreshSession,
            }),
          };
        }),

      bootstrapSession: async () => {
        const state = get();
        const hasRefreshSession = AUTH_USE_COOKIE_REFRESH || Boolean(state.refreshToken);

        if (!hasRefreshSession) {
          return false;
        }

        if (state.accessToken) {
          return true;
        }

        if (!AUTH_USE_COOKIE_REFRESH && !state.refreshToken) {
          return false;
        }

        try {
          const response = await fetch(TOKEN_REFRESH_ENDPOINT, {
            method: 'POST',
            credentials: AUTH_USE_COOKIE_REFRESH ? 'include' : 'same-origin',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            body: JSON.stringify(AUTH_USE_COOKIE_REFRESH ? {} : { refresh: state.refreshToken }),
          });

          if (!response.ok) {
            throw new Error(`Token refresh failed with status ${response.status}`);
          }

          const data = await response.json();
          const newAccessToken = data?.access ?? null;

          if (!newAccessToken) {
            throw new Error('Token refresh did not return an access token.');
          }

          state.setAccessToken(newAccessToken);

          if (!AUTH_USE_COOKIE_REFRESH) {
            state.setRefreshToken(data?.refresh ?? state.refreshToken ?? null);
          }

          return true;
        } catch {
          state.forceLogout();
          return false;
        }
      },

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
      onRehydrateStorage: () => (state, error) => {
        if (!state) {
          return;
        }

        if (error) {
          state.forceLogout();
          useAuthStore.setState({ hasHydrated: true });
          return;
        }

        const hasRefreshSession = AUTH_USE_COOKIE_REFRESH || Boolean(state.refreshToken);
        const isAuthenticated = deriveIsAuthenticated({
          accessToken: state.accessToken,
          hasRefreshSession,
        });

        useAuthStore.setState({
          hasRefreshSession,
          isAuthenticated,
          hasHydrated: true,
        });

        if (isAuthenticated && !state.accessToken) {
          void state.bootstrapSession();
        }
      },
    }
  )
);
