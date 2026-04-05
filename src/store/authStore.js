import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      role: null,
      isStaff: false,
      isSuperuser: false,
      isAdmin: false,
      claims: null,

      login: ({ access, refresh, profile, claims }) => {
        const userClaims = extractUserClaims({ accessToken: access, profile, claims });

        set({
          accessToken: access,
          refreshToken: refresh,
          isAuthenticated: Boolean(access),
          ...userClaims,
        });
      },

      setAccessToken: (accessToken, profile, claims) => set((state) => {
        const userClaims = extractUserClaims({ accessToken, profile, claims: claims || state.claims });

        return {
          accessToken,
          isAuthenticated: Boolean(accessToken || state.refreshToken),
          ...userClaims,
        };
      }),

      logout: () => set({
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        role: null,
        isStaff: false,
        isSuperuser: false,
        isAdmin: false,
        claims: null,
      }),
    }),
    {
      name: 'lexicon-auth-storage',
    }
  )
);
