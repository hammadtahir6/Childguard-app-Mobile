import React from 'react';
import { View, ScrollView, Switch, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '../components/ui/ThemedText';
import { ThemedView } from '../components/ui/ThemedView';
import { GlassCard } from '../components/ui/GlassCard';
import { useThemeStore } from '../store/themeStore';
import { useSettingsStore } from '../store/settingsStore';
import { useToastStore } from '../store/toastStore';
import { Ionicons } from '@expo/vector-icons';

type NotifKey = 'emergency' | 'warning' | 'safeZone' | 'health' | 'battery' | 'system';

const NOTIF_TYPES: { 
  key: NotifKey; 
  title: string; 
  description: string; 
  icon: string; 
  defaultColor: string;
}[] = [
  { key: 'emergency', title: 'Emergency Alerts', description: 'Fall detection, SOS, tampering', icon: 'alert-circle', defaultColor: '#EF4444' },
  { key: 'warning', title: 'Warning Alerts', description: 'High heart rate, left safe zone', icon: 'warning', defaultColor: '#F59E0B' },
  { key: 'safeZone', title: 'Safe Zone Events', description: 'Arrived at school/home', icon: 'shield-checkmark', defaultColor: '#10B981' },
  { key: 'health', title: 'Health Updates', description: 'Vitals reports and summaries', icon: 'heart', defaultColor: '#3B82F6' },
  { key: 'battery', title: 'Battery Alerts', description: 'Low battery warnings', icon: 'battery-half', defaultColor: '#8B5CF6' },
  { key: 'system', title: 'System Updates', description: 'App updates and announcements', icon: 'settings', defaultColor: '#9CA3AF' },
];

const PRIORITY_LABELS: Record<string, string> = {
  critical: 'CRITICAL',
  high: 'HIGH',
  medium: 'MEDIUM',
  low: 'LOW',
  off: 'OFF',
};

const PRIORITY_COLORS: Record<string, string> = {
  critical: '#EF4444',
  high: '#F59E0B',
  medium: '#3B82F6',
  low: '#9CA3AF',
  off: '#6B7280',
};

export default function NotificationPrefsScreen() {
  const router = useRouter();
  const { colors } = useThemeStore();
  const { notifications, updateNotification } = useSettingsStore();
  const { showToast } = useToastStore();

  const handleToggle = (key: NotifKey, enabled: boolean) => {
    updateNotification(key, { enabled });
    showToast(`${enabled ? 'Enabled' : 'Disabled'} notifications`, 'info');
  };

  const cyclePriority = (key: NotifKey) => {
    const current = notifications[key].priority;
    const order: Array<'critical' | 'high' | 'medium' | 'low' | 'off'> = ['critical', 'high', 'medium', 'low', 'off'];
    const idx = order.indexOf(current);
    const next = order[(idx + 1) % order.length];
    updateNotification(key, { priority: next, enabled: next !== 'off' });
    showToast(`Priority set to ${PRIORITY_LABELS[next]}`, 'info');
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
        
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
          <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, marginRight: 12 }}>
            <Ionicons name="arrow-back" size={24} color={colors.TEXT_PRIMARY} />
          </TouchableOpacity>
          <ThemedText weight="bold" style={{ fontSize: 22, color: colors.TEXT_PRIMARY }}>Notification Preferences</ThemedText>
        </View>

        <ThemedText style={{ fontSize: 14, color: colors.TEXT_SECONDARY, marginBottom: 20, lineHeight: 20 }}>
          Control which notifications you receive and their priority level. Tap the priority badge to change it.
        </ThemedText>

        {/* Notification List */}
        <View style={{ gap: 12 }}>
          {NOTIF_TYPES.map((item) => {
            const pref = notifications[item.key];
            return (
              <GlassCard key={item.key} style={{ padding: 16 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <View style={{ 
                    width: 44, height: 44, borderRadius: 22, 
                    backgroundColor: item.defaultColor + '20',
                    justifyContent: 'center', alignItems: 'center'
                  }}>
                    <Ionicons name={item.icon as any} size={22} color={item.defaultColor} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <ThemedText weight="bold" style={{ fontSize: 15, color: colors.TEXT_PRIMARY }}>
                      {item.title}
                    </ThemedText>
                    <ThemedText style={{ fontSize: 12, color: colors.TEXT_SECONDARY, marginTop: 2 }}>
                      {item.description}
                    </ThemedText>
                  </View>
                  <Switch
                    value={pref.enabled}
                    onValueChange={(val) => handleToggle(item.key, val)}
                    trackColor={{ false: colors.BG_TERTIARY, true: colors.ACCENT_TEAL }}
                    thumbColor="#FFF"
                  />
                </View>

                {pref.enabled && (
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.BORDER }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                      <TouchableOpacity 
                        onPress={() => updateNotification(item.key, { sound: !pref.sound })}
                        style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
                      >
                        <Ionicons name={pref.sound ? 'volume-high' : 'volume-mute'} size={18} color={pref.sound ? colors.TEXT_PRIMARY : colors.TEXT_SECONDARY} />
                        <ThemedText style={{ fontSize: 12, color: pref.sound ? colors.TEXT_PRIMARY : colors.TEXT_SECONDARY }}>Sound</ThemedText>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        onPress={() => updateNotification(item.key, { vibration: !pref.vibration })}
                        style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
                      >
                        <Ionicons name={pref.vibration ? 'phone-portrait' : 'phone-portrait-outline'} size={18} color={pref.vibration ? colors.TEXT_PRIMARY : colors.TEXT_SECONDARY} />
                        <ThemedText style={{ fontSize: 12, color: pref.vibration ? colors.TEXT_PRIMARY : colors.TEXT_SECONDARY }}>Vibrate</ThemedText>
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity 
                      onPress={() => cyclePriority(item.key)}
                      style={{ 
                        paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8,
                        backgroundColor: PRIORITY_COLORS[pref.priority] + '20',
                        borderWidth: 1, borderColor: PRIORITY_COLORS[pref.priority]
                      }}
                    >
                      <ThemedText style={{ fontSize: 10, fontWeight: 'bold', color: PRIORITY_COLORS[pref.priority] }}>
                        {PRIORITY_LABELS[pref.priority]}
                      </ThemedText>
                    </TouchableOpacity>
                  </View>
                )}
              </GlassCard>
            );
          })}
        </View>

        {/* Priority Legend */}
        <GlassCard style={{ marginTop: 20, padding: 16 }}>
          <ThemedText weight="bold" style={{ fontSize: 14, color: colors.TEXT_PRIMARY, marginBottom: 12 }}>
            Priority Levels
          </ThemedText>
          <View style={{ gap: 8 }}>
            {Object.entries(PRIORITY_LABELS).map(([key, label]) => (
              <View key={key} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: PRIORITY_COLORS[key] }} />
                <ThemedText style={{ fontSize: 12, color: colors.TEXT_SECONDARY, flex: 1 }}>
                  {label}
                </ThemedText>
                <ThemedText style={{ fontSize: 11, color: colors.TEXT_SECONDARY }}>
                  {key === 'critical' && 'Always notify, even in DND'}
                  {key === 'high' && 'Notify with sound'}
                  {key === 'medium' && 'Standard notification'}
                  {key === 'low' && 'Silent notification'}
                  {key === 'off' && 'Completely disabled'}
                </ThemedText>
              </View>
            ))}
          </View>
        </GlassCard>

      </ScrollView>
    </ThemedView>
  );
}