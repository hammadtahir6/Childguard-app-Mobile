import { create } from 'zustand';

interface ToastState {
  visible: boolean;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  showToast: (message: string, type: 'success' | 'error' | 'warning' | 'info') => void;
  hideToast: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  visible: false,
  message: '',
  type: 'info',
  showToast: (message, type) => {
    set({ visible: true, message, type });
    setTimeout(() => set({ visible: false, message: '', type: 'info' }), 3000);
  },
  hideToast: () => set({ visible: false, message: '', type: 'info' }),
}));