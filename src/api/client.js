import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';
import { API_ROOT, LEXICON_BASE, TOKEN_REFRESH_ENDPOINT } from '../config/api';

export const authClient = axios.create({
  baseURL: API_ROOT,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 10000,
});

export const apiClient = axios.create({
  baseURL: LEXICON_BASE,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 10000,
});

apiClient.interceptors.request.use(
  (config) => {
    const accessToken = useAuthStore.getState().accessToken;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue = [];
const isDev = import.meta.env.DEV;

const getRequestMetadata = (error) => {
  const method = error.config?.method?.toUpperCase() || 'UNKNOWN';
  const endpoint = error.config?.url || 'unknown endpoint';
  return { method, endpoint };
};

const classifyError = (error) => {
  const status = error.response?.status;

  if (error.code === 'ECONNABORTED' || error.message?.toLowerCase().includes('timeout')) {
    return { type: 'timeout', message: 'Request timed out. Please try again.' };
  }

  if (status === 401) {
    return { type: 'unauthorized', message: 'Session expired. Please log in again.' };
  }

  if (status === 403) {
    return { type: 'forbidden', message: 'Permission denied.' };
  }

  if (status === 404) {
    return { type: 'not_found', message: 'Requested resource was not found.' };
  }

  if (status >= 500) {
    return { type: 'server', message: 'Server unavailable. Please try again later.' };
  }

  if (!error.response) {
    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      return { type: 'offline', message: 'You appear to be offline. Please check your internet connection.' };
    }
    return { type: 'cors', message: 'Connection blocked by browser security (CORS/preflight). Please contact support.' };
  }

  return { type: 'unknown', message: 'Something went wrong. Please try again.' };
};

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const originalRequest = error.config;
    const { showToast } = useUIStore.getState();
    const { method, endpoint } = getRequestMetadata(error);

    if (status === 401 && !originalRequest._retry) {
      const { refreshToken, logout, setAccessToken } = useAuthStore.getState();

      if (!refreshToken) {
        logout();
        window.location.href = '/login';
        showToast('Session expired. Please log in again.');
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return apiClient(originalRequest);
          })
          .catch((queueErr) => Promise.reject(queueErr));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await authClient.post(TOKEN_REFRESH_ENDPOINT, { refresh: refreshToken });
        const newAccessToken = response.data.access;

        setAccessToken(newAccessToken);
        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        logout();
        window.location.href = '/login';
        showToast('Session expired. Please log in again.');
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    const classifiedError = classifyError(error);

    if (isDev) {
      console.debug(`[apiClient] ${method} ${endpoint} failed (${classifiedError.type})`, {
        status,
        code: error.code,
        message: error.message,
      });
    }

    showToast(classifiedError.message);

    return Promise.reject(error);
  }
);
