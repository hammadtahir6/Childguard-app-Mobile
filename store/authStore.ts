import { create } from 'zustand';

interface AuthState {
  isLoggedIn: boolean;
  user: { name: string; email: string } | null;
  login: (email: string) => void;
  register: (name: string, email: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  user: null,
  
  login: (email) => set({ 
    isLoggedIn: true, 
    user: { name: 'Ahmed Khan', email } 
  }),
  
  register: (name, email) => set({ 
    isLoggedIn: true, 
    user: { name, email } 
  }),
  
  logout: () => set({ 
    isLoggedIn: false, 
    user: null 
  }),
}));