const RAW_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const API_ROOT = RAW_BASE_URL.replace(/\/$/, '');
export const LEXICON_BASE = `${API_ROOT}/api/v2/lexicon`;
export const TOKEN_ENDPOINT = `${API_ROOT}/api/token/`;
export const TOKEN_REFRESH_ENDPOINT = `${API_ROOT}/api/token/refresh/`;
