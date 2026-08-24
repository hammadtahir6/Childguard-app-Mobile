import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Alert, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '../../store/themeStore';
import { useAlertsStore } from '../../store/alertsStore';
import { ThemedText } from '../../components/ui/ThemedText';

export default function AlertsScreen() {
  const router = useRouter();
  const { colors } = useThemeStore();
  const { alerts, markAllRead, deleteSelected } = useAlertsStore();
  
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState('All');

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const selectAll = () => {
    if (selectedIds.length === filteredAlerts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredAlerts.map(a => a.id));
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Alerts',
      `Are you sure you want to delete ${selectedIds.length} alert(s)?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            deleteSelected(selectedIds);
            setSelectedIds([]);
            setIsSelectMode(false);
          }
        }
      ]
    );
  };

  const filteredAlerts = alerts.filter(alert => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Emergency') return alert.severity === 'EMERGENCY';
    if (activeFilter === 'Warning') return alert.severity === 'WARNING';
    if (activeFilter === 'Active') return !alert.resolved;
    if (activeFilter === 'Resolved') return alert.resolved;
    return true;
  });

  const filters = ['All', 'Emergency', 'Warning', 'Active', 'Resolved'];

  const getIcon = (type: string) => {
    const map: Record<string, string> = { FALL_DETECTED: 'alert-circle', LEFT_SAFE_ZONE: 'location', BATTERY_LOW: 'battery-half' };
    return map[type] || 'notifications';
  };

  const getSeverityColor = (severity: string) => {
    if (severity === 'EMERGENCY') return colors.DANGER;
    if (severity === 'WARNING') return colors.WARNING;
    return colors.ACCENT_TEAL;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.BG_PRIMARY }} edges={['top', 'bottom']}>
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ padding: 20, paddingBottom: isSelectMode ? 120 : 40, flexGrow: 1 }}
      >
        
        {/* Header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <ThemedText weight="bold" style={{ fontSize: 28, color: colors.TEXT_PRIMARY }}>Alerts</ThemedText>
          
          <View style={{ flexDirection: 'row', gap: 12 }}>
            {isSelectMode ? (
              <>
                <TouchableOpacity onPress={selectAll} style={{ padding: 8 }}>
                  <ThemedText style={{ fontSize: 14, color: colors.ACCENT_TEAL, fontWeight: '600' }}>
                    {selectedIds.length === filteredAlerts.length ? 'Deselect All' : 'Select All'}
                  </ThemedText>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setIsSelectMode(false); setSelectedIds([]); }} style={{ padding: 8 }}>
                  <ThemedText style={{ fontSize: 14, color: colors.TEXT_SECONDARY, fontWeight: '600' }}>Cancel</ThemedText>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity onPress={() => { markAllRead(); }} style={{ padding: 8 }}>
                <ThemedText style={{ fontSize: 14, color: colors.ACCENT_TEAL, fontWeight: '600' }}>Mark All Read</ThemedText>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Filter Pills - FIXED WITH PROPER HEIGHT */}
        {!isSelectMode && (
          <View style={{ height: 45, marginBottom: 20 }}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              contentContainerStyle={{ gap: 10, paddingRight: 20 }}
            >
              {filters.map((filter) => (
                <TouchableOpacity
                  key={filter}
                  onPress={() => setActiveFilter(filter)}
                  style={{
                    height: 45,
                    paddingHorizontal: 24,
                    borderRadius: 25,
                    borderWidth: 1,
                    backgroundColor: activeFilter === filter ? colors.ACCENT_TEAL : colors.BG_TERTIARY,
                    borderColor: activeFilter === filter ? colors.ACCENT_TEAL : colors.BORDER,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ 
                    color: activeFilter === filter ? '#FFFFFF' : colors.TEXT_SECONDARY, 
                    fontSize: 14, 
                    fontWeight: '600' 
                  }}>
                    {filter}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Alerts List */}
        {filteredAlerts.length === 0 ? (
          <View style={{ alignItems: 'center', marginTop: 60 }}>
            <Ionicons name="checkmark-circle-outline" size={64} color={colors.SUCCESS} />
            <ThemedText weight="bold" style={{ fontSize: 18, color: colors.TEXT_PRIMARY, marginTop: 16 }}>All Clear!</ThemedText>
          </View>
        ) : (
          filteredAlerts.map((alert, index) => {
            const isSelected = selectedIds.includes(alert.id);
            return (
              <MotiView key={alert.id} from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: index * 50 }}>
                <TouchableOpacity 
                  activeOpacity={0.8}
                  onPress={() => isSelectMode ? toggleSelect(alert.id) : router.push({ pathname: '/alert-detail', params: { id: alert.id } })}
                  onLongPress={() => { if (!isSelectMode) { setIsSelectMode(true); toggleSelect(alert.id); } }}
                  style={[styles.card, { backgroundColor: colors.BG_SECONDARY, borderLeftColor: getSeverityColor(alert.severity), opacity: alert.read && !isSelectMode ? 0.6 : 1 }]}
                >
                  {isSelectMode && (
                    <View style={{ width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: isSelected ? colors.ACCENT_TEAL : colors.BORDER, backgroundColor: isSelected ? colors.ACCENT_TEAL : 'transparent', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                      {isSelected && <Ionicons name="checkmark" size={16} color="#FFF" />}
                    </View>
                  )}

                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', gap: 12 }}>
                      <View style={[styles.iconCircle, { backgroundColor: getSeverityColor(alert.severity) + '20' }]}>
                        <Ionicons name={getIcon(alert.type) as any} size={22} color={getSeverityColor(alert.severity)} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                          <ThemedText weight="bold" style={{ fontSize: 15, color: colors.TEXT_PRIMARY }}>{alert.title}</ThemedText>
                          <ThemedText style={{ fontSize: 11, color: colors.TEXT_SECONDARY }}>{new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</ThemedText>
                        </View>
                        <ThemedText style={{ fontSize: 13, color: colors.TEXT_SECONDARY, marginVertical: 6 }} numberOfLines={2}>{alert.description}</ThemedText>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                          <ThemedText style={{ fontSize: 12, color: colors.TEXT_SECONDARY }}>{alert.location.address}</ThemedText>
                          <View style={[styles.statusBadge, { backgroundColor: alert.resolved ? colors.SUCCESS + '20' : colors.DANGER + '20' }]}>
                            <ThemedText style={{ fontSize: 10, fontWeight: 'bold', color: alert.resolved ? colors.SUCCESS : colors.DANGER }}>{alert.resolved ? 'RESOLVED' : 'ACTIVE'}</ThemedText>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              </MotiView>
            );
          })
        )}
      </ScrollView>

      {/* Delete Button */}
      {isSelectMode && selectedIds.length > 0 && (
        <View style={styles.deleteButtonContainer}>
          <TouchableOpacity 
            onPress={handleDelete}
            activeOpacity={0.8}
            style={styles.deleteButton}
          >
            <Ionicons name="trash" size={22} color="#FFF" />
            <ThemedText weight="bold" style={{ color: '#FFF', fontSize: 16 }}>
              Delete Selected ({selectedIds.length})
            </ThemedText>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 16, marginBottom: 12, padding: 16, borderLeftWidth: 4, flexDirection: 'row', alignItems: 'center' },
  iconCircle: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  deleteButtonContainer: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    zIndex: 9999,
  },
  deleteButton: {
    backgroundColor: '#EF4444',
    paddingVertical: 18,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 15,
  },
});