import { create } from 'zustand';

// Types for our data
export interface Vitals {
  heartRate?: number;
  spo2?: number;
  temperature?: number;
}

// ✅ FIXED: Added address field to Location interface
export interface Location {
  lat?: number;
  lng?: number;
  address?: string;  // ✅ ADD THIS
  inSafeZone?: boolean;
}

export interface Band {
  id?: string;
  battery?: number;
  is_connected?: boolean;
}

// ✅ All nested fields are optional for backend compatibility
export interface Child {
  id: string;
  name: string;
  age: number;
  gender: string;
  grade?: string;
  school_name?: string;
  status: 'SAFE' | 'WARNING' | 'EMERGENCY';
  profile_photo_url?: string;
  
  // Optional nested objects
  vitals?: Vitals;
  location?: Location;
  band?: Band;
  safeZones?: any[];
}

interface ChildrenState {
  children: Child[];
  activeChildId: string | null;
  setChildren: (children: Child[]) => void;
  setActiveChild: (id: string) => void;
  updateVitals: (childId: string, vitals: Partial<Vitals>) => void;
  addChild: (child: Child) => void;
  deleteChild: (id: string) => void;
}

// Mock initial data (will be replaced by real backend data)
const initialChildren: Child[] = [];

export const useChildrenStore = create<ChildrenState>((set) => ({
  children: initialChildren,
  activeChildId: null,
  
  // ✅ Set children from backend API
  setChildren: (children) => set({ children }),
  
  setActiveChild: (id) => set({ activeChildId: id }),
  
  // ✅ Update vitals with proper type safety
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
    children: [...state.children, child],
    activeChildId: child.id,
  })),
  
  deleteChild: (id) => set((state) => ({
    children: state.children.filter((child) => child.id !== id),
    activeChildId: state.activeChildId === id ? null : state.activeChildId,
  })),
}));