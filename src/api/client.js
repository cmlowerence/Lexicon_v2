import axios from 'axios';

const BASE_URL = 'https://qubitgyan-api/api/v2/lexicon';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // 10 second timeout to prevent hanging requests
  timeout: 10000, 
});

// Interceptor stub: Auth tokens will be injected here in Stage 3
apiClient.interceptors.request.use(
  (config) => {
    // TODO: Retrieve token from Zustand store in Stage 3
    // const token = useAuthStore.getState().token;
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor stub: Global error handling (Stage 7)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // TODO: Handle 401s, 403s, and network errors globally
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);