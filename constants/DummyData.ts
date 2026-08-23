export const CURRENT_USER = {
  id: 'parent_001',
  name: 'Ahmed Khan',
  email: 'ahmed@childguard.pk',
  phone: '+92-300-1234567',
  city: 'Peshawar',
}

export const CHILDREN = [
  {
    id: 'child_001',
    name: 'Sara Ahmed',
    age: 8,
    gender: 'female',
    grade: 'Class 3',
    school: 'Beacon House School',
    schoolStart: '08:00',
    schoolEnd: '14:00',
    status: 'SAFE' as const,
    band: {
      code: 'CG-2847-XKQP',
      battery: 78,
      connected: true,
      signal: 4,
    },
    vitals: {
      heartRate: 92,
      heartRateTrend: 'stable' as const,
      spo2: 98,
      temperature: 36.8,
      lastUpdated: new Date(),
    },
    location: {
      lat: 34.0151,
      lng: 71.5249,
      address: 'Hayatabad Phase 4, Peshawar',
      inSafeZone: true,
      safeZoneName: 'Home Zone',
    },
    safeZones: [
      {
        id: 'zone_001',
        name: 'Home Zone',
        lat: 34.0151,
        lng: 71.5249,
        radius: 100,
        color: '#00D4AA',
      },
      {
        id: 'zone_002',
        name: 'School Zone',
        lat: 34.0089,
        lng: 71.5312,
        radius: 150,
        color: '#6366F1',
      },
    ],
    activityToday: {
      activeMinutes: 124,
      restingMinutes: 310,
      steps: 4280,
      score: 82,
    },
  },
  {
    id: 'child_002',
    name: 'Umar Ahmed',
    age: 11,
    gender: 'male',
    grade: 'Class 6',
    school: 'City School Peshawar',
    schoolStart: '08:00',
    schoolEnd: '14:30',
    status: 'WARNING' as const,
    band: {
      code: 'CG-9134-MZBT',
      battery: 34,
      connected: true,
      signal: 3,
    },
    vitals: {
      heartRate: 118,
      heartRateTrend: 'up' as const,
      spo2: 97,
      temperature: 37.1,
      lastUpdated: new Date(),
    },
    location: {
      lat: 34.0089,
      lng: 71.5312,
      address: 'City School, Peshawar',
      inSafeZone: true,
      safeZoneName: 'School Zone',
    },
    safeZones: [],
    activityToday: {
      activeMinutes: 89,
      restingMinutes: 245,
      steps: 3120,
      score: 71,
    },
  },
]

export const ALERTS = [
  {
    id: 'alert_001',
    childId: 'child_001',
    childName: 'Sara Ahmed',
    type: 'FALL_DETECTED',
    severity: 'EMERGENCY' as const,
    title: 'Fall Detected',
    description: 'Sara may have fallen near the playground area. AI detected sudden impact.',
    timestamp: new Date(Date.now() - 3600000),
    location: { lat: 34.0151, lng: 71.5249, address: 'Hayatabad Park, Peshawar' },
    vitalsAtAlert: { heartRate: 145, spo2: 96, temperature: 36.9 },
    resolved: true,
  },
  {
    id: 'alert_002',
    childId: 'child_002',
    childName: 'Umar Ahmed',
    type: 'HIGH_HEART_RATE',
    severity: 'WARNING' as const,
    title: 'Elevated Heart Rate',
    description: "Umar's heart rate has been above 115 BPM for 5 minutes while stationary.",
    timestamp: new Date(Date.now() - 900000),
    location: { lat: 34.0089, lng: 71.5312, address: 'City School, Peshawar' },
    vitalsAtAlert: { heartRate: 118, spo2: 97, temperature: 37.1 },
    resolved: false,
  },
  {
    id: 'alert_003',
    childId: 'child_001',
    childName: 'Sara Ahmed',
    type: 'LEFT_SAFE_ZONE',
    severity: 'WARNING' as const,
    title: 'Left Safe Zone',
    description: 'Sara has moved outside the Home Zone boundary.',
    timestamp: new Date(Date.now() - 7200000),
    location: { lat: 34.0165, lng: 71.5260, address: '120m from Home, Peshawar' },
    vitalsAtAlert: { heartRate: 98, spo2: 99, temperature: 36.7 },
    resolved: true,
  },
  {
    id: 'alert_004',
    childId: 'child_001',
    childName: 'Sara Ahmed',
    type: 'SOS_PRESSED',
    severity: 'EMERGENCY' as const,
    title: 'SOS Button Pressed',
    description: 'Sara pressed the emergency SOS button on her band.',
    timestamp: new Date(Date.now() - 86400000),
    location: { lat: 34.0130, lng: 71.5200, address: 'Hayatabad Park, Peshawar' },
    vitalsAtAlert: { heartRate: 162, spo2: 97, temperature: 36.8 },
    resolved: true,
  },
  {
    id: 'alert_005',
    childId: 'child_001',
    childName: 'Sara Ahmed',
    type: 'TAMPER_DETECTED',
    severity: 'EMERGENCY' as const,
    title: 'Band Tamper Detected',
    description: 'Someone attempted to forcefully remove Sara\'s band.',
    timestamp: new Date(Date.now() - 172800000),
    location: { lat: 34.0110, lng: 71.5190, address: 'Near School Gate, Peshawar' },
    vitalsAtAlert: { heartRate: 155, spo2: 98, temperature: 36.9 },
    resolved: true,
  },
]

export const HEART_RATE_HISTORY = Array.from({ length: 24 }, (_, i) => ({
  time: new Date(Date.now() - (23 - i) * 3600000),
  value: Math.floor(Math.random() * 35) + 75,
}))

export const SPO2_HISTORY = Array.from({ length: 24 }, (_, i) => ({
  time: new Date(Date.now() - (23 - i) * 3600000),
  value: Math.floor(Math.random() * 4) + 96,
}))

export const TEMP_HISTORY = Array.from({ length: 24 }, (_, i) => ({
  time: new Date(Date.now() - (23 - i) * 3600000),
  value: parseFloat((Math.random() * 0.8 + 36.3).toFixed(1)),
}))

export const EMERGENCY_CONTACTS = [
  { id: 1, name: 'Ahmed Khan', relation: 'Father', phone: '+92-300-1234567', primary: true },
  { id: 2, name: 'Fatima Khan', relation: 'Mother', phone: '+92-301-7654321', primary: false },
  { id: 3, name: 'Usman Khan', relation: 'Uncle', phone: '+92-333-9876543', primary: false },
]