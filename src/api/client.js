import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';
import { API_ROOT, AUTH_USE_COOKIE_REFRESH, LEXICON_BASE, TOKEN_REFRESH_ENDPOINT } from '../config/api';

export const authClient = axios.create({
  baseURL: API_ROOT,
  withCredentials: AUTH_USE_COOKIE_REFRESH,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 10000,
});

export const apiClient = axios.create({
  baseURL: LEXICON_BASE,
  withCredentials: AUTH_USE_COOKIE_REFRESH,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 10000,
});

const redirectToLogin = () => {
  window.location.href = '/login';
};

const handleAuthFailure = ({ forceLogout, showToast }) => {
  forceLogout();
  redirectToLogin();
  showToast('Session expired. Please log in again.');
};

const isDev = import.meta.env.DEV;
const isProd = import.meta.env.PROD;
const SLOW_REQUEST_THRESHOLD_MS = 1500;

const generateRequestId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `req_${Date.now()}_${Math.random().toString(16).slice(2)}`;
};

const getNow = () => (typeof performance !== 'undefined' ? performance.now() : Date.now());

const reportErrorToMonitoring = ({ requestId, method, endpoint, errorType, status, durationMs, error }) => {
  if (!isProd) return;

  if (typeof window !== 'undefined' && typeof window.__MONITORING_CAPTURE__ === 'function') {
    window.__MONITORING_CAPTURE__('api_error', {
      requestId,
      method,
      endpoint,
      errorType,
      status,
      durationMs,
      code: error.code,
      message: error.message,
    });
  }
};

const applyRequestTracking = (config) => {
  const requestId = generateRequestId();
  const startTime = getNow();
  config.headers = config.headers || {};
  config.headers['X-Request-ID'] = requestId;
  config.metadata = { ...(config.metadata || {}), requestId, startTime };
  return config;
};

apiClient.interceptors.request.use(
  (config) => {
    applyRequestTracking(config);
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

const getRequestMetadata = (error) => {
  const method = error.config?.method?.toUpperCase() || 'UNKNOWN';
  const endpoint = error.config?.url || 'unknown endpoint';
  const requestId = error.config?.metadata?.requestId || 'unknown-request-id';
  const durationMs = Math.round(getNow() - (error.config?.metadata?.startTime || getNow()));
  return { method, endpoint, requestId, durationMs };
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

authClient.interceptors.request.use(
  (config) => applyRequestTracking(config),
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => {
    const method = response.config?.method?.toUpperCase() || 'UNKNOWN';
    const endpoint = response.config?.url || 'unknown endpoint';
    const requestId = response.config?.metadata?.requestId || 'unknown-request-id';
    const durationMs = Math.round(getNow() - (response.config?.metadata?.startTime || getNow()));

    if (isDev && durationMs >= SLOW_REQUEST_THRESHOLD_MS) {
      console.debug(`[apiClient] slow request ${method} ${endpoint} (${durationMs}ms)`, { requestId });
    }

    return response;
  },
  async (error) => {
    const status = error.response?.status;
    const originalRequest = error.config;
    const { showToast } = useUIStore.getState();
    const { method, endpoint, requestId, durationMs } = getRequestMetadata(error);

    if (status === 401 && !originalRequest._retry) {
      const { refreshToken, forceLogout, setAccessToken, setRefreshToken } = useAuthStore.getState();

      if (!AUTH_USE_COOKIE_REFRESH && !refreshToken) {
        handleAuthFailure({ forceLogout, showToast });
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
        const refreshPayload = AUTH_USE_COOKIE_REFRESH ? {} : { refresh: refreshToken };
        const response = await authClient.post(TOKEN_REFRESH_ENDPOINT, refreshPayload);

        const newAccessToken = response.data?.access;
        if (!newAccessToken) {
          throw new Error('Refresh response did not include a new access token.');
        }

        setAccessToken(newAccessToken);

        if (!AUTH_USE_COOKIE_REFRESH) {
          setRefreshToken(response.data?.refresh ?? null);
        }

        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        handleAuthFailure({ forceLogout, showToast });
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    const classifiedError = classifyError(error);

    if (isDev) {
      console.debug(`[apiClient] [${requestId}] ${method} ${endpoint} failed (${classifiedError.type})`, {
        status,
        durationMs,
        code: error.code,
        message: error.message,
      });
    }

    reportErrorToMonitoring({
      requestId,
      method,
      endpoint,
      errorType: classifiedError.type,
      status,
      durationMs,
      error,
    });

    error.requestId = requestId;
    showToast(`${classifiedError.message} (Request ID: ${requestId})`);

    return Promise.reject(error);
  }
);
