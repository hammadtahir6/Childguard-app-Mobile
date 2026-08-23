import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '../../store/themeStore';
import { ALERTS } from '../../constants/DummyData';

const getIcon = (type: string) => {
  const map: Record<string, string> = {
    FALL_DETECTED: 'alert-circle', SOS_PRESSED: 'warning', TAMPER_DETECTED: 'construct',
    HIGH_HEART_RATE: 'heart', LEFT_SAFE_ZONE: 'location', BATTERY_LOW: 'battery-half'
  };
  return map[type] || 'notifications';
};

const getSeverityColor = (severity: string) => {
  if (severity === 'EMERGENCY') return '#EF4444';
  if (severity === 'WARNING') return '#F59E0B';
  return '#10B981';
};

export default function AlertsScreen() {
  const router = useRouter();
  const { colors } = useThemeStore();
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredAlerts = ALERTS.filter(alert => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Emergency') return alert.severity === 'EMERGENCY' && !alert.resolved;
    if (activeFilter === 'Warning') return alert.severity === 'WARNING' && !alert.resolved;
    if (activeFilter === 'Resolved') return alert.resolved;
    return true;
  });

  const counts = {
    All: ALERTS.length,
    Emergency: ALERTS.filter(a => a.severity === 'EMERGENCY' && !a.resolved).length,
    Warning: ALERTS.filter(a => a.severity === 'WARNING' && !a.resolved).length,
    Resolved: ALERTS.filter(a => a.resolved).length,
  };

  const filters = ['All', 'Emergency', 'Warning', 'Resolved'];

  const renderItem = ({ item, index }: any) => {
    const isEmergency = item.severity === 'EMERGENCY' && !item.resolved;
    const barColor = getSeverityColor(item.severity);
    
    return (
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ delay: index * 100, type: 'spring' }}
      >
        <TouchableOpacity 
          activeOpacity={0.8}
          onPress={() => router.push({ pathname: '/alert-detail', params: { id: item.id } })}
          style={[styles.card, { backgroundColor: colors.BG_SECONDARY, borderLeftColor: barColor }]}
        >
          {isEmergency && <MotiView from={{ opacity: 0.3 }} animate={{ opacity: 0.8 }} transition={{ duration: 800, loop: true }} style={styles.glow} />}
          
          <View style={styles.cardContent}>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={[styles.iconCircle, { backgroundColor: barColor + '20' }]}>
                <Ionicons name={getIcon(item.type) as any} size={22} color={barColor} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Text style={[styles.title, { color: colors.TEXT_PRIMARY }]}>{item.title}</Text>
                  <Text style={[styles.time, { color: colors.TEXT_SECONDARY }]}>
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
                <View style={[styles.pill, { backgroundColor: colors.BG_TERTIARY }]}>
                  <Text style={[styles.pillText, { color: colors.TEXT_SECONDARY }]}>Sara Ahmed</Text>
                </View>
                <Text style={[styles.desc, { color: colors.TEXT_SECONDARY }]} numberOfLines={2}>{item.description}</Text>
                
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Ionicons name="location" size={12} color={colors.TEXT_SECONDARY} />
                    <Text style={{ fontSize: 12, color: colors.TEXT_SECONDARY }}>{item.location.address}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: item.resolved ? '#10B981' : '#EF4444' }]}>
                    <Text style={styles.statusText}>{item.resolved ? 'RESOLVED ✓' : 'ACTIVE !'}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </MotiView>
    );
  };

  if (filteredAlerts.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.BG_PRIMARY }]}>
        <View style={{ alignItems: 'center', marginTop: 100 }}>
          <Ionicons name="shield-checkmark" size={80} color={colors.TEXT_SECONDARY} />
          <Text style={[styles.emptyTitle, { color: colors.TEXT_PRIMARY }]}>No alerts here</Text>
          <Text style={[styles.emptySub, { color: colors.TEXT_SECONDARY }]}>All clear in this category 🎉</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.BG_PRIMARY }]}>
      <View style={{ padding: 20, paddingBottom: 0 }}>
        <Text style={[styles.headerTitle, { color: colors.TEXT_PRIMARY }]}>Alerts</Text>
        <Text style={{ fontSize: 13, color: '#EF4444', fontWeight: '600', marginTop: 4 }}>
          {counts.Emergency + counts.Warning} unresolved alerts
        </Text>

        <FlatList
          horizontal
          data={filters}
          keyExtractor={item => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ marginTop: 20, gap: 10 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setActiveFilter(item)}
              style={[
                styles.filterPill,
                { backgroundColor: activeFilter === item ? '#00D4AA' : colors.BG_TERTIARY }
              ]}
            >
              <Text style={{ color: activeFilter === item ? '#FFF' : colors.TEXT_SECONDARY, fontSize: 13, fontWeight: '700' }}>
                {item} {counts[item as keyof typeof counts]}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <FlatList
        data={filteredAlerts}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerTitle: { fontSize: 24, fontWeight: 'bold' },
  filterPill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  card: { borderRadius: 16, marginBottom: 12, overflow: 'hidden', borderLeftWidth: 4 },
  glow: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, backgroundColor: '#EF4444' },
  cardContent: { padding: 16 },
  iconCircle: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 15, fontWeight: 'bold', flex: 1 },
  time: { fontSize: 12 },
  pill: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, alignSelf: 'flex-start', marginTop: 4, marginBottom: 6 },
  pillText: { fontSize: 11, fontWeight: '600' },
  desc: { fontSize: 13, lineHeight: 18 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusText: { fontSize: 10, fontWeight: 'bold', color: '#FFF' },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', marginTop: 16 },
  emptySub: { fontSize: 14, marginTop: 8 },
});