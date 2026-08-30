import React from 'react';
import { View, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ThemedText } from '../components/ui/ThemedText';
import { GlassCard } from '../components/ui/GlassCard';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '../store/themeStore';

export default function PrivacySecurityScreen() {
  const router = useRouter();
  const { colors } = useThemeStore();

  const SettingToggle = ({ title, subtitle, value, onToggle }: any) => (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 }}>
      <View style={{ flex: 1 }}>
        <ThemedText style={{ fontSize: 14, color: colors.TEXT_PRIMARY, fontWeight: '500' }}>{title}</ThemedText>
        {subtitle && <ThemedText style={{ fontSize: 12, color: colors.TEXT_SECONDARY }}>{subtitle}</ThemedText>}
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: colors.BG_TERTIARY, true: colors.ACCENT_TEAL }}
        thumbColor="#FFF"
      />
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.BG_PRIMARY }} edges={['top', 'bottom']}>
      <View style={{ padding: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
          <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, marginRight: 8 }}>
            <Ionicons name="arrow-back" size={24} color={colors.TEXT_PRIMARY} />
          </TouchableOpacity>
          <ThemedText weight="bold" style={{ fontSize: 24, color: colors.TEXT_PRIMARY }}>
            Privacy & Security
          </ThemedText>
        </View>

        <GlassCard style={{ padding: 16, marginBottom: 20 }}>
          <SettingToggle
            title="Location Tracking"
            subtitle="Allow app to track child's location"
            value={true}
            onToggle={() => {}}
          />
          <View style={{ height: 1, backgroundColor: colors.BORDER, marginVertical: 8 }} />
          <SettingToggle
            title="Emergency Alerts"
            subtitle="Send alerts to emergency contacts"
            value={true}
            onToggle={() => {}}
          />
          <View style={{ height: 1, backgroundColor: colors.BORDER, marginVertical: 8 }} />
          <SettingToggle
            title="Data Sharing"
            subtitle="Share anonymized data for research"
            value={false}
            onToggle={() => {}}
          />
        </GlassCard>

        <GlassCard style={{ padding: 16 }}>
          <TouchableOpacity style={{ paddingVertical: 12 }}>
            <ThemedText style={{ fontSize: 14, color: colors.ACCENT_TEAL, fontWeight: '600' }}>
              View Data Privacy Policy →
            </ThemedText>
          </TouchableOpacity>
        </GlassCard>
      </View>
    </SafeAreaView>
  );
}