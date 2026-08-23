import { create } from 'zustand';

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  photo: string | null;
  role: string;
}

interface UserState {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  profile: {
    name: 'Ahmed Khan',
    email: 'ahmed@childguard.pk',
    phone: '+92 300 1234567',
    photo: null,
    role: 'Parent / Guardian',
  },
  updateProfile: (updates) =>
    set((state) => ({
      profile: { ...state.profile, ...updates },
    })),
  logout: () => set({ profile: { name: '', email: '', phone: '', photo: null, role: '' } }),
}));