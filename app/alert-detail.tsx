import React from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import MapView, { Marker } from 'react-native-maps';
import { ThemedText } from '../components/ui/ThemedText';
import { ThemedView } from '../components/ui/ThemedView';
import { GlassCard } from '../components/ui/GlassCard';
import { GradientButton } from '../components/ui/GradientButton';
import { useThemeStore } from '../store/themeStore';
import { useToastStore } from '../store/toastStore';
import { ALERTS } from '../constants/DummyData';
import { Ionicons } from '@expo/vector-icons';

export default function AlertDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { colors } = useThemeStore();
  const { showToast } = useToastStore();
  
  const alert = ALERTS.find(a => a.id === id) || ALERTS[0];
  const severityColor = alert.severity === 'EMERGENCY' ? colors.DANGER : colors.WARNING;

  const handleResolve = () => {
    showToast('Alert Resolved Successfully', 'success');
    router.back();
  };

  const getIcon = (type: string) => {
    const map: Record<string, any> = {
      FALL_DETECTED: 'alert-circle', SOS_PRESSED: 'warning', TAMPER_DETECTED: 'construct',
      HIGH_HEART_RATE: 'heart', LEFT_SAFE_ZONE: 'location', BATTERY_LOW: 'battery-half'
    };
    return map[type] || 'notifications';
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
        
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
          <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, marginRight: 12 }}>
            <Ionicons name="arrow-back" size={24} color={colors.TEXT_PRIMARY} />
          </TouchableOpacity>
          <ThemedText weight="bold" style={{ fontSize: 20, color: colors.TEXT_PRIMARY }}>Alert Details</ThemedText>
        </View>

        {/* Hero Icon & Title */}
        <View style={{ alignItems: 'center', marginBottom: 24 }}>
          <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: severityColor + '20', justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}>
            <Ionicons name={getIcon(alert.type)} size={32} color={severityColor} />
          </View>
          <ThemedText weight="bold" style={{ fontSize: 24, color: colors.TEXT_PRIMARY, textAlign: 'center', marginBottom: 8 }}>{alert.title}</ThemedText>
          <View style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, backgroundColor: severityColor + '20' }}>
            <ThemedText weight="bold" style={{ fontSize: 12, color: severityColor, letterSpacing: 1 }}>{alert.severity} • {alert.resolved ? 'RESOLVED' : 'ACTIVE'}</ThemedText>
          </View>
        </View>

        {/* Mini Map */}
        <View style={{ borderRadius: 16, overflow: 'hidden', marginBottom: 16, height: 180, borderWidth: 1, borderColor: colors.BORDER }}>
          <MapView style={{ width: '100%', height: '100%' }} initialRegion={{ latitude: alert.location.lat, longitude: alert.location.lng, latitudeDelta: 0.01, longitudeDelta: 0.01 }} scrollEnabled={false} zoomEnabled={false}>
            <Marker coordinate={{ latitude: alert.location.lat, longitude: alert.location.lng }}>
              <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: severityColor, borderWidth: 3, borderColor: '#FFF', justifyContent: 'center', alignItems: 'center' }}>
                <Ionicons name={getIcon(alert.type)} size={18} color="#FFF" />
              </View>
            </Marker>
          </MapView>
          <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.8)', padding: 12 }}>
            <ThemedText style={{ fontSize: 14, color: '#FFF', fontWeight: '600' }}>{alert.location.address}</ThemedText>
          </View>
        </View>

        {/* Timeline */}
        <GlassCard style={{ padding: 16, marginBottom: 16 }}>
          <ThemedText weight="bold" style={{ fontSize: 16, color: colors.TEXT_PRIMARY, marginBottom: 16 }}>What Happened</ThemedText>
          <View style={{ paddingLeft: 8 }}>
            {[
              { time: '3:45:02 PM', text: 'Sensor data received', detail: 'AI analyzed accelerometer data', status: 'past' },
              { time: '3:45:03 PM', text: 'Fall pattern detected', detail: 'Random Forest classified: FALL', status: 'past' },
              { time: '3:45:03 PM', text: 'Emergency alert triggered', detail: 'Confidence: 94.2%', status: 'current' },
              { time: '3:45:04 PM', text: 'You were notified', detail: 'SMS + App notification sent', status: 'past' },
              ...(alert.resolved ? [{ time: '3:46:21 PM', text: 'Alert resolved', detail: 'Parent confirmed', status: 'past' }] : [])
            ].map((item, i, arr) => (
              <View key={i} style={{ flexDirection: 'row', marginBottom: i === arr.length - 1 ? 0 : 16 }}>
                <View style={{ alignItems: 'center', marginRight: 12 }}>
                  <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: item.status === 'current' ? colors.ACCENT_TEAL : colors.TEXT_SECONDARY }} />
                  {i < arr.length - 1 && <View style={{ width: 2, flex: 1, backgroundColor: colors.BORDER, marginTop: 4 }} />}
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <ThemedText weight="semibold" style={{ fontSize: 14, color: colors.TEXT_PRIMARY }}>{item.text}</ThemedText>
                    <ThemedText style={{ fontSize: 12, color: colors.TEXT_SECONDARY }}>{item.time}</ThemedText>
                  </View>
                  <ThemedText style={{ fontSize: 12, color: colors.TEXT_SECONDARY, marginTop: 2 }}>{item.detail}</ThemedText>
                </View>
              </View>
            ))}
          </View>
        </GlassCard>

        {/* Vitals at Alert */}
        <ThemedText weight="bold" style={{ fontSize: 16, color: colors.TEXT_PRIMARY, marginBottom: 12 }}>Vitals at Time of Alert</ThemedText>
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
          <GlassCard style={{ flex: 1, padding: 16, alignItems: 'center' }}>
            <Ionicons name="heart" size={24} color={colors.DANGER} style={{ marginBottom: 8 }} />
            <ThemedText font="mono" weight="bold" style={{ fontSize: 20, color: colors.TEXT_PRIMARY }}>{alert.vitalsAtAlert.heartRate}</ThemedText>
            <ThemedText style={{ fontSize: 11, color: colors.TEXT_SECONDARY }}>BPM</ThemedText>
          </GlassCard>
          <GlassCard style={{ flex: 1, padding: 16, alignItems: 'center' }}>
            <Ionicons name="pulse" size={24} color="#3B82F6" style={{ marginBottom: 8 }} />
            <ThemedText font="mono" weight="bold" style={{ fontSize: 20, color: colors.TEXT_PRIMARY }}>{alert.vitalsAtAlert.spo2}%</ThemedText>
            <ThemedText style={{ fontSize: 11, color: colors.TEXT_SECONDARY }}>SpO2</ThemedText>
          </GlassCard>
          <GlassCard style={{ flex: 1, padding: 16, alignItems: 'center' }}>
            <Ionicons name="thermometer" size={24} color={colors.WARNING} style={{ marginBottom: 8 }} />
            <ThemedText font="mono" weight="bold" style={{ fontSize: 20, color: colors.TEXT_PRIMARY }}>{alert.vitalsAtAlert.temperature}°</ThemedText>
            <ThemedText style={{ fontSize: 11, color: colors.TEXT_SECONDARY }}>Temp</ThemedText>
          </GlassCard>
        </View>

        {/* Action Buttons */}
        {!alert.resolved ? (
          <View style={{ gap: 12 }}>
            <GradientButton title="I AM WITH MY CHILD (RESOLVE)" onPress={handleResolve} />
            <TouchableOpacity style={{ paddingVertical: 16, borderRadius: 14, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8, borderWidth: 1, borderColor: colors.DANGER, backgroundColor: 'transparent' }}>
              <Ionicons name="call" size={20} color={colors.DANGER} />
              <ThemedText weight="bold" style={{ fontSize: 16, color: colors.DANGER }}>CALL CHILD NOW</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={{ paddingVertical: 16, borderRadius: 14, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8, borderWidth: 1, borderColor: colors.DANGER, backgroundColor: 'transparent' }}>
              <Ionicons name="shield" size={20} color={colors.DANGER} />
              <ThemedText weight="bold" style={{ fontSize: 16, color: colors.DANGER }}>CALL POLICE — 15</ThemedText>
            </TouchableOpacity>
          </View>
        ) : (
          <GlassCard style={{ padding: 20, alignItems: 'center', backgroundColor: colors.SUCCESS + '10', borderColor: colors.SUCCESS }}>
            <Ionicons name="checkmark-circle" size={48} color={colors.SUCCESS} />
            <ThemedText weight="bold" style={{ fontSize: 18, color: colors.SUCCESS, marginTop: 8 }}>Alert Resolved</ThemedText>
          </GlassCard>
        )}

      </ScrollView>
    </ThemedView>
  );
}