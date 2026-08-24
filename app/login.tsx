import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '../store/themeStore';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';
import { ThemedText } from '../components/ui/ThemedText';
import { GlassCard } from '../components/ui/GlassCard';
import { GradientButton } from '../components/ui/GradientButton';

export default function LoginScreen() {
  const router = useRouter();
  const { colors } = useThemeStore();
  const { login } = useAuthStore();
  const { showToast } = useToastStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!email || !password) {
      showToast('Please fill in all fields', 'warning');
      return;
    }
    login(email); // Simulate login
    showToast('Login successful!', 'success');
  };

  const handleGoogleLogin = () => {
    login('user@gmail.com'); // Simulate Google login
    showToast('Logged in with Google', 'success');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.BG_PRIMARY }} edges={['top', 'bottom']}>
      <View style={{ flex: 1, padding: 24, justifyContent: 'center' }}>
        
        <View style={{ marginBottom: 32 }}>
          <ThemedText weight="bold" style={{ fontSize: 32, color: colors.TEXT_PRIMARY }}>Welcome Back</ThemedText>
          <ThemedText style={{ fontSize: 16, color: colors.TEXT_SECONDARY, marginTop: 8 }}>Login to access ChildGuard</ThemedText>
        </View>

        <GlassCard style={{ padding: 24, gap: 16 }}>
          <View>
            <ThemedText style={{ fontSize: 12, color: colors.TEXT_SECONDARY, marginBottom: 6, fontWeight: '600' }}>Email Address</ThemedText>
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.BG_TERTIARY, borderRadius: 12, borderWidth: 1, borderColor: colors.BORDER, paddingHorizontal: 12 }}>
              <Ionicons name="mail-outline" size={20} color={colors.TEXT_SECONDARY} />
              <TextInput placeholder="your@email.com" placeholderTextColor={colors.TEXT_SECONDARY} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" style={{ flex: 1, height: 50, color: colors.TEXT_PRIMARY, fontSize: 15, marginLeft: 8 }} />
            </View>
          </View>

          <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
              <ThemedText style={{ fontSize: 12, color: colors.TEXT_SECONDARY, fontWeight: '600' }}>Password</ThemedText>
              <ThemedText onPress={() => router.push('/forgot-password')} style={{ fontSize: 12, color: colors.ACCENT_TEAL, fontWeight: '600' }}>Forgot Password?</ThemedText>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.BG_TERTIARY, borderRadius: 12, borderWidth: 1, borderColor: colors.BORDER, paddingHorizontal: 12 }}>
              <Ionicons name="lock-closed-outline" size={20} color={colors.TEXT_SECONDARY} />
              <TextInput placeholder="••••••••" placeholderTextColor={colors.TEXT_SECONDARY} value={password} onChangeText={setPassword} secureTextEntry style={{ flex: 1, height: 50, color: colors.TEXT_PRIMARY, fontSize: 15, marginLeft: 8 }} />
            </View>
          </View>

          <GradientButton title="Login" onPress={handleLogin} />

          <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 8 }}>
            <View style={{ flex: 1, height: 1, backgroundColor: colors.BORDER }} />
            <ThemedText style={{ paddingHorizontal: 12, color: colors.TEXT_SECONDARY, fontSize: 12 }}>OR</ThemedText>
            <View style={{ flex: 1, height: 1, backgroundColor: colors.BORDER }} />
          </View>

          <TouchableOpacity onPress={handleGoogleLogin} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 14, borderRadius: 12, borderWidth: 1, borderColor: colors.BORDER, backgroundColor: colors.BG_TERTIARY }}>
            <Ionicons name="logo-google" size={20} color="#EA4335" />
            <ThemedText weight="semibold" style={{ fontSize: 15, color: colors.TEXT_PRIMARY }}>Continue with Google</ThemedText>
          </TouchableOpacity>
        </GlassCard>

        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 24, gap: 8 }}>
          <ThemedText style={{ fontSize: 14, color: colors.TEXT_SECONDARY }}>Don't have an account?</ThemedText>
          <ThemedText onPress={() => router.push('/register')} style={{ fontSize: 14, color: colors.ACCENT_TEAL, fontWeight: 'bold' }}>Register</ThemedText>
        </View>
      </View>
    </SafeAreaView>
  );
}