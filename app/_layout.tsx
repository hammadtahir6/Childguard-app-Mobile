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

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { colors, mode } = useThemeStore();

  const [fontsLoaded] = useFonts({
    Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, SpaceMono_400Regular,
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

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
            <Stack.Screen name="emergency" options={{ presentation: 'fullScreenModal' }} />
            <Stack.Screen name="child-profile" options={{ presentation: 'modal' }} />
            <Stack.Screen name="pair-band" options={{ presentation: 'modal' }} />
            <Stack.Screen name="alert-detail" options={{ presentation: 'modal' }} />
            <Stack.Screen name="qr-scan" options={{ presentation: 'fullScreenModal' }} />
            <Stack.Screen name="emergency-contacts" options={{ presentation: 'modal' }} />
            <Stack.Screen name="add-child" options={{ presentation: 'modal' }} />
            <Stack.Screen name="notifications" options={{ presentation: 'modal' }} />
            
            {/* NEW SETTINGS ROUTES */}
            <Stack.Screen name="edit-profile" options={{ presentation: 'modal' }} />
            <Stack.Screen name="language-select" options={{ presentation: 'modal' }} />
            <Stack.Screen name="notification-prefs" options={{ presentation: 'modal' }} />
            <Stack.Screen name="location-timer" options={{ presentation: 'modal' }} />
            <Stack.Screen name="safe-zone-map" options={{ presentation: 'modal' }} />
          </Stack>
        </View>
        <Toast />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}