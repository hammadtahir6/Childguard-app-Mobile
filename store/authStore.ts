import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../api/auth';

interface AuthState {
  isLoggedIn: boolean;
  user: { id: string; full_name: string; email: string } | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    fullName: string,
    email: string,
    password: string,
    phone?: string,
    city?: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isLoggedIn: false,
  user: null,
  token: null,

  loadUser: async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const userData = await AsyncStorage.getItem('user');
      
      if (token && userData) {
        set({
          isLoggedIn: true,
          token,
          user: JSON.parse(userData),
        });
      }
    } catch (error) {
      console.error('Error loading user:', error);
    }
  },

  login: async (email: string, password: string) => {
    try {
      const response = await authAPI.login({ email, password });
      
      await AsyncStorage.setItem('token', response.access_token);
      await AsyncStorage.setItem('user', JSON.stringify(response.user));
      
      set({
        isLoggedIn: true,
        token: response.access_token,
        user: response.user,
      });
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    }
  },

  register: async (
    fullName: string,
    email: string,
    password: string,
    phone?: string,
    city?: string
  ) => {
    try {
      const response = await authAPI.register({
        full_name: fullName,
        email,
        password,
        phone,
        city,
      });
      
      await AsyncStorage.setItem('token', response.access_token);
      await AsyncStorage.setItem('user', JSON.stringify(response.user));
      
      set({
        isLoggedIn: true,
        token: response.access_token,
        user: response.user,
      });
    } catch (error: any) {
      console.error('Register error:', error);
      throw error;
    }
  },

  logout: async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    set({
      isLoggedIn: false,
      user: null,
      token: null,
    });
  },
}));