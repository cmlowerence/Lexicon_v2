import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';

const BASE_URL = 'https://qubitgyan-api.onrender.com/api/v2/lexicon';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const { showToast } = useUIStore.getState();

    if (status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
      showToast('Session expired. Please log in again.');
    } else if (status >= 500) {
      showToast('Server error. Please try again later.');
    } else if (!error.response) {
      showToast('Network error. Please check your connection.');
    }

    return Promise.reject(error);
  }
);