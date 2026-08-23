import { create } from 'zustand';
import { Colors } from '../constants/Colors';

type ThemeMode = 'dark' | 'light';

interface ThemeState {
  mode: ThemeMode;
  colors: typeof Colors.dark;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  mode: 'dark',
  colors: Colors.dark,
  toggleTheme: () => set((state) => {
    const newMode = state.mode === 'dark' ? 'light' : 'dark';
    return { mode: newMode, colors: Colors[newMode] };
  }),
}));