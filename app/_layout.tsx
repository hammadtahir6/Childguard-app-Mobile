import 'react-native-gesture-handler';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { SpaceMono_400Regular } from '@expo-google-fonts/space-mono';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View } from 'react-native';
import { useThemeStore } from '../store/themeStore';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import Toast from '../components/Toast';

// Prevent the splash screen from auto-hiding before assets/fonts are loaded.
SplashScreen.preventAutoHideAsync().catch(() => {
  /* Ignore error if already hidden */
});

export default function RootLayout() {
  const { colors, mode } = useThemeStore();

  const [fontsLoaded] = useFonts({
    Inter_400Regular, 
    Inter_500Medium, 
    Inter_600SemiBold, 
    Inter_700Bold, 
    SpaceMono_400Regular,
  });

  useEffect(() => {
    if (fontsLoaded) {
      // Hide the splash screen once fonts are loaded.
      SplashScreen.hideAsync().catch(() => {
        /* Ignore error if already hidden */
      });
    }
  }, [fontsLoaded]);

  // Return null to keep the splash screen visible while fonts load
  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <View style={{ flex: 1, backgroundColor: colors.BG_PRIMARY }}>
          <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.BG_PRIMARY } }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="onboarding" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="call-child" options={{ presentation: 'fullScreenModal', animation: 'slide_from_bottom' }} />
            <Stack.Screen name="activity" options={{ presentation: 'modal' }} />
            <Stack.Screen name="band-details" options={{ presentation: 'modal' }} />
            <Stack.Screen name="emergency" options={{ presentation: 'fullScreenModal' }} />
            <Stack.Screen name="child-profile" options={{ presentation: 'modal' }} />
            <Stack.Screen name="pair-band" options={{ presentation: 'modal', title: 'Pair Band' }} />
            <Stack.Screen name="wifi-setup" options={{ presentation: 'modal', title: 'WiFi Setup' }} />
            <Stack.Screen name="qr-scan" options={{ presentation: 'fullScreenModal' }} />
            <Stack.Screen name="alert-detail" options={{ presentation: 'modal' }} />
            <Stack.Screen name="emergency-contacts" options={{ presentation: 'modal' }} />
            <Stack.Screen name="add-child" options={{ presentation: 'modal', title: 'Add Child' }} />
            <Stack.Screen name="notifications" options={{ presentation: 'modal' }} />
            
            {/* SETTINGS ROUTES */}
            <Stack.Screen name="edit-profile" options={{ presentation: 'modal', title: 'Edit Profile' }} />
            <Stack.Screen name="change-password" options={{ presentation: 'modal', title: 'Change Password' }} />
            <Stack.Screen name="privacy-security" options={{ presentation: 'modal', title: 'Privacy' }} />
            <Stack.Screen name="language-select" options={{ presentation: 'modal', title: 'Language' }} />
            <Stack.Screen name="notification-prefs" options={{ presentation: 'modal', title: 'Notifications' }} />
            <Stack.Screen name="location-timer" options={{ presentation: 'modal', title: 'Location Timer' }} />
            <Stack.Screen name="safe-zone-map" options={{ presentation: 'modal', title: 'Safe Zones' }} />
            <Stack.Screen name="help-faq" options={{ presentation: 'modal', title: 'Help' }} />
            <Stack.Screen name="terms-privacy" options={{ presentation: 'modal', title: 'Terms' }} />
          </Stack>
        </View>
        <Toast />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}