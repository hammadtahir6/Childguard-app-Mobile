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

export default function WifiSetupScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const childId = params.childId as string;
  
  const { colors } = useThemeStore();
  const { showToast } = useToastStore();
  const [wifiName, setWifiName] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSendWifiCredentials = async () => {
    if (!wifiName.trim() || !wifiPassword.trim()) {
      showToast('Please enter WiFi name and password', 'warning');
      return;
    }

    setIsSending(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        showToast('Session expired', 'error');
        router.replace('/(auth)/login');
        return;
      }

      // Send WiFi credentials to band via backend
      await axios.post(
        `${BASE_URL}/bands/setup-wifi/${childId}`,
        { 
          wifi_ssid: wifiName.trim(),
          wifi_password: wifiPassword.trim()
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      showToast('WiFi credentials sent to band!', 'success');
      router.replace('/(tabs)');
    } catch (error: any) {
      console.error('WiFi setup error:', error);
      showToast('Failed to send WiFi credentials. Please try again.', 'error');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.BG_PRIMARY }} edges={['top', 'bottom']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 24, flexGrow: 1, justifyContent: 'center' }}>
        
        <View style={{ alignItems: 'center', marginBottom: 32 }}>
          <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: colors.ACCENT_TEAL + '20', justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}>
            <Ionicons name="wifi" size={40} color={colors.ACCENT_TEAL} />
          </View>
          <ThemedText weight="bold" style={{ fontSize: 24, color: colors.TEXT_PRIMARY, textAlign: 'center', marginBottom: 8 }}>
            Connect Band to WiFi
          </ThemedText>
          <ThemedText style={{ fontSize: 14, color: colors.TEXT_SECONDARY, textAlign: 'center' }}>
            Enter your WiFi credentials to connect the band to the internet
          </ThemedText>
        </View>

        <GlassCard style={{ padding: 24, gap: 16, marginBottom: 24 }}>
          <View>
            <ThemedText style={{ fontSize: 12, color: colors.TEXT_SECONDARY, marginBottom: 6 }}>
              WiFi Network Name (SSID)
            </ThemedText>
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.BG_TERTIARY, borderRadius: 12, borderWidth: 1, borderColor: colors.BORDER, paddingHorizontal: 12 }}>
              <Ionicons name="wifi" size={20} color={colors.TEXT_SECONDARY} style={{ marginRight: 8 }} />
              <TextInput
                placeholder="Enter WiFi name"
                placeholderTextColor={colors.TEXT_SECONDARY}
                value={wifiName}
                onChangeText={setWifiName}
                autoCapitalize="none"
                style={{ flex: 1, height: 50, color: colors.TEXT_PRIMARY, fontSize: 15 }}
              />
            </View>
          </View>

          <View>
            <ThemedText style={{ fontSize: 12, color: colors.TEXT_SECONDARY, marginBottom: 6 }}>
              WiFi Password
            </ThemedText>
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.BG_TERTIARY, borderRadius: 12, borderWidth: 1, borderColor: colors.BORDER, paddingHorizontal: 12 }}>
              <Ionicons name="lock-closed" size={20} color={colors.TEXT_SECONDARY} style={{ marginRight: 8 }} />
              <TextInput
                placeholder="Enter WiFi password"
                placeholderTextColor={colors.TEXT_SECONDARY}
                value={wifiPassword}
                onChangeText={setWifiPassword}
                secureTextEntry
                style={{ flex: 1, height: 50, color: colors.TEXT_PRIMARY, fontSize: 15 }}
              />
            </View>
          </View>

          <View style={{ backgroundColor: colors.ACCENT_TEAL + '10', padding: 12, borderRadius: 8, marginTop: 8 }}>
            <ThemedText style={{ fontSize: 12, color: colors.ACCENT_TEAL }}>
              💡 The band will connect to this WiFi network and start sending data to your phone
            </ThemedText>
          </View>
        </GlassCard>

        <GradientButton 
          title={isSending ? 'Sending...' : 'Connect Band to WiFi'} 
          onPress={handleSendWifiCredentials}
          disabled={isSending}
        />

        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 16, alignItems: 'center' }}>
          <ThemedText style={{ color: colors.TEXT_SECONDARY, fontSize: 14 }}>Skip for now</ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}