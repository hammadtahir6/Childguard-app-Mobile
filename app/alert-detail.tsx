import React from 'react';
import { View, ScrollView, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '../store/themeStore';
import { useChildrenStore } from '../store/childrenStore';
import { useAlertsStore } from '../store/alertsStore';
import { useToastStore } from '../store/toastStore';
import { ThemedText } from '../components/ui/ThemedText';
import { GlassCard } from '../components/ui/GlassCard';

export default function AlertDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { colors } = useThemeStore();
  const { activeChildId, children } = useChildrenStore();
  const activeChild = children.find(c => c.id === activeChildId);
  const { alerts, markAsRead, resolveAlert } = useAlertsStore();
  const { showToast } = useToastStore();
  
  const alert = alerts.find(a => a.id === id) || alerts[0];
  
  React.useEffect(() => {
    if (alert && !alert.read) markAsRead(alert.id);
  }, [alert?.id]);

  const makeCall = (number: string) => {
    Linking.openURL(`tel:${number}`).catch(() => showToast(`Could not open dialer`, 'error'));
  };

  const openMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${alert.location.lat},${alert.location.lng}`;
    Linking.openURL(url).catch(() => showToast(`Could not open maps`, 'error'));
  };

  const handleResolve = () => {
    resolveAlert(alert.id);
    showToast('Alert Resolved Successfully', 'success');
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.BG_PRIMARY }} edges={['top', 'bottom']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
        
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
          <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, marginRight: 12 }}>
            <Ionicons name="arrow-back" size={24} color={colors.TEXT_PRIMARY} />
          </TouchableOpacity>
          <ThemedText weight="bold" style={{ fontSize: 20, color: colors.TEXT_PRIMARY }}>Alert Details</ThemedText>
        </View>

        {/* Map Section */}
        <TouchableOpacity activeOpacity={0.9} onPress={openMaps} style={{ marginBottom: 20, borderRadius: 16, overflow: 'hidden', height: 200, borderWidth: 1, borderColor: colors.BORDER }}>
          <MapView style={{ width: '100%', height: '100%' }} initialRegion={{ latitude: alert.location.lat, longitude: alert.location.lng, latitudeDelta: 0.01, longitudeDelta: 0.01 }} scrollEnabled={true} zoomEnabled={true}>
            <Marker coordinate={{ latitude: alert.location.lat, longitude: alert.location.lng }} pinColor={colors.DANGER} />
          </MapView>
          <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.7)', padding: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <ThemedText style={{ fontSize: 13, color: '#FFF', fontWeight: '600', flex: 1 }}>{alert.location.address}</ThemedText>
            <Ionicons name="open-outline" size={18} color="#FFF" />
          </View>
        </TouchableOpacity>

        {/* Real-Time Vitals */}
        <ThemedText weight="bold" style={{ fontSize: 16, color: colors.TEXT_PRIMARY, marginBottom: 12 }}>Current Vitals (Live)</ThemedText>
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
          <GlassCard style={{ flex: 1, padding: 16, alignItems: 'center' }}>
            <Ionicons name="heart" size={24} color={colors.DANGER} style={{ marginBottom: 8 }} />
            <ThemedText font="mono" weight="bold" style={{ fontSize: 20, color: colors.TEXT_PRIMARY }}>{activeChild?.vitals.heartRate || '--'}</ThemedText>
            <ThemedText style={{ fontSize: 11, color: colors.TEXT_SECONDARY }}>BPM</ThemedText>
          </GlassCard>
          <GlassCard style={{ flex: 1, padding: 16, alignItems: 'center' }}>
            <Ionicons name="pulse" size={24} color="#3B82F6" style={{ marginBottom: 8 }} />
            <ThemedText font="mono" weight="bold" style={{ fontSize: 20, color: colors.TEXT_PRIMARY }}>{activeChild?.vitals.spo2 || '--'}%</ThemedText>
            <ThemedText style={{ fontSize: 11, color: colors.TEXT_SECONDARY }}>SpO2</ThemedText>
          </GlassCard>
          <GlassCard style={{ flex: 1, padding: 16, alignItems: 'center' }}>
            <Ionicons name="thermometer" size={24} color={colors.WARNING} style={{ marginBottom: 8 }} />
            <ThemedText font="mono" weight="bold" style={{ fontSize: 20, color: colors.TEXT_PRIMARY }}>{activeChild?.vitals.temperature || '--'}°</ThemedText>
            <ThemedText style={{ fontSize: 11, color: colors.TEXT_SECONDARY }}>Temp</ThemedText>
          </GlassCard>
        </View>

        {/* Action Buttons */}
        <View style={{ gap: 12 }}>
          {/* RESOLVE BUTTON - Only shows if alert is NOT resolved */}
          {!alert.resolved && (
            <TouchableOpacity onPress={handleResolve} style={[styles.btn, { backgroundColor: colors.SUCCESS }]}>
              <Ionicons name="shield-checkmark" size={20} color="#FFF" />
              <ThemedText weight="bold" style={{ fontSize: 16, color: '#FFF' }}>I AM WITH MY CHILD (RESOLVE)</ThemedText>
            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={() => makeCall('+923001234567')} style={[styles.btn, { backgroundColor: '#FFF', borderWidth: 1, borderColor: colors.BORDER }]}>
            <Ionicons name="call" size={20} color={colors.DANGER} />
            <ThemedText weight="bold" style={{ fontSize: 16, color: colors.DANGER }}>CALL CHILD NOW</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => makeCall('15')} style={[styles.btn, { backgroundColor: 'transparent', borderWidth: 2, borderColor: colors.DANGER }]}>
            <Ionicons name="shield" size={20} color={colors.DANGER} />
            <ThemedText weight="bold" style={{ fontSize: 16, color: colors.DANGER }}>CALL POLICE (15)</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => makeCall('1122')} style={[styles.btn, { backgroundColor: 'transparent', borderWidth: 2, borderColor: colors.WARNING }]}>
            <Ionicons name="medical" size={20} color={colors.WARNING} />
            <ThemedText weight="bold" style={{ fontSize: 16, color: colors.WARNING }}>CALL AMBULANCE (1122)</ThemedText>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  btn: { height: 56, borderRadius: 14, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 },
});