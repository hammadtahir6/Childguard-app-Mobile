import { create } from 'zustand';

export interface SafeZone {
  id: string;
  name: string;
  lat: number;
  lng: number;
  radius: number;
  color: string;
}

export interface Child {
  id: string;
  name: string;
  age?: number;
  gender?: string;
  photo?: string;
  status: 'SAFE' | 'WARNING' | 'DANGER';
  vitals: {
    heartRate: number;
    spo2: number;
    temperature: number;
  };
  location: {
    lat: number;
    lng: number;
    address: string;
    inSafeZone: boolean;
  };
  band: {
    battery: number;
    connected: boolean;
  };
  safeZones: SafeZone[];
  medicalInfo?: {
    bloodType?: string;
    allergies?: string;
    medications?: string;
  };
  schoolSchedule?: {
    name?: string;
    address?: string;
    startTime?: string;
    endTime?: string;
  };
}

interface ChildrenState {
  activeChildId: string;
  children: Child[];
  setActiveChild: (id: string) => void;
  updateVitals: (id: string, vitals: Partial<Child['vitals']>) => void;
  addChild: (child: Child) => void;
  deleteChild: (id: string) => void;
  updateChildSafeZones: (id: string, safeZones: SafeZone[]) => void;
}

// Initial dummy data - ALWAYS keep at least one child
const initialChildren: Child[] = [
  {
    id: '1',
    name: 'Sara Khan',
    age: 8,
    gender: 'Female',
    status: 'SAFE',
    vitals: { heartRate: 85, spo2: 98, temperature: 36.5 },
    location: { lat: 34.0151, lng: 71.5249, address: 'Peshawar, Pakistan', inSafeZone: true },
    band: { battery: 85, connected: true },
    safeZones: [
      { id: 'z1', name: 'Home', lat: 34.0151, lng: 71.5249, radius: 100, color: '#00D4AA' },
      { id: 'z2', name: 'School', lat: 34.0200, lng: 71.5300, radius: 150, color: '#3B82F6' }
    ],
    medicalInfo: { bloodType: 'A+', allergies: 'None' },
    schoolSchedule: { name: 'Beacon House', startTime: '08:00', endTime: '14:00' }
  }
];

export const useChildrenStore = create<ChildrenState>((set) => ({
  activeChildId: '1',
  children: initialChildren,

  setActiveChild: (id) => set({ activeChildId: id }),

  updateVitals: (id, newVitals) =>
    set((state) => ({
      children: state.children.map((child) =>
        child.id === id ? { ...child, vitals: { ...child.vitals, ...newVitals } } : child
      ),
    })),

  addChild: (child) =>
    set((state) => ({
      children: [...state.children, child],
      activeChildId: child.id,
    })),

  deleteChild: (id) =>
    set((state) => {
      const newChildren = state.children.filter((c) => c.id !== id);
      // NEVER allow empty children array
      if (newChildren.length === 0) {
        return {
          children: initialChildren, // Reset to default
          activeChildId: initialChildren[0].id,
        };
      }
      return {
        children: newChildren,
        activeChildId: state.activeChildId === id && newChildren.length > 0 ? newChildren[0].id : state.activeChildId,
      };
    }),

  updateChildSafeZones: (id, safeZones) =>
    set((state) => ({
      children: state.children.map((child) =>
        child.id === id ? { ...child, safeZones } : child
      ),
    })),
}));