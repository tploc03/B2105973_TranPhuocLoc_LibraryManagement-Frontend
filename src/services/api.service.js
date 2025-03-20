// src/services/api.service.js
import axios from 'axios';

const commonConfig = {
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
};

export default (baseURL) => {
  const apiClient = axios.create({
    baseURL,
    ...commonConfig,
  });

  apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }, (error) => Promise.reject(error));

  apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401 || error.response?.status === 403) {
        const authStore = require('../stores/auth').useAuthStore();
        authStore().logout();
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );

  return apiClient;
};