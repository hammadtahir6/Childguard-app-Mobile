import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '../components/ui/ThemedText';
import { ThemedView } from '../components/ui/ThemedView';
import { GlassCard } from '../components/ui/GlassCard';
import { useThemeStore } from '../store/themeStore';
import { useToastStore } from '../store/toastStore';
import { Ionicons } from '@expo/vector-icons';

// Mock Data grouped by date
const MOCK_NOTIFICATIONS = [
  { id: '1', date: 'TODAY', type: 'emergency', title: 'Fall Detected — Sara Ahmed', desc: 'Sara may have fallen in the park...', time: '3:45 PM', read: false },
  { id: '2', date: 'TODAY', type: 'system', title: 'Band Battery Low', desc: 'Ali\'s band is at 15% battery.', time: '10:20 AM', read: true },
  { id: '3', date: 'YESTERDAY', type: 'safe', title: 'Arrived at School', desc: 'Sara entered the School Safe Zone.', time: '8:05 AM', read: true },
  { id: '4', date: 'AUG 20, 2026', type: 'warning', title: 'Left Safe Zone', desc: 'Ali left the Home zone unexpectedly.', time: '4:30 PM', read: true },
];

const getIcon = (type: string) => {
  if (type === 'emergency') return { name: 'alert-circle', color: '#EF4444' };
  if (type === 'warning') return { name: 'warning', color: '#F59E0B' };
  if (type === 'safe') return { name: 'shield-checkmark', color: '#10B981' };
  return { name: 'settings', color: '#9CA3AF' };
};

export default function NotificationsScreen() {
  const router = useRouter();
  const { colors } = useThemeStore();
  const { showToast } = useToastStore();
  const [activeFilter, setActiveFilter] = useState('All');
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    showToast('All notifications marked as read', 'success');
  };

  const filters = ['All', 'Alerts', 'System', 'Updates'];

  // Group data by date headers
  const groupedData = notifications.reduce((acc, item) => {
    if (!acc[item.date]) acc[item.date] = [];
    acc[item.date].push(item);
    return acc;
  }, {} as Record<string, typeof notifications>);

  return (
    <ThemedView style={{ flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
        
        {/* Header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <TouchableOpacity onPress={() => router.back()} style={{ padding: 8 }}>
              <Ionicons name="arrow-back" size={24} color={colors.TEXT_PRIMARY} />
            </TouchableOpacity>
            <ThemedText weight="bold" style={{ fontSize: 22, color: colors.TEXT_PRIMARY }}>Notifications</ThemedText>
          </View>
          <TouchableOpacity onPress={markAllRead}>
            <ThemedText style={{ fontSize: 14, color: colors.ACCENT_TEAL, fontWeight: '600' }}>Mark All Read</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Filter Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, marginBottom: 24 }}>
          {filters.map(filter => (
            <TouchableOpacity 
              key={filter} 
              onPress={() => setActiveFilter(filter)}
              style={[
                styles.filterPill, 
                { backgroundColor: activeFilter === filter ? colors.ACCENT_TEAL : colors.BG_TERTIARY }
              ]}
            >
              <ThemedText style={{ color: activeFilter === filter ? '#FFF' : colors.TEXT_SECONDARY, fontSize: 13, fontWeight: '600' }}>
                {filter}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Notifications List */}
        {Object.entries(groupedData).map(([date, items]) => (
          <View key={date} style={{ marginBottom: 24 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
              <View style={{ flex: 1, height: 1, backgroundColor: colors.BORDER }} />
              <ThemedText style={{ marginHorizontal: 12, fontSize: 12, fontWeight: 'bold', color: colors.TEXT_SECONDARY, letterSpacing: 1 }}>
                {date}
              </ThemedText>
              <View style={{ flex: 1, height: 1, backgroundColor: colors.BORDER }} />
            </View>

            {items.map(item => {
              const iconData = getIcon(item.type);
              return (
                <TouchableOpacity 
                  key={item.id} 
                  activeOpacity={0.7}
                  style={[
                    styles.notifRow, 
                    { backgroundColor: item.read ? colors.BG_SECONDARY : colors.BG_TERTIARY }
                  ]}
                >
                  {/* Unread Indicator */}
                  {!item.read && <View style={styles.unreadDot} />}
                  
                  <View style={[styles.iconBox, { backgroundColor: iconData.color + '20' }]}>
                    <Ionicons name={iconData.name as any} size={20} color={iconData.color} />
                  </View>
                  
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <ThemedText weight="semibold" style={{ fontSize: 14, color: colors.TEXT_PRIMARY, flex: 1 }}>
                        {item.title}
                      </ThemedText>
                      <ThemedText style={{ fontSize: 11, color: colors.TEXT_SECONDARY, marginLeft: 8 }}>{item.time}</ThemedText>
                    </View>
                    <ThemedText style={{ fontSize: 13, color: colors.TEXT_SECONDARY, marginTop: 4, lineHeight: 18 }} numberOfLines={2}>
                      {item.desc}
                    </ThemedText>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}

        {/* Empty State */}
        {notifications.length === 0 && (
          <View style={{ alignItems: 'center', marginTop: 60 }}>
            <Ionicons name="notifications-outline" size={70} color={colors.TEXT_SECONDARY} />
            <ThemedText weight="bold" style={{ fontSize: 18, color: colors.TEXT_PRIMARY, marginTop: 16 }}>You're all caught up!</ThemedText>
            <ThemedText style={{ fontSize: 14, color: colors.TEXT_SECONDARY, marginTop: 8 }}>No new notifications</ThemedText>
          </View>
        )}

      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  filterPill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  notifRow: { flexDirection: 'row', padding: 16, borderRadius: 16, marginBottom: 10, position: 'relative' },
  unreadDot: { position: 'absolute', left: 6, top: 20, width: 6, height: 6, borderRadius: 3, backgroundColor: '#00D4AA' },
  iconBox: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
});