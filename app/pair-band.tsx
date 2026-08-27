import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useThemeStore } from '../store/themeStore';
import { useToastStore } from '../store/toastStore';
import { ThemedText } from '../components/ui/ThemedText';
import { GlassCard } from '../components/ui/GlassCard';
import { GradientButton } from '../components/ui/GradientButton';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../api/config';

export default function PairBandScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const childId = params.childId as string;
  
  const { colors } = useThemeStore();
  const { showToast } = useToastStore();
  const [bandCode, setBandCode] = useState('');
  const [isPairing, setIsPairing] = useState(false);

  const handlePairBand = async () => {
    if (!bandCode.trim()) {
      showToast('Please enter the band code', 'warning');
      return;
    }

    setIsPairing(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        showToast('Session expired. Please login again.', 'error');
        router.replace('/(auth)/login');
        return;
      }

      await axios.post(
        `${BASE_URL}/bands/pair`,
        { child_id: childId, band_code: bandCode.trim().toUpperCase() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      showToast('Band paired successfully!', 'success');
      // ✅ Redirect to WiFi setup instead of dashboard
      router.replace(`/wifi-setup?childId=${childId}`);
    } catch (error: any) {
      console.error('Pair band error:', error);
      const errorMsg = error.response?.data?.detail || 'Failed to pair band. Please check the code.';
      showToast(errorMsg, 'error');
    } finally {
      setIsPairing(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.BG_PRIMARY }} edges={['top', 'bottom']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 24, flexGrow: 1, justifyContent: 'center' }}>
        
        <View style={{ alignItems: 'center', marginBottom: 32 }}>
          <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: colors.ACCENT_TEAL + '20', justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}>
            <Ionicons name="watch-outline" size={40} color={colors.ACCENT_TEAL} />
          </View>
          <ThemedText weight="bold" style={{ fontSize: 24, color: colors.TEXT_PRIMARY, textAlign: 'center', marginBottom: 8 }}>
            Pair Your Band
          </ThemedText>
          <ThemedText style={{ fontSize: 14, color: colors.TEXT_SECONDARY, textAlign: 'center' }}>
            Enter the unique code printed on your ChildGuard band
          </ThemedText>
        </View>

        <GlassCard style={{ padding: 24, gap: 16, marginBottom: 24 }}>
          <View>
            <ThemedText style={{ fontSize: 12, color: colors.TEXT_SECONDARY, marginBottom: 6 }}>
              Band Code
            </ThemedText>
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.BG_TERTIARY, borderRadius: 12, borderWidth: 1, borderColor: colors.BORDER, paddingHorizontal: 12 }}>
              <Ionicons name="barcode-outline" size={24} color={colors.TEXT_SECONDARY} style={{ marginRight: 8 }} />
              <TextInput
                placeholder="e.g., CG-1234-ABCD"
                placeholderTextColor={colors.TEXT_SECONDARY}
                value={bandCode}
                onChangeText={setBandCode}
                autoCapitalize="characters"
                style={{ flex: 1, height: 50, color: colors.TEXT_PRIMARY, fontSize: 16, fontWeight: '600' }}
              />
            </View>
            <ThemedText style={{ fontSize: 11, color: colors.TEXT_SECONDARY, marginTop: 6 }}>
              The band code is usually found on the back of the device or on the packaging
            </ThemedText>
          </View>
        </GlassCard>

        <GradientButton 
          title={isPairing ? 'Pairing...' : 'Pair Band'} 
          onPress={handlePairBand}
          disabled={isPairing}
        />

        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 16, alignItems: 'center' }}>
          <ThemedText style={{ color: colors.TEXT_SECONDARY, fontSize: 14 }}>Go Back</ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}