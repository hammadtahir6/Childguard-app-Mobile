// Find your computer's IP address by running 'ipconfig' in Command Prompt
// Look for "IPv4 Address" under your WiFi adapter

export const BASE_URL = 'http://192.168.18.100:8000'; // 👈 REPLACE THIS WITH YOUR ACTUAL IP!

export const API_ENDPOINTS = {
  // Auth
  LOGIN: `${BASE_URL}/auth/login`,
  REGISTER: `${BASE_URL}/auth/register`,
  
  // Children
  CHILDREN: `${BASE_URL}/children`,
  
  // Vitals
  VITALS: (childId: string) => `${BASE_URL}/vitals/${childId}`,
  VITALS_HISTORY: (childId: string, hours: number = 24) => 
    `${BASE_URL}/vitals/${childId}/history?hours=${hours}`,
} as const;