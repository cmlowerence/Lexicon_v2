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

    if (status >= 500) {
      showToast('Server error. Please try again later.');
    } else if (!error.response) {
      showToast('Network error. Please check your connection.');
    }

    return Promise.reject(error);
  }
);
