import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '../store/themeStore';
import { useToastStore } from '../store/toastStore';
import { ThemedText } from '../components/ui/ThemedText';
import { GlassCard } from '../components/ui/GlassCard';
import { GradientButton } from '../components/ui/GradientButton';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { colors } = useThemeStore();
  const { showToast } = useToastStore();
  const [email, setEmail] = useState('');

  const handleSendLink = () => {
    if (!email) {
      showToast('Please enter your email', 'warning');
      return;
    }
    // Simulate sending email
    showToast(`Reset link sent to ${email}`, 'success');
    setTimeout(() => router.back(), 1500);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.BG_PRIMARY }} edges={['top', 'bottom']}>
      <View style={{ flex: 1, padding: 24, justifyContent: 'center' }}>
        
        <TouchableOpacity onPress={() => router.back()} style={{ position: 'absolute', top: 50, left: 20, padding: 8 }}>
          <Ionicons name="arrow-back" size={24} color={colors.TEXT_PRIMARY} />
        </TouchableOpacity>

        <View style={{ alignItems: 'center', marginBottom: 32, marginTop: 40 }}>
          <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: colors.ACCENT_TEAL + '20', justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
            <Ionicons name="mail-unread" size={40} color={colors.ACCENT_TEAL} />
          </View>
          <ThemedText weight="bold" style={{ fontSize: 24, color: colors.TEXT_PRIMARY, textAlign: 'center' }}>Forgot Password?</ThemedText>
          <ThemedText style={{ fontSize: 14, color: colors.TEXT_SECONDARY, marginTop: 8, textAlign: 'center' }}>
            Enter your email and we'll send you a link to reset your password.
          </ThemedText>
        </View>

        <GlassCard style={{ padding: 24, gap: 16 }}>
          <View>
            <ThemedText style={{ fontSize: 12, color: colors.TEXT_SECONDARY, marginBottom: 6, fontWeight: '600' }}>Email Address</ThemedText>
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.BG_TERTIARY, borderRadius: 12, borderWidth: 1, borderColor: colors.BORDER, paddingHorizontal: 12 }}>
              <Ionicons name="mail-outline" size={20} color={colors.TEXT_SECONDARY} />
              <TextInput placeholder="your@email.com" placeholderTextColor={colors.TEXT_SECONDARY} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" style={{ flex: 1, height: 50, color: colors.TEXT_PRIMARY, fontSize: 15, marginLeft: 8 }} />
            </View>
          </View>

          <GradientButton title="Send Reset Link" onPress={handleSendLink} />
        </GlassCard>
      </View>
    </SafeAreaView>
  );
}