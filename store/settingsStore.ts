import { create } from 'zustand';

export type Language = 'en' | 'ur' | 'ar' | 'es' | 'fr' | 'zh' | 'hi' | 'tr';
export type LocationInterval = 15 | 30 | 60 | 300 | 600 | 1800;
export type NotificationPriority = 'critical' | 'high' | 'medium' | 'low' | 'off';

export interface NotificationPref {
  enabled: boolean;
  sound: boolean;
  vibration: boolean;
  priority: NotificationPriority;
}

interface SettingsState {
  language: Language;
  locationInterval: LocationInterval;
  notifications: {
    emergency: NotificationPref;
    warning: NotificationPref;
    safeZone: NotificationPref;
    health: NotificationPref;
    battery: NotificationPref;
    system: NotificationPref;
  };
  setLanguage: (lang: Language) => void;
  setLocationInterval: (interval: LocationInterval) => void;
  updateNotification: (key: keyof SettingsState['notifications'], pref: Partial<NotificationPref>) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  language: 'en',
  locationInterval: 30,
  notifications: {
    emergency: { enabled: true, sound: true, vibration: true, priority: 'critical' },
    warning: { enabled: true, sound: true, vibration: true, priority: 'high' },
    safeZone: { enabled: true, sound: true, vibration: false, priority: 'medium' },
    health: { enabled: true, sound: false, vibration: false, priority: 'medium' },
    battery: { enabled: true, sound: false, vibration: true, priority: 'low' },
    system: { enabled: true, sound: false, vibration: false, priority: 'low' },
  },
  setLanguage: (language) => set({ language }),
  setLocationInterval: (locationInterval) => set({ locationInterval }),
  updateNotification: (key, pref) =>
    set((state) => ({
      notifications: {
        ...state.notifications,
        [key]: { ...state.notifications[key], ...pref },
      },
    })),
}));