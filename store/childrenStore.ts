import { create } from 'zustand';

// Types for our data
export interface Vitals {
  heartRate?: number;
  spo2?: number;
  temperature?: number;
}

export interface Location {
  lat?: number;
  lng?: number;
  address?: string;
  inSafeZone?: boolean;
}

export interface Band {
  id?: string;
  battery?: number;
  is_connected?: boolean;
  band_code?: string;
}

export interface Child {
  id: string;
  name: string;
  age: number;
  gender: string;
  grade?: string;
  school_name?: string;
  status: 'SAFE' | 'WARNING' | 'EMERGENCY';
  profile_photo_url?: string;
  
  // Nested objects (optional for backend compatibility)
  vitals?: Vitals;
  location?: Location;
  band?: Band;
  safeZones?: any[];
}

// ✅ Helper: Normalize flat backend response into nested Child structure
const normalizeChild = (data: any): Child => ({
  id: data.id,
  name: data.name,
  age: data.age,
  gender: data.gender,
  grade: data.grade,
  school_name: data.school_name,
  status: data.status,
  profile_photo_url: data.profile_photo_url,
  
  // ✅ Create nested objects from flat fields or use defaults
  vitals: data.vitals || {
    heartRate: data.heart_rate,
    spo2: data.spo2,
    temperature: data.temperature,
  },
  location: data.location || {
    lat: data.latitude,
    lng: data.longitude,
    address: data.address,
    inSafeZone: data.in_safe_zone,
  },
  band: data.band || {
    id: data.band_id,
    battery: data.battery_level,
    is_connected: data.is_connected,
    band_code: data.band_code,
  },
  safeZones: data.safe_zones || [],
});

interface ChildrenState {
  children: Child[];
  activeChildId: string | null;
  setChildren: (children: Child[]) => void;
  setActiveChild: (id: string) => void;
  updateVitals: (childId: string, vitals: Partial<Vitals>) => void;
  addChild: (child: Child) => void;
  deleteChild: (id: string) => void;
}

const initialChildren: Child[] = [];

export const useChildrenStore = create<ChildrenState>((set) => ({
  children: initialChildren,
  activeChildId: null,
  
  // ✅ Normalize backend data when setting children
  setChildren: (children) => set({ 
    children: children.map(normalizeChild) 
  }),
  
  setActiveChild: (id) => set({ activeChildId: id }),
  
  updateVitals: (childId, newVitals) => set((state) => ({
    children: state.children.map((child) =>
      child.id === childId
        ? { 
            ...child, 
            vitals: { 
              ...child.vitals, 
              ...newVitals 
            } 
          }
        : child
    ),
  })),
  
  addChild: (child) => set((state) => ({
    children: [...state.children, normalizeChild(child)],
    activeChildId: child.id,
  })),
  
// Add this new function to the store:
updateChildSafeZones: (childId: string, safeZones: any[]) => set((state) => ({
  children: state.children.map((child) =>
    child.id === childId
      ? { ...child, safeZones }
      : child
  ),
})),

  deleteChild: (id) => set((state) => ({
    children: state.children.filter((child) => child.id !== id),
    activeChildId: state.activeChildId === id ? null : state.activeChildId,
  })),
}));

