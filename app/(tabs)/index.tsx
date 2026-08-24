import React, { useEffect, useState } from 'react';
import { 
  ScrollView, 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  Pressable, 
  Alert, 
  Dimensions,
  RefreshControl 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker } from 'react-native-maps';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '../../store/themeStore';
import { useChildrenStore } from '../../store/childrenStore';
import { useToastStore } from '../../store/toastStore'; // ✅ ADDED THIS IMPORT
import { ThemedText } from '../../components/ui/ThemedText';
import { GlassCard } from '../../components/ui/GlassCard';
import OfflineBanner from '../../components/OfflineBanner';
import LastSynced from '../../components/LastSynced';

const { width } = Dimensions.get('window');

// Helper: Convert seconds to readable time
const formatTimeAgo = (seconds: number): string => {
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  return `${Math.floor(seconds / 3600)}h ago`;
};

export default function HomeDashboard() {
  const router = useRouter();
  const { colors, toggleTheme, mode } = useThemeStore();
  const { activeChildId, setActiveChild, children, updateVitals, deleteChild } = useChildrenStore();
  const { showToast } = useToastStore(); // ✅ ADDED THIS HOOK
  
  const activeChild = children.length > 0 
    ? (children.find(c => c.id === activeChildId) || children[0])
    : null;
  
  const [secondsAgo, setSecondsAgo] = useState(2);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTimeout(() => {
      setSecondsAgo(0);
      setRefreshing(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 1500);
  };

  useEffect(() => {
    if (!activeChild) return;
    const interval = setInterval(() => {
      setSecondsAgo(prev => prev + 5);
      updateVitals(activeChildId, {
        heartRate: activeChild.vitals.heartRate + Math.floor(Math.random() * 7) - 3,
        spo2: Math.min(100, Math.max(95, activeChild.vitals.spo2 + Math.floor(Math.random() * 3) - 1)),
        temperature: parseFloat((activeChild.vitals.temperature + (Math.random() * 0.2 - 0.1)).toFixed(1)),
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [activeChildId, activeChild?.vitals]);

  const handleDeleteChild = (id: string, name: string) => {
    Alert.alert(
      "Remove Child",
      `Are you sure you want to remove ${name} and unpair their band?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Remove", 
          style: "destructive",
          onPress: () => {
            deleteChild(id);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }
        }
      ]
    );
  };

  // Empty state
  if (!activeChild || children.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.BG_PRIMARY }} edges={['top', 'bottom']}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Ionicons name="people-outline" size={80} color={colors.TEXT_SECONDARY} />
          <ThemedText weight="bold" style={{ fontSize: 20, color: colors.TEXT_PRIMARY, marginTop: 20, marginBottom: 8 }}>
            No Children Added
          </ThemedText>
          <ThemedText style={{ fontSize: 14, color: colors.TEXT_SECONDARY, textAlign: 'center', marginBottom: 24 }}>
            Add your first child to start monitoring
          </ThemedText>
          <TouchableOpacity 
            onPress={() => router.push('/add-child')}
            style={{ backgroundColor: colors.ACCENT_TEAL, paddingVertical: 14, paddingHorizontal: 32, borderRadius: 14 }}
          >
            <ThemedText weight="bold" style={{ color: '#FFF', fontSize: 16 }}>Add Child</ThemedText>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const vitalsData = [
    { label: 'Heart Rate', value: activeChild.vitals.heartRate, unit: 'BPM', icon: 'heart', color: colors.DANGER },
    { label: 'Blood Oxygen', value: activeChild.vitals.spo2, unit: '%', icon: 'pulse', color: '#3B82F6' },
    { label: 'Temperature', value: activeChild.vitals.temperature, unit: '°C', icon: 'thermometer', color: colors.WARNING },
    { label: 'Location', value: activeChild.location.inSafeZone ? 'In Zone' : 'Outside', unit: '', icon: 'location', color: colors.ACCENT_TEAL }
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.BG_PRIMARY }} edges={['top', 'bottom']}>
      <OfflineBanner />
      
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ padding: 20, paddingBottom: 40, flexGrow: 1 }}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            tintColor={colors.ACCENT_TEAL} 
            colors={[colors.ACCENT_TEAL]} 
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <ThemedText style={{ color: colors.TEXT_SECONDARY, fontSize: 13 }}>Good Morning,</ThemedText>
            <ThemedText weight="bold" style={{ fontSize: 24, color: colors.TEXT_PRIMARY }}>Ahmed Khan</ThemedText>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <TouchableOpacity onPress={toggleTheme} style={{ padding: 8 }}>
              <Ionicons name={mode === 'dark' ? 'sunny-outline' : 'moon-outline'} size={24} color={colors.TEXT_PRIMARY} />
            </TouchableOpacity>
            <TouchableOpacity style={{ position: 'relative', padding: 8 }} onPress={() => router.push('/(tabs)/alerts')}>
              <Ionicons name="notifications-outline" size={24} color={colors.TEXT_PRIMARY} />
              <View style={[styles.badge, { backgroundColor: colors.DANGER, borderColor: colors.BG_PRIMARY }]} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Child Selector */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={{ paddingRight: 20 }}
          style={{ marginVertical: 20 }}
        >
          {children.map((child) => (
            <View key={child.id} style={{ position: 'relative', marginRight: 12 }}>
              <Pressable 
                onPress={() => setActiveChild(child.id)} 
                style={[
                  styles.childCard, 
                  { 
                    backgroundColor: colors.BG_SECONDARY, 
                    borderColor: activeChildId === child.id ? colors.ACCENT_TEAL : colors.BORDER, 
                    borderWidth: activeChildId === child.id ? 2 : 1 
                  }
                ]}
              >
                <View style={[styles.avatarRing, { borderColor: child.status === 'SAFE' ? colors.SUCCESS : colors.WARNING, backgroundColor: colors.BG_TERTIARY }]}>
                  <ThemedText style={{ fontSize: 20, fontWeight: 'bold', color: colors.TEXT_PRIMARY }}>{child.name.charAt(0)}</ThemedText>
                </View>
                <ThemedText weight="semibold" style={{ fontSize: 14, marginTop: 8, textAlign: 'center', color: colors.TEXT_PRIMARY }}>{child.name.split(' ')[0]}</ThemedText>
                <View style={[styles.statusPill, { backgroundColor: child.status === 'SAFE' ? colors.SUCCESS + '20' : colors.WARNING + '20' }]}>
                  <ThemedText style={{ fontSize: 10, color: child.status === 'SAFE' ? colors.SUCCESS : colors.WARNING, fontWeight: '700' }}>{child.status}</ThemedText>
                </View>
              </Pressable>
              
              <TouchableOpacity 
                onPress={() => handleDeleteChild(child.id, child.name)}
                style={{ position: 'absolute', top: 8, right: 8, backgroundColor: colors.DANGER + '20', padding: 4, borderRadius: 12, zIndex: 10 }}
              >
                <Ionicons name="close" size={14} color={colors.DANGER} />
              </TouchableOpacity>
            </View>
          ))}
          
          <TouchableOpacity 
            onPress={() => router.push('/add-child')}
            style={[styles.childCard, { backgroundColor: colors.BG_SECONDARY, borderStyle: 'dashed', borderWidth: 2, borderColor: colors.BORDER, justifyContent: 'center', alignItems: 'center' }]}
          >
            <Ionicons name="add" size={24} color={colors.ACCENT_TEAL} />
            <ThemedText style={{ fontSize: 12, color: colors.ACCENT_TEAL, marginTop: 4, fontWeight: '600' }}>Add Child</ThemedText>
          </TouchableOpacity>
        </ScrollView>

        {/* Status Hero Card - Shadow now contained */}
        <View style={{ overflow: 'hidden', borderRadius: 20, marginBottom: 20 }}>
          <GlassCard glowColor={activeChild.status === 'SAFE' ? colors.ACCENT_TEAL : colors.DANGER} style={{ padding: 20 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={[styles.heroAvatar, { borderColor: activeChild.status === 'SAFE' ? colors.SUCCESS : colors.DANGER, backgroundColor: colors.BG_TERTIARY, marginRight: 16 }]}>
                <ThemedText style={{ fontSize: 28, fontWeight: 'bold', color: colors.TEXT_PRIMARY }}>{activeChild.name.charAt(0)}</ThemedText>
              </View>
              <View style={{ flex: 1 }}>
                <ThemedText weight="bold" style={{ fontSize: 20, color: colors.TEXT_PRIMARY }}>{activeChild.name}</ThemedText>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 4, flexWrap: 'wrap' }}>
                  <ThemedText style={{ fontSize: 12, color: colors.TEXT_SECONDARY }}>
                    Updated: {formatTimeAgo(secondsAgo)}
                  </ThemedText>
                  <LastSynced lastSynced={new Date(Date.now() - 300000)} />
                </View>
              </View>
              {/* Band Details Button */}
              <TouchableOpacity 
                onPress={() => router.push('/band-details')}
                style={{ padding: 8, backgroundColor: colors.BG_TERTIARY, borderRadius: 12 }}
              >
                <Ionicons name="watch-outline" size={20} color={colors.ACCENT_TEAL} />
              </TouchableOpacity>
            </View>
            
            <View style={{ marginTop: 20 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                <ThemedText style={{ fontSize: 12, color: colors.TEXT_SECONDARY }}>Band Battery</ThemedText>
                <ThemedText style={{ fontSize: 12, color: colors.ACCENT_TEAL, fontWeight: '600' }}>{activeChild.band.battery}%</ThemedText>
              </View>
              <View style={{ height: 8, backgroundColor: colors.BG_TERTIARY, borderRadius: 4, overflow: 'hidden', marginBottom: 12 }}>
                <View style={{ width: `${activeChild.band.battery}%`, height: '100%', backgroundColor: colors.ACCENT_TEAL }} />
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.SUCCESS }} />
                <ThemedText style={{ fontSize: 12, color: colors.SUCCESS, fontWeight: '600' }}>Connected</ThemedText>
              </View>
            </View>
          </GlassCard>
        </View>

        {/* Vitals Row */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 20 }}>
          {vitalsData.map((vital) => (
            <View key={vital.label} style={{ width: '48%', marginBottom: 12 }}>
              <GlassCard style={{ padding: 16 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <Ionicons name={vital.icon as any} size={18} color={vital.color} />
                  <ThemedText style={{ fontSize: 12, color: colors.TEXT_SECONDARY, fontWeight: '500' }}>{vital.label}</ThemedText>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4 }}>
                  <ThemedText font="mono" weight="bold" style={{ fontSize: 28, color: colors.TEXT_PRIMARY }}>{vital.value}</ThemedText>
                  <ThemedText style={{ fontSize: 14, color: colors.TEXT_SECONDARY }}>{vital.unit}</ThemedText>
                </View>
              </GlassCard>
            </View>
          ))}
        </View>

        {/* Map Preview */}
        <GlassCard style={{ marginBottom: 20, height: 200, padding: 0, overflow: 'hidden' }}>
          <MapView 
            style={{ width: '100%', height: '100%' }}
            initialRegion={{
              latitude: activeChild.location.lat,
              longitude: activeChild.location.lng,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }}
            scrollEnabled={false}
            zoomEnabled={false}
          >
            <Marker coordinate={{ latitude: activeChild.location.lat, longitude: activeChild.location.lng }}>
              <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.ACCENT_TEAL, borderWidth: 3, borderColor: '#FFF', justifyContent: 'center', alignItems: 'center' }}>
                <ThemedText style={{ fontSize: 18, fontWeight: 'bold', color: '#FFF' }}>{activeChild.name.charAt(0)}</ThemedText>
              </View>
            </Marker>
          </MapView>
          
          <TouchableOpacity 
            onPress={() => router.push('/(tabs)/map')}
            style={{ position: 'absolute', top: 12, right: 12, backgroundColor: colors.BG_SECONDARY, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: colors.BORDER }}
          >
            <ThemedText style={{ fontSize: 12, color: colors.ACCENT_TEAL, fontWeight: '600' }}>Expand Map</ThemedText>
          </TouchableOpacity>
        </GlassCard>

        {/* Daily Summary Section */}
        <ThemedText weight="bold" style={{ fontSize: 16, color: colors.TEXT_PRIMARY, marginBottom: 12 }}>Today's Summary</ThemedText>
        <GlassCard style={{ padding: 16, marginBottom: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            <View style={{ alignItems: 'center' }}>
              <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: colors.SUCCESS + '20', justifyContent: 'center', alignItems: 'center', marginBottom: 8 }}>
                <Ionicons name="shield-checkmark" size={24} color={colors.SUCCESS} />
              </View>
              <ThemedText weight="bold" style={{ fontSize: 18, color: colors.TEXT_PRIMARY }}>100%</ThemedText>
              <ThemedText style={{ fontSize: 11, color: colors.TEXT_SECONDARY }}>Safe Time</ThemedText>
            </View>
            <View style={{ alignItems: 'center' }}>
              <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: colors.WARNING + '20', justifyContent: 'center', alignItems: 'center', marginBottom: 8 }}>
                <Ionicons name="footsteps" size={24} color={colors.WARNING} />
              </View>
              <ThemedText weight="bold" style={{ fontSize: 18, color: colors.TEXT_PRIMARY }}>4,280</ThemedText>
              <ThemedText style={{ fontSize: 11, color: colors.TEXT_SECONDARY }}>Steps</ThemedText>
            </View>
            <View style={{ alignItems: 'center' }}>
              <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#3B82F6' + '20', justifyContent: 'center', alignItems: 'center', marginBottom: 8 }}>
                <Ionicons name="school" size={24} color="#3B82F6" />
              </View>
              <ThemedText weight="bold" style={{ fontSize: 18, color: colors.TEXT_PRIMARY }}>6h</ThemedText>
              <ThemedText style={{ fontSize: 11, color: colors.TEXT_SECONDARY }}>At School</ThemedText>
            </View>
          </View>
        </GlassCard>

        {/* Recent Activity Timeline */}
        <ThemedText weight="bold" style={{ fontSize: 16, color: colors.TEXT_PRIMARY, marginBottom: 12 }}>Recent Activity</ThemedText>
        <GlassCard style={{ padding: 16, marginBottom: 20 }}>
          <View style={{ gap: 14 }}>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: colors.SUCCESS + '20', justifyContent: 'center', alignItems: 'center' }}>
                <Ionicons name="checkmark-circle" size={18} color={colors.SUCCESS} />
              </View>
              <View style={{ flex: 1 }}>
                <ThemedText style={{ fontSize: 13, color: colors.TEXT_PRIMARY, fontWeight: '500' }}>Arrived at School</ThemedText>
                <ThemedText style={{ fontSize: 11, color: colors.TEXT_SECONDARY }}>8:05 AM • Beacon House</ThemedText>
              </View>
            </View>
            
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: colors.ACCENT_TEAL + '20', justifyContent: 'center', alignItems: 'center' }}>
                <Ionicons name="walk" size={18} color={colors.ACCENT_TEAL} />
              </View>
              <View style={{ flex: 1 }}>
                <ThemedText style={{ fontSize: 13, color: colors.TEXT_PRIMARY, fontWeight: '500' }}>Left Home Zone</ThemedText>
                <ThemedText style={{ fontSize: 11, color: colors.TEXT_SECONDARY }}>7:52 AM • Home</ThemedText>
              </View>
            </View>
            
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: colors.WARNING + '20', justifyContent: 'center', alignItems: 'center' }}>
                <Ionicons name="moon" size={18} color={colors.WARNING} />
              </View>
              <View style={{ flex: 1 }}>
                <ThemedText style={{ fontSize: 13, color: colors.TEXT_PRIMARY, fontWeight: '500' }}>Band entered sleep mode</ThemedText>
                <ThemedText style={{ fontSize: 11, color: colors.TEXT_SECONDARY }}>11:30 PM • Last night</ThemedText>
              </View>
            </View>
          </View>
          
          <TouchableOpacity 
            onPress={() => router.push('/activity')}
            style={{ marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: colors.BORDER, alignItems: 'center' }}
          >
            <ThemedText style={{ fontSize: 13, color: colors.ACCENT_TEAL, fontWeight: '600' }}>View All Activity →</ThemedText>
          </TouchableOpacity>
        </GlassCard>

        {/* Emergency Contacts */}
        <ThemedText weight="bold" style={{ fontSize: 16, color: colors.TEXT_PRIMARY, marginBottom: 12 }}>Emergency Contacts</ThemedText>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          {[
            { name: 'Fatima (Mother)', phone: '+92 300 1234567', icon: 'call' },
            { name: 'Ahmed (Father)', phone: '+92 301 7654321', icon: 'call' },
            { name: 'Dr. Khan', phone: '+92 310 9876543', icon: 'medical' }
          ].map((contact, i) => (
            <TouchableOpacity 
              key={i} 
              onPress={() => {
                showToast(`Calling ${contact.name}...`, 'info');
              }}
              style={{ flex: 1, alignItems: 'center' }}
            >
              <View style={{ 
                width: 56, height: 56, borderRadius: 28, 
                backgroundColor: colors.BG_SECONDARY, 
                justifyContent: 'center', alignItems: 'center', 
                borderWidth: 1, borderColor: colors.BORDER,
                marginBottom: 8
              }}>
                <Ionicons name={contact.icon as any} size={24} color={colors.DANGER} />
              </View>
              <ThemedText style={{ fontSize: 10, color: colors.TEXT_SECONDARY, fontWeight: '600', textAlign: 'center' }}>{contact.name.split(' ')[0]}</ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Safety Actions (Replaces the fake schedule) */}

        <ThemedText weight="bold" style={{ fontSize: 16, color: colors.TEXT_PRIMARY, marginBottom: 12 ,marginTop: 20}}>Quick Safety Actions</ThemedText>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <TouchableOpacity 
            onPress={() => showToast('Sending ring command to band...', 'info')}
            style={{ flex: 1, backgroundColor: colors.BG_SECONDARY, borderRadius: 14, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: colors.BORDER }}
          >
            <Ionicons name="musical-notes" size={24} color={colors.ACCENT_TEAL} style={{ marginBottom: 8 }} />
            <ThemedText style={{ fontSize: 12, color: colors.TEXT_PRIMARY, fontWeight: '600', textAlign: 'center' }}>Sound Alarm on Band</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => showToast('Requesting live location...', 'info')}
            style={{ flex: 1, backgroundColor: colors.BG_SECONDARY, borderRadius: 14, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: colors.BORDER }}
          >
            <Ionicons name="locate" size={24} color={colors.WARNING} style={{ marginBottom: 8 }} />
            <ThemedText style={{ fontSize: 12, color: colors.TEXT_PRIMARY, fontWeight: '600', textAlign: 'center' }}>Refresh Live Location</ThemedText>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  badge: { position: 'absolute', top: 4, right: 4, width: 8, height: 8, borderRadius: 4, borderWidth: 2 },
  childCard: { width: 110, height: 130, borderRadius: 16, padding: 12, alignItems: 'center', justifyContent: 'center' },
  avatarRing: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', borderWidth: 2 },
  statusPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginTop: 8 },
  heroAvatar: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', borderWidth: 3 },
});