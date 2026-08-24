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
import { ThemedText } from '../../components/ui/ThemedText';
import { GlassCard } from '../../components/ui/GlassCard';
import { GradientButton } from '../../components/ui/GradientButton';
import OfflineBanner from '../../components/OfflineBanner';
import LastSynced from '../../components/LastSynced';

const { width } = Dimensions.get('window');

export default function HomeDashboard() {
  const router = useRouter();
  const { colors, toggleTheme, mode } = useThemeStore();
  const { activeChildId, setActiveChild, children, updateVitals, deleteChild } = useChildrenStore();
  
  // SAFETY CHECK: Handle empty children array
  const activeChild = children.length > 0 
    ? (children.find(c => c.id === activeChildId) || children[0])
    : null;
  
  const [secondsAgo, setSecondsAgo] = useState(2);
  const [refreshing, setRefreshing] = useState(false);

  // Pull-to-Refresh Handler
  const onRefresh = () => {
    setRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTimeout(() => {
      setSecondsAgo(0);
      setRefreshing(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 1500);
  };

  // Simulate live data updates
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

  // If no children exist, show empty state
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
          <GradientButton 
            title="Add Child" 
            onPress={() => router.push('/add-child')} 
          />
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
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.BG_PRIMARY }} edges={['top']}>
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

        {/* Status Hero Card */}
        <GlassCard glowColor={activeChild.status === 'SAFE' ? colors.ACCENT_TEAL : colors.DANGER} style={{ marginBottom: 20, padding: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={[styles.heroAvatar, { borderColor: activeChild.status === 'SAFE' ? colors.SUCCESS : colors.DANGER, backgroundColor: colors.BG_TERTIARY, marginRight: 16 }]}>
              <ThemedText style={{ fontSize: 28, fontWeight: 'bold', color: colors.TEXT_PRIMARY }}>{activeChild.name.charAt(0)}</ThemedText>
            </View>
            <View style={{ flex: 1 }}>
              <ThemedText weight="bold" style={{ fontSize: 20, color: colors.TEXT_PRIMARY }}>{activeChild.name}</ThemedText>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 4, flexWrap: 'wrap' }}>
                <ThemedText style={{ fontSize: 12, color: colors.TEXT_SECONDARY }}>Updated: {secondsAgo}s ago</ThemedText>
                <LastSynced lastSynced={new Date(Date.now() - 300000)} />
              </View>
            </View>
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