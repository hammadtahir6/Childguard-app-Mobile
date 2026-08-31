import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { authAPI } from '../api/auth';

interface User {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  city?: string;
  profile_photo_url?: string;
}

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string, phone?: string, city?: string) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isLoggedIn: false,
  user: null,
  token: null,

  loadUser: async () => {
    try {
      const token = await SecureStore.getItemAsync('token');
      const userDataStr = await AsyncStorage.getItem('user_data');
      
      if (token && userDataStr) {
        set({ isLoggedIn: true, token, user: JSON.parse(userDataStr) });
      }
    } catch (error) {
      console.error('Load user error:', error);
    }
  },

  login: async (email: string, password: string) => {
    try {
      const response = await authAPI.login({ email, password });
      
      // ✅ Load saved photo path from AsyncStorage
      const savedPhoto = await AsyncStorage.getItem('user_profile_photo');
      
      const userData: User = {
        id: response.user.id,
        full_name: response.user.full_name,
        email: response.user.email,
        phone: response.user.phone,
        city: response.user.city,
        // ✅ Keep existing photo if backend doesn't return one
        profile_photo_url: response.user.profile_photo_url || savedPhoto || undefined,
      };
      
      await SecureStore.setItemAsync('token', response.access_token);
      await AsyncStorage.setItem('user_data', JSON.stringify(userData));
      
      set({ isLoggedIn: true, token: response.access_token, user: userData });
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    }
  },

  register: async (fullName: string, email: string, password: string, phone?: string, city?: string) => {
    try {
      const response = await authAPI.register({ full_name: fullName, email, password, phone, city });
      
      const savedPhoto = await AsyncStorage.getItem('user_profile_photo');
      const userData: User = {
        id: response.user.id,
        full_name: response.user.full_name,
        email: response.user.email,
        phone: response.user.phone,
        city: response.user.city,
        profile_photo_url: response.user.profile_photo_url || savedPhoto || undefined,
      };
      
      await SecureStore.setItemAsync('token', response.access_token);
      await AsyncStorage.setItem('user_data', JSON.stringify(userData));
      
      set({ isLoggedIn: true, token: response.access_token, user: userData });
    } catch (error: any) {
      console.error('Register error:', error);
      throw error;
    }
  },

  logout: async () => {
    await SecureStore.deleteItemAsync('token');
    await AsyncStorage.removeItem('user_data');
    // Keep photo file on disk so it persists across logins
    set({ isLoggedIn: false, user: null, token: null });
  },
}));