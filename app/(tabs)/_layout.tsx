import { Tabs } from 'expo-router';
import { useThemeStore } from '../../store/themeStore';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  const { colors, mode } = useThemeStore();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: mode === 'dark' ? 'rgba(17, 24, 39, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          borderTopWidth: 1,
          borderTopColor: colors.BORDER,
          position: 'absolute',
          elevation: 0,
          height: 85,
          paddingBottom: 25,
          paddingTop: 10,
        },
        tabBarActiveTintColor: colors.ACCENT_TEAL,
        tabBarInactiveTintColor: colors.TEXT_SECONDARY,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600', marginTop: 4 },
        tabBarIconStyle: { marginTop: 4 }
      }}
    >
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: 'Home', 
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />
          ) 
        }} 
      />
      <Tabs.Screen 
        name="map" 
        options={{ 
          title: 'Map', 
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'map' : 'map-outline'} size={24} color={color} />
          ) 
        }} 
      />
      <Tabs.Screen 
        name="alerts" 
        options={{ 
          title: 'Alerts', 
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'notifications' : 'notifications-outline'} size={24} color={color} />
          ),
          tabBarBadge: 1,
          tabBarBadgeStyle: { 
            backgroundColor: colors.DANGER, 
            color: '#FFF', 
            fontSize: 10,
            fontWeight: 'bold',
          }
        }} 
      />
      <Tabs.Screen 
        name="health" 
        options={{ 
          title: 'Health', 
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'heart' : 'heart-outline'} size={24} color={color} />
          ) 
        }} 
      />
      <Tabs.Screen 
        name="settings" 
        options={{ 
          title: 'Settings', 
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'settings' : 'settings-outline'} size={24} color={color} />
          ) 
        }} 
      />
    </Tabs>
  );
}