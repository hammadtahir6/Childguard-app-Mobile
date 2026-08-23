import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '../components/ui/ThemedText';
import { ThemedView } from '../components/ui/ThemedView';
import { GlassCard } from '../components/ui/GlassCard';
import { useThemeStore } from '../store/themeStore';
import { ALERTS } from '../constants/DummyData';
import { Ionicons } from '@expo/vector-icons';

export default function NotificationsScreen() {
  const router = useRouter();
  const { colors } = useThemeStore();
  const [notifications, setNotifications] = useState(
    ALERTS.map(a => ({ ...a, read: false }))
  );

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  // Group by day
  const groupedByDay = notifications.reduce((acc, notif) => {
    const date = new Date(notif.timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let dayLabel = date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
    if (date.toDateString() === today.toDateString()) dayLabel = 'Today';
    else if (date.toDateString() === yesterday.toDateString()) dayLabel = 'Yesterday';

    if (!acc[dayLabel]) acc[dayLabel] = [];
    acc[dayLabel].push(notif);
    return acc;
  }, {} as Record<string, typeof notifications>);

  const getIcon = (type: string) => {
    if (type === 'FALL_DETECTED') return 'alert-circle';
    if (type === 'SOS_PRESSED') return 'warning';
    if (type === 'TAMPER_DETECTED') return 'construct';
    if (type === 'HIGH_HEART_RATE') return 'heart';
    if (type === 'LEFT_SAFE_ZONE') return 'location';
    return 'notifications';
  };

  const getSeverityColor = (severity: string) => {
    if (severity === 'EMERGENCY') return colors.DANGER;
    if (severity === 'WARNING') return colors.WARNING;
    return colors.SUCCESS;
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <ThemedView style={{ flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <TouchableOpacity onPress={() => router.back()} style={{ padding: 8 }}>
              <Ionicons name="arrow-back" size={24} color={colors.TEXT_PRIMARY} />
            </TouchableOpacity>
            <ThemedText weight="bold" style={{ fontSize: 24, color: colors.TEXT_PRIMARY }}>
              Notifications
            </ThemedText>
          </View>
          {unreadCount > 0 && (
            <TouchableOpacity onPress={markAllRead} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Ionicons name="checkmark-done" size={18} color={colors.ACCENT_TEAL} />
              <ThemedText style={{ fontSize: 14, color: colors.ACCENT_TEAL, fontWeight: '600' }}>
                Mark all read
              </ThemedText>
            </TouchableOpacity>
          )}
        </View>

        {/* Unread Badge */}
        {unreadCount > 0 && (
          <GlassCard style={{ padding: 12, marginBottom: 16, backgroundColor: colors.ACCENT_TEAL + '15', borderColor: colors.ACCENT_TEAL }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Ionicons name="information-circle" size={20} color={colors.ACCENT_TEAL} />
              <ThemedText style={{ fontSize: 14, color: colors.ACCENT_TEAL, fontWeight: '600' }}>
                {unreadCount} unread notification{unreadCount > 1 ? 's' : ''}
              </ThemedText>
            </View>
          </GlassCard>
        )}

        {/* Grouped Notifications */}
        {Object.entries(groupedByDay).map(([day, items]) => (
          <View key={day} style={{ marginBottom: 24 }}>
            <ThemedText weight="semibold" style={{ fontSize: 13, color: colors.TEXT_SECONDARY, marginBottom: 12, letterSpacing: 1 }}>
              {day.toUpperCase()}
            </ThemedText>
            {items.map((notif) => (
              <TouchableOpacity 
                key={notif.id} 
                activeOpacity={0.8}
                onPress={() => {
                  markAsRead(notif.id);
                  router.push({ pathname: '/alert-detail', params: { id: notif.id } });
                }}
              >
                <GlassCard 
                  style={{ 
                    borderLeftWidth: 4, 
                    borderLeftColor: getSeverityColor(notif.severity), 
                    marginBottom: 10, 
                    padding: 14,
                    opacity: notif.read ? 0.6 : 1
                  }}
                >
                  <View style={{ flexDirection: 'row', gap: 12 }}>
                    <View style={{ 
                      width: 40, 
                      height: 40, 
                      borderRadius: 20, 
                      justifyContent: 'center', 
                      alignItems: 'center', 
                      backgroundColor: getSeverityColor(notif.severity) + '15' 
                    }}>
                      <Ionicons name={getIcon(notif.type) as any} size={20} color={getSeverityColor(notif.severity)} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <ThemedText weight="bold" style={{ fontSize: 14, color: colors.TEXT_PRIMARY, flex: 1 }}>
                          {notif.title}
                        </ThemedText>
                        {!notif.read && <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.ACCENT_TEAL, marginLeft: 8 }} />}
                      </View>
                      <ThemedText style={{ fontSize: 12, color: colors.TEXT_SECONDARY, marginVertical: 4 }}>
                        {notif.description}
                      </ThemedText>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <ThemedText style={{ fontSize: 11, color: colors.TEXT_SECONDARY }}>
                          {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </ThemedText>
                        <View style={{ 
                          paddingHorizontal: 6, 
                          paddingVertical: 2, 
                          borderRadius: 4, 
                          backgroundColor: notif.resolved ? colors.SUCCESS + '20' : colors.DANGER + '20' 
                        }}>
                          <ThemedText style={{ fontSize: 9, fontWeight: 'bold', color: notif.resolved ? colors.SUCCESS : colors.DANGER }}>
                            {notif.resolved ? 'RESOLVED' : 'ACTIVE'}
                          </ThemedText>
                        </View>
                      </View>
                    </View>
                  </View>
                </GlassCard>
              </TouchableOpacity>
            ))}
          </View>
        ))}

      </ScrollView>
    </ThemedView>
  );
}