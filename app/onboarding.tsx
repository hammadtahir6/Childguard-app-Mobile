import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '../store/themeStore';
import { ThemedText } from '../components/ui/ThemedText';
import { GradientButton } from '../components/ui/GradientButton';

export default function OnboardingScreen() {
  const router = useRouter();
  const { colors } = useThemeStore();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.BG_PRIMARY }} edges={['top', 'bottom']}>
      <View style={styles.container}>
        {/* Logo Area */}
        <View style={styles.logoContainer}>
          <View style={[styles.logoCircle, { backgroundColor: colors.ACCENT_TEAL }]}>
            <Ionicons name="shield-checkmark" size={64} color="#FFF" />
          </View>
          <ThemedText weight="bold" style={{ fontSize: 36, color: colors.TEXT_PRIMARY, marginTop: 24, textAlign: 'center' }}>
            ChildGuard
          </ThemedText>
          <ThemedText style={{ fontSize: 16, color: colors.TEXT_SECONDARY, marginTop: 8, textAlign: 'center' }}>
            Safety First, Always.
          </ThemedText>
        </View>

        {/* Features List */}
        <View style={styles.featuresContainer}>
          {[
            { icon: 'location', text: 'Real-time GPS Tracking' },
            { icon: 'heart', text: 'Live Health Vitals' },
            { icon: 'alert-circle', text: 'Instant Emergency Alerts' },
          ].map((item, i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
              <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.ACCENT_TEAL + '20', justifyContent: 'center', alignItems: 'center', marginRight: 16 }}>
                <Ionicons name={item.icon as any} size={20} color={colors.ACCENT_TEAL} />
              </View>
              <ThemedText style={{ fontSize: 16, color: colors.TEXT_PRIMARY, fontWeight: '500' }}>{item.text}</ThemedText>
            </View>
          ))}
        </View>

        {/* Buttons */}
        <View style={{ width: '100%', gap: 12 }}>
          <GradientButton title="Get Started" onPress={() => router.push('/register')} />
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 8 }}>
            <ThemedText style={{ fontSize: 14, color: colors.TEXT_SECONDARY }}>Already have an account?</ThemedText>
            <ThemedText 
              onPress={() => router.push('/login')} 
              style={{ fontSize: 14, color: colors.ACCENT_TEAL, fontWeight: 'bold' }}
            >
              Login
            </ThemedText>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'space-between', alignItems: 'center', padding: 30, paddingTop: 60 },
  logoContainer: { alignItems: 'center', marginTop: 40 },
  logoCircle: { width: 120, height: 120, borderRadius: 60, justifyContent: 'center', alignItems: 'center', shadowColor: '#00D4AA', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 10 },
  featuresContainer: { width: '100%', marginBottom: 40 },
});