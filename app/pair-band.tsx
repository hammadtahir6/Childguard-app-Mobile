import React, { useState } from 'react';
import { View, ScrollView, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import { ThemedText } from '../components/ui/ThemedText';
import { ThemedView } from '../components/ui/ThemedView';
import { GlassCard } from '../components/ui/GlassCard';
import { GradientButton } from '../components/ui/GradientButton';
import { useThemeStore } from '../store/themeStore';
import { useToastStore } from '../store/toastStore';
import { Ionicons } from '@expo/vector-icons';

export default function PairBandScreen() {
  const router = useRouter();
  const { colors } = useThemeStore();
  const { showToast } = useToastStore();
  const [step, setStep] = useState(1);
  const [bandCode, setBandCode] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  const handleContinue = () => {
    if (step === 1 && bandCode.length < 12) {
      showToast('Please enter a valid 12-digit band code', 'error');
      return;
    }
    if (step === 4) {
      // Simulate connection steps
      setIsConnecting(true);
      setTimeout(() => setStep(5), 6000);
      return;
    }
    setStep(step + 1);
  };

  const steps = ['Scan', 'Found', 'WiFi', 'Connect', 'Done'];

  return (
    <ThemedView style={{ flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
        
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 32 }}>
          <TouchableOpacity onPress={() => (step > 1 && !isConnecting ? setStep(step - 1) : router.back())} style={{ padding: 8, marginRight: 12 }}>
            <Ionicons name="arrow-back" size={24} color={colors.TEXT_PRIMARY} />
          </TouchableOpacity>
          <ThemedText weight="bold" style={{ fontSize: 20, color: colors.TEXT_PRIMARY }}>Pair Band</ThemedText>
        </View>

        {/* Step Indicator */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40, paddingHorizontal: 10 }}>
          {steps.map((s, i) => {
            const isCompleted = i + 1 < step;
            const isCurrent = i + 1 === step;
            return (
              <View key={s} style={{ alignItems: 'center', flex: 1 }}>
                <View style={{ 
                  width: 32, height: 32, borderRadius: 16, 
                  backgroundColor: isCompleted || isCurrent ? colors.ACCENT_TEAL : colors.BG_TERTIARY,
                  justifyContent: 'center', alignItems: 'center', marginBottom: 8,
                  borderWidth: isCurrent ? 2 : 0, borderColor: '#FFF'
                }}>
                  {isCompleted ? <Ionicons name="checkmark" size={18} color="#FFF" /> : 
                   <ThemedText style={{ color: isCurrent ? '#FFF' : colors.TEXT_SECONDARY, fontSize: 14, fontWeight: 'bold' }}>{i + 1}</ThemedText>}
                </View>
                <ThemedText style={{ fontSize: 11, color: isCompleted || isCurrent ? colors.ACCENT_TEAL : colors.TEXT_SECONDARY, fontWeight: isCurrent ? '600' : '400' }}>{s}</ThemedText>
              </View>
            );
          })}
        </View>

        {/* STEP 1: Enter Code */}
        {step === 1 && (
          <GlassCard style={{ padding: 24, alignItems: 'center', gap: 20 }}>
            <Ionicons name="watch-outline" size={64} color={colors.ACCENT_TEAL} />
            <ThemedText weight="bold" style={{ fontSize: 18, color: colors.TEXT_PRIMARY, textAlign: 'center' }}>Enter Band Code</ThemedText>
            <ThemedText style={{ fontSize: 13, color: colors.TEXT_SECONDARY, textAlign: 'center' }}>Find the 12-digit code printed inside your ChildGuard box.</ThemedText>
            
            <TextInput 
              placeholder="CG-XXXX-XXXX" 
              placeholderTextColor={colors.TEXT_SECONDARY}
              value={bandCode}
              onChangeText={(t) => setBandCode(t.toUpperCase().replace(/[^A-Z0-9-]/g, ''))}
              maxLength={12}
              style={[styles.input, { backgroundColor: colors.BG_TERTIARY, borderColor: colors.BORDER, color: colors.TEXT_PRIMARY, textAlign: 'center', letterSpacing: 2, fontSize: 20, fontFamily: 'SpaceMono_400Regular' }]} 
            />
            
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12 }} onPress={() => router.push('/qr-scan')}>
              <Ionicons name="qr-code-outline" size={20} color={colors.ACCENT_TEAL} />
              <ThemedText style={{ fontSize: 14, color: colors.ACCENT_TEAL, fontWeight: '600' }}>Scan QR Code Instead</ThemedText>
            </TouchableOpacity>
          </GlassCard>
        )}

        {/* STEP 2: Band Found */}
        {step === 2 && (
          <GlassCard style={{ padding: 24, alignItems: 'center', gap: 20 }}>
            <MotiView from={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 12 }}>
              <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: colors.SUCCESS + '20', justifyContent: 'center', alignItems: 'center' }}>
                <Ionicons name="checkmark-circle" size={48} color={colors.SUCCESS} />
              </View>
            </MotiView>
            <ThemedText weight="bold" style={{ fontSize: 20, color: colors.TEXT_PRIMARY }}>Band Found!</ThemedText>
            <ThemedText font="mono" style={{ fontSize: 16, color: colors.ACCENT_TEAL }}>{bandCode || 'CG-2847-XKQP'}</ThemedText>
            
            <View style={{ width: '100%', gap: 8, marginTop: 8 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <ThemedText style={{ color: colors.TEXT_SECONDARY }}>Firmware</ThemedText>
                <ThemedText style={{ color: colors.TEXT_PRIMARY }}>v1.2.3</ThemedText>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <ThemedText style={{ color: colors.TEXT_SECONDARY }}>Battery</ThemedText>
                <ThemedText style={{ color: colors.SUCCESS }}>100% (New)</ThemedText>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <ThemedText style={{ color: colors.TEXT_SECONDARY }}>Status</ThemedText>
                <ThemedText style={{ color: colors.TEXT_PRIMARY }}>Awaiting pairing</ThemedText>
              </View>
            </View>
          </GlassCard>
        )}

        {/* STEP 3: WiFi Setup */}
        {step === 3 && (
          <GlassCard style={{ padding: 24, gap: 16 }}>
            <ThemedText weight="bold" style={{ fontSize: 18, color: colors.TEXT_PRIMARY, textAlign: 'center' }}>Connect Band to WiFi</ThemedText>
            <ThemedText style={{ fontSize: 13, color: colors.TEXT_SECONDARY, textAlign: 'center', marginBottom: 8 }}>The band uses WiFi at home and cellular when away.</ThemedText>
            
            <View>
              <ThemedText style={{ fontSize: 12, color: colors.TEXT_SECONDARY, marginBottom: 6 }}>WiFi Network Name</ThemedText>
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.BG_TERTIARY, borderRadius: 12, borderWidth: 1, borderColor: colors.BORDER, paddingHorizontal: 12 }}>
                <Ionicons name="wifi" size={20} color={colors.TEXT_SECONDARY} style={{ marginRight: 8 }} />
                <TextInput placeholder="Home_WiFi_5G" placeholderTextColor={colors.TEXT_SECONDARY} style={{ flex: 1, height: 50, color: colors.TEXT_PRIMARY }} />
              </View>
            </View>
            <View>
              <ThemedText style={{ fontSize: 12, color: colors.TEXT_SECONDARY, marginBottom: 6 }}>WiFi Password</ThemedText>
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.BG_TERTIARY, borderRadius: 12, borderWidth: 1, borderColor: colors.BORDER, paddingHorizontal: 12 }}>
                <Ionicons name="lock-closed" size={20} color={colors.TEXT_SECONDARY} style={{ marginRight: 8 }} />
                <TextInput placeholder="••••••••" secureTextEntry placeholderTextColor={colors.TEXT_SECONDARY} style={{ flex: 1, height: 50, color: colors.TEXT_PRIMARY }} />
              </View>
            </View>
          </GlassCard>
        )}

        {/* STEP 4: Connecting Animation */}
        {step === 4 && (
          <GlassCard style={{ padding: 32, alignItems: 'center', gap: 24, minHeight: 300, justifyContent: 'center' }}>
            <MotiView animate={{ rotate: '360deg' }} transition={{ type: 'timing', duration: 2000, loop: true }}>
              <Ionicons name="sync" size={48} color={colors.ACCENT_TEAL} />
            </MotiView>
            <ThemedText weight="bold" style={{ fontSize: 18, color: colors.TEXT_PRIMARY }}>
              {isConnecting ? 'Establishing secure connection...' : 'Connecting Band...'}
            </ThemedText>
            <View style={{ width: '100%', gap: 12 }}>
              {['Connecting to WiFi...', 'Reaching ChildGuard servers...', 'Pairing to profile...'].map((text, i) => (
                <MotiView key={i} from={{ opacity: 0, translateX: -10 }} animate={{ opacity: 1, translateX: 0 }} transition={{ delay: i * 1500 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Ionicons name="checkmark-circle" size={16} color={colors.SUCCESS} />
                    <ThemedText style={{ fontSize: 14, color: colors.TEXT_SECONDARY }}>{text}</ThemedText>
                  </View>
                </MotiView>
              ))}
            </View>
          </GlassCard>
        )}

        {/* STEP 5: Success */}
        {step === 5 && (
          <GlassCard style={{ padding: 32, alignItems: 'center', gap: 20 }}>
            <MotiView from={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 10 }}>
              <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: colors.SUCCESS + '20', justifyContent: 'center', alignItems: 'center' }}>
                <Ionicons name="shield-checkmark" size={56} color={colors.SUCCESS} />
              </View>
            </MotiView>
            <ThemedText weight="bold" style={{ fontSize: 24, color: colors.TEXT_PRIMARY, textAlign: 'center' }}>Band Paired! 🎉</ThemedText>
            <ThemedText style={{ fontSize: 14, color: colors.TEXT_SECONDARY, textAlign: 'center', lineHeight: 20 }}>
              ChildGuard is now monitoring 24/7. You'll be notified instantly if anything happens.
            </ThemedText>
            
            <View style={{ width: '100%', marginTop: 8, gap: 8 }}>
              {['Band Connected', 'WiFi Configured', 'GPS Tracking Active', 'AI Monitoring Running'].map((item, i) => (
                <MotiView key={i} from={{ opacity: 0, translateY: 10 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: i * 200 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, backgroundColor: colors.BG_TERTIARY, borderRadius: 10 }}>
                    <Ionicons name="checkmark-circle" size={18} color={colors.SUCCESS} />
                    <ThemedText style={{ fontSize: 14, color: colors.TEXT_PRIMARY, fontWeight: '500' }}>{item}</ThemedText>
                  </View>
                </MotiView>
              ))}
            </View>
          </GlassCard>
        )}

        {/* Bottom Button */}
        <View style={{ marginTop: 32 }}>
          {step < 5 ? (
            <GradientButton title={step === 4 ? 'Connecting...' : 'Continue'} onPress={handleContinue} disabled={isConnecting} />
          ) : (
            <GradientButton title="Go to Dashboard" onPress={() => router.replace('/(tabs)')} />
          )}
        </View>

      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  input: { height: 56, borderRadius: 12, borderWidth: 1, width: '100%' },
});