const DEFAULT_API_ORIGIN = 'https://qubitgyan-api.onrender.com';
const DEFAULT_LEXICON_BASE = '/api/v2/lexicon';

const normalizeOrigin = (origin) => (origin || DEFAULT_API_ORIGIN).replace(/\/+$/, '');

const normalizeBasePath = (basePath) => {
  const normalizedPath = (basePath || DEFAULT_LEXICON_BASE)
    .replace(/^\/+/, '')
    .replace(/\/+$/, '');

  return `/${normalizedPath}`;
};

const RAW_API_ORIGIN = import.meta.env.VITE_API_ORIGIN;
const RAW_LEXICON_BASE = import.meta.env.VITE_LEXICON_BASE;

export const API_ROOT = normalizeOrigin(RAW_API_ORIGIN);
export const LEXICON_BASE = `${API_ROOT}${normalizeBasePath(RAW_LEXICON_BASE)}`;
export const TOKEN_ENDPOINT = `${API_ROOT}/api/token/`;
export const TOKEN_REFRESH_ENDPOINT = `${API_ROOT}/api/token/refresh/`;
