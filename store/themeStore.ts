import { create } from 'zustand';
import { Colors } from '../constants/Colors';

type ThemeMode = 'dark' | 'light';

interface ThemeState {
  mode: ThemeMode;
  colors: typeof Colors.light;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  // ✅ HARDCODED TO LIGHT MODE
  mode: 'light',
  colors: Colors.light,
  
  toggleTheme: () => set((state) => {
    const newMode = state.mode === 'dark' ? 'light' : 'dark';
    return { mode: newMode, colors: Colors[newMode] };
  }),
  
  setTheme: (mode) => set({ mode, colors: Colors[mode] }),
}));