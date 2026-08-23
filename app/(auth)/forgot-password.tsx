import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '../../components/ui/ThemedText';
import { ThemedView } from '../../components/ui/ThemedView';
import { GlassCard } from '../../components/ui/GlassCard';
import { GradientButton } from '../../components/ui/GradientButton';
import { useThemeStore } from '../../store/themeStore';
import { Ionicons } from '@expo/vector-icons';

export default function ForgotPassword() {
  const router = useRouter();
  const { colors } = useThemeStore();
  const [email, setEmail] = useState('');
  const [step, setStep] = useState(1);

  const handleSendReset = () => setStep(2);

  return (
    <ThemedView style={styles.container}>
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
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  input: { height: 50, borderRadius: 12, paddingHorizontal: 16, fontSize: 15 },
});