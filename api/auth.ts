import axios from 'axios';
import { API_ENDPOINTS, BASE_URL } from './config';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests automatically
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: async (data: {
    full_name: string;
    email: string;
    phone?: string;
    city?: string;
    password: string;
  }) => {
    const response = await api.post(API_ENDPOINTS.REGISTER, data);
    return response.data;
  },

  login: async (data: { email: string; password: string }) => {
    const response = await api.post(API_ENDPOINTS.LOGIN, data);
    return response.data;
  },
};

export default api;