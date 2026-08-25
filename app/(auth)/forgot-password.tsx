import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useToastStore } from '../../store/toastStore';
import { ThemedText } from '../../components/ui/ThemedText';
import { GlassCard } from '../../components/ui/GlassCard';
import { GradientButton } from '../../components/ui/GradientButton';
import { useThemeStore } from '../../store/themeStore';
import { Ionicons } from '@expo/vector-icons';

export default function ForgotPassword() {
  const router = useRouter();
  const { colors } = useThemeStore();
  const { showToast } = useToastStore();
  const [email, setEmail] = useState('');
  const [step, setStep] = useState(1);

  const handleSendReset = () => {
    if (!email) {
      showToast('Please enter your email address', 'warning');
      return;
    }
    showToast(`Reset link sent to ${email}`, 'success');
    
    setTimeout(() => {
      router.replace('/(auth)/login');
    }, 2000);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.BG_PRIMARY }} edges={['top', 'bottom']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
        <View style={{ padding: 24 }}>
          <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 16 }}>
            <Ionicons name="arrow-back" size={24} color={colors.TEXT_SECONDARY} />
          </TouchableOpacity>
          
          <ThemedText weight="bold" style={{ fontSize: 28, marginBottom: 8, color: colors.TEXT_PRIMARY }}>
            {step === 1 ? 'Reset Password' : 'Check Your Email'}
          </ThemedText>
          <ThemedText style={{ fontSize: 14, color: colors.TEXT_SECONDARY, marginBottom: 32 }}>
            {step === 1 ? 'Enter your email address and we will send you a link to reset your password.' : 'We have sent a password reset link to your email address. Please check your inbox.'}
          </ThemedText>
          
          {step === 1 ? (
            <GlassCard style={{ padding: 24, gap: 16 }}>
              <View>
                <ThemedText style={{ fontSize: 12, color: colors.TEXT_SECONDARY, marginBottom: 6 }}>Email Address</ThemedText>
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.BG_TERTIARY, borderRadius: 12, borderWidth: 1, borderColor: colors.BORDER }}>
                  <Ionicons name="mail-outline" size={20} color={colors.TEXT_SECONDARY} style={{ marginLeft: 12, marginRight: 8 }} />
                  <TextInput 
                    placeholder="Enter your email address" 
                    placeholderTextColor={colors.TEXT_SECONDARY} 
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                    style={[styles.input, { flex: 1, backgroundColor: 'transparent', borderWidth: 0, color: colors.TEXT_PRIMARY }]} 
                  />
                </View>
              </View>
            </GlassCard>
          ) : (
            <GlassCard style={{ padding: 40, alignItems: 'center', gap: 16 }}>
              <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: colors.SUCCESS + '20', justifyContent: 'center', alignItems: 'center' }}>
                <Ionicons name="checkmark" size={48} color={colors.SUCCESS} />
              </View>
              <ThemedText weight="bold" style={{ fontSize: 18, color: colors.TEXT_PRIMARY, textAlign: 'center' }}>Email Sent!</ThemedText>
              <ThemedText style={{ fontSize: 14, color: colors.TEXT_SECONDARY, textAlign: 'center' }}>Redirecting to login...</ThemedText>
            </GlassCard>
          )}
          
          <View style={{ marginTop: 32, gap: 16 }}>
            {step === 1 ? (
              <GradientButton title="Send Reset Link" onPress={handleSendReset} />
            ) : (
              <GradientButton title="Back to Login" onPress={() => router.replace('/(auth)/login')} />
            )}
            
            {step === 1 && (
              <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                <ThemedText style={{ textAlign: 'center', color: colors.TEXT_SECONDARY, fontSize: 14 }}>Remember your password? <ThemedText style={{ color: colors.ACCENT_TEAL }}>Sign In</ThemedText></ThemedText>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  input: { height: 50, borderRadius: 12, paddingHorizontal: 16, fontSize: 15 },
});