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

export default function RegisterScreen() {
  const router = useRouter();
  const { colors } = useThemeStore();
  const { register } = useAuthStore();
  const { showToast } = useToastStore();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    if (!name || !email || !password) {
      showToast('Please fill in all fields', 'warning');
      return;
    }
    register(name, email); // Simulate registration
    showToast('Account created successfully!', 'success');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.BG_PRIMARY }} edges={['top', 'bottom']}>
      <View style={{ flex: 1, padding: 24, justifyContent: 'center' }}>
        
        <View style={{ marginBottom: 32 }}>
          <ThemedText weight="bold" style={{ fontSize: 32, color: colors.TEXT_PRIMARY }}>Create Account</ThemedText>
          <ThemedText style={{ fontSize: 16, color: colors.TEXT_SECONDARY, marginTop: 8 }}>Join ChildGuard today</ThemedText>
        </View>

        <GlassCard style={{ padding: 24, gap: 16 }}>
          <View>
            <ThemedText style={{ fontSize: 12, color: colors.TEXT_SECONDARY, marginBottom: 6, fontWeight: '600' }}>Full Name</ThemedText>
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.BG_TERTIARY, borderRadius: 12, borderWidth: 1, borderColor: colors.BORDER, paddingHorizontal: 12 }}>
              <Ionicons name="person-outline" size={20} color={colors.TEXT_SECONDARY} />
              <TextInput placeholder="John Doe" placeholderTextColor={colors.TEXT_SECONDARY} value={name} onChangeText={setName} style={{ flex: 1, height: 50, color: colors.TEXT_PRIMARY, fontSize: 15, marginLeft: 8 }} />
            </View>
          </View>

          <View>
            <ThemedText style={{ fontSize: 12, color: colors.TEXT_SECONDARY, marginBottom: 6, fontWeight: '600' }}>Email Address</ThemedText>
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.BG_TERTIARY, borderRadius: 12, borderWidth: 1, borderColor: colors.BORDER, paddingHorizontal: 12 }}>
              <Ionicons name="mail-outline" size={20} color={colors.TEXT_SECONDARY} />
              <TextInput placeholder="your@email.com" placeholderTextColor={colors.TEXT_SECONDARY} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" style={{ flex: 1, height: 50, color: colors.TEXT_PRIMARY, fontSize: 15, marginLeft: 8 }} />
            </View>
          </View>

          <View>
            <ThemedText style={{ fontSize: 12, color: colors.TEXT_SECONDARY, marginBottom: 6, fontWeight: '600' }}>Password</ThemedText>
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.BG_TERTIARY, borderRadius: 12, borderWidth: 1, borderColor: colors.BORDER, paddingHorizontal: 12 }}>
              <Ionicons name="lock-closed-outline" size={20} color={colors.TEXT_SECONDARY} />
              <TextInput placeholder="••••••••" placeholderTextColor={colors.TEXT_SECONDARY} value={password} onChangeText={setPassword} secureTextEntry style={{ flex: 1, height: 50, color: colors.TEXT_PRIMARY, fontSize: 15, marginLeft: 8 }} />
            </View>
          </View>

          <GradientButton title="Create Account" onPress={handleRegister} />
        </GlassCard>

        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 24, gap: 8 }}>
          <ThemedText style={{ fontSize: 14, color: colors.TEXT_SECONDARY }}>Already have an account?</ThemedText>
          <ThemedText onPress={() => router.push('/login')} style={{ fontSize: 14, color: colors.ACCENT_TEAL, fontWeight: 'bold' }}>Login</ThemedText>
        </View>
      </View>
    </SafeAreaView>
  );
}