import React from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '../components/ui/ThemedText';
import { ThemedView } from '../components/ui/ThemedView';
import { GlassCard } from '../components/ui/GlassCard';
import { useThemeStore } from '../store/themeStore';
import { useSettingsStore, LocationInterval } from '../store/settingsStore';
import { useToastStore } from '../store/toastStore';
import { Ionicons } from '@expo/vector-icons';

const INTERVALS: { value: LocationInterval; label: string; description: string }[] = [
  { value: 15, label: '15 seconds', description: 'Real-time tracking (High battery usage)' },
  { value: 30, label: '30 seconds', description: 'Frequent updates (Moderate battery)' },
  { value: 60, label: '1 minute', description: 'Balanced tracking (Recommended)' },
  { value: 300, label: '5 minutes', description: 'Low battery usage' },
  { value: 600, label: '10 minutes', description: 'Minimal battery usage' },
  { value: 1800, label: '30 minutes', description: 'Maximum battery savings' },
];

export default function LocationTimerScreen() {
  const router = useRouter();
  const { colors } = useThemeStore();
  const { locationInterval, setLocationInterval } = useSettingsStore();
  const { showToast } = useToastStore();

  const handleSelect = (value: LocationInterval) => {
    setLocationInterval(value);
    showToast(`Location updates every ${value < 60 ? value + 's' : value / 60 + 'm'}`, 'success');
    router.back();
  };

  const formatInterval = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    return `${seconds / 60}m`;
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
        
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
          <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, marginRight: 12 }}>
            <Ionicons name="arrow-back" size={24} color={colors.TEXT_PRIMARY} />
          </TouchableOpacity>
          <ThemedText weight="bold" style={{ fontSize: 22, color: colors.TEXT_PRIMARY }}>Location Updates</ThemedText>
        </View>

        <ThemedText style={{ fontSize: 14, color: colors.TEXT_SECONDARY, marginBottom: 20, lineHeight: 20 }}>
          How often should the band send location data? More frequent updates use more battery but provide better tracking.
        </ThemedText>

        {/* Current Setting Display */}
        <GlassCard style={{ padding: 16, marginBottom: 20, backgroundColor: colors.ACCENT_TEAL + '10', borderColor: colors.ACCENT_TEAL }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Ionicons name="navigate" size={24} color={colors.ACCENT_TEAL} />
            <View style={{ flex: 1 }}>
              <ThemedText style={{ fontSize: 12, color: colors.TEXT_SECONDARY }}>Current Setting</ThemedText>
              <ThemedText weight="bold" style={{ fontSize: 18, color: colors.ACCENT_TEAL }}>
                Every {formatInterval(locationInterval)}
              </ThemedText>
            </View>
          </View>
        </GlassCard>

        {/* Interval Options */}
        <View style={{ gap: 10 }}>
          {INTERVALS.map((item) => {
            const isSelected = locationInterval === item.value;
            return (
              <TouchableOpacity
                key={item.value}
                onPress={() => handleSelect(item.value)}
                activeOpacity={0.7}
                style={[
                  styles.intervalRow,
                  {
                    backgroundColor: isSelected ? colors.ACCENT_TEAL + '15' : colors.BG_SECONDARY,
                    borderColor: isSelected ? colors.ACCENT_TEAL : colors.BORDER,
                  }
                ]}
              >
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <ThemedText weight="semibold" style={{ fontSize: 16, color: colors.TEXT_PRIMARY }}>
                      {item.label}
                    </ThemedText>
                    {item.value === 60 && (
                      <View style={{ paddingHorizontal: 8, paddingVertical: 2, backgroundColor: colors.SUCCESS + '20', borderRadius: 6 }}>
                        <ThemedText style={{ fontSize: 10, color: colors.SUCCESS, fontWeight: '700' }}>RECOMMENDED</ThemedText>
                      </View>
                    )}
                  </View>
                  <ThemedText style={{ fontSize: 12, color: colors.TEXT_SECONDARY, marginTop: 4 }}>
                    {item.description}
                  </ThemedText>
                </View>
                {isSelected && (
                  <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: colors.ACCENT_TEAL, justifyContent: 'center', alignItems: 'center' }}>
                    <Ionicons name="checkmark" size={18} color="#FFF" />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Battery Impact Info */}
        <GlassCard style={{ marginTop: 24, padding: 16 }}>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <Ionicons name="battery-charging" size={24} color={colors.WARNING} />
            <View style={{ flex: 1 }}>
              <ThemedText weight="bold" style={{ fontSize: 14, color: colors.TEXT_PRIMARY, marginBottom: 4 }}>
                Battery Impact
              </ThemedText>
              <ThemedText style={{ fontSize: 13, color: colors.TEXT_SECONDARY, lineHeight: 18 }}>
                Shorter intervals drain the band battery faster. We recommend 1 minute for daily use and 30 seconds only during emergencies.
              </ThemedText>
            </View>
          </View>
        </GlassCard>

      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  intervalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
});