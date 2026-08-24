import { create } from 'zustand';

export interface Alert {
  id: string;
  type: string;
  title: string;
  description: string;
  severity: 'EMERGENCY' | 'WARNING' | 'INFO';
  timestamp: string;
  location: { lat: number; lng: number; address: string };
  vitalsAtAlert: { heartRate: number; spo2: number; temperature: number };
  resolved: boolean;
  read: boolean;
}

interface AlertsState {
  alerts: Alert[];
  markAllRead: () => void;
  markAsRead: (id: string) => void;
  deleteAlert: (id: string) => void;
  deleteSelected: (ids: string[]) => void;
  resolveAlert: (id: string) => void; // This was missing!
}

const initialAlerts: Alert[] = [
  {
    id: '1', type: 'FALL_DETECTED', title: 'Fall Detected', description: 'Sara may have fallen near the playground.',
    severity: 'EMERGENCY', timestamp: new Date(Date.now() - 3600000).toISOString(),
    location: { lat: 34.0151, lng: 71.5249, address: 'Hayatabad Park, Peshawar' },
    vitalsAtAlert: { heartRate: 145, spo2: 96, temperature: 36.9 }, resolved: false, read: false
  },
  {
    id: '2', type: 'LEFT_SAFE_ZONE', title: 'Left Safe Zone', description: 'Ali left the Home zone unexpectedly.',
    severity: 'WARNING', timestamp: new Date(Date.now() - 86400000).toISOString(),
    location: { lat: 34.0250, lng: 71.5350, address: 'University Road, Peshawar' },
    vitalsAtAlert: { heartRate: 92, spo2: 98, temperature: 36.5 }, resolved: true, read: true
  },
  {
    id: '3', type: 'BATTERY_LOW', title: 'Band Battery Low', description: 'Sara\'s band is at 15% battery.',
    severity: 'INFO', timestamp: new Date(Date.now() - 172800000).toISOString(),
    location: { lat: 34.0151, lng: 71.5249, address: 'Home' },
    vitalsAtAlert: { heartRate: 80, spo2: 99, temperature: 36.6 }, resolved: true, read: true
  }
];

export const useAlertsStore = create<AlertsState>((set) => ({
  alerts: initialAlerts,
  markAllRead: () => set((state) => ({ alerts: state.alerts.map(a => ({ ...a, read: true })) })),
  markAsRead: (id) => set((state) => ({ alerts: state.alerts.map(a => a.id === id ? { ...a, read: true } : a) })),
  deleteAlert: (id) => set((state) => ({ alerts: state.alerts.filter(a => a.id !== id) })),
  deleteSelected: (ids) => set((state) => ({ alerts: state.alerts.filter(a => !ids.includes(a.id)) })),
  // The missing function is now added here:
  resolveAlert: (id) => set((state) => ({ alerts: state.alerts.map(a => a.id === id ? { ...a, resolved: true } : a) })),
}));