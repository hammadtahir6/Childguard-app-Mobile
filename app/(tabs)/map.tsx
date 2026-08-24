import React, { useState, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, Circle, Polygon, MapPressEvent } from 'react-native-maps';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '../../store/themeStore';
import { useChildrenStore } from '../../store/childrenStore';
import { useToastStore } from '../../store/toastStore';
import { ThemedText } from '../../components/ui/ThemedText';
import { GlassCard } from '../../components/ui/GlassCard';

const { width } = Dimensions.get('window');

export default function MapScreen() {
  const router = useRouter();
  const { colors } = useThemeStore();
  const { children, activeChildId, updateChildSafeZones } = useChildrenStore();
  const { showToast } = useToastStore();
  
  const activeChild = children.find(c => c.id === activeChildId) || children[0];
  const mapRef = useRef<MapView>(null);

  // Drawing State
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingPoints, setDrawingPoints] = useState<{ latitude: number; longitude: number }[]>([]);

  const handleMapPress = (event: MapPressEvent) => {
    if (!isDrawing) return;
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setDrawingPoints([...drawingPoints, { latitude, longitude }]);
  };

  const finishDrawing = () => {
    if (drawingPoints.length < 3) {
      showToast('Tap at least 3 points to create a zone', 'warning');
      return;
    }

    const avgLat = drawingPoints.reduce((sum, p) => sum + p.latitude, 0) / drawingPoints.length;
    const avgLng = drawingPoints.reduce((sum, p) => sum + p.longitude, 0) / drawingPoints.length;
    
    const maxDist = Math.max(...drawingPoints.map(p => 
      Math.sqrt(Math.pow(p.latitude - avgLat, 2) + Math.pow(p.longitude - avgLng, 2))
    )) * 111000;

    const newZone = {
      id: Date.now().toString(),
      name: 'Custom Zone',
      lat: avgLat,
      lng: avgLng,
      radius: Math.round(maxDist) + 20,
      color: colors.ACCENT_TEAL,
    };

    updateChildSafeZones(activeChild.id, [...activeChild.safeZones, newZone]);
    showToast('Safe Zone Created!', 'success');
    setDrawingPoints([]);
    setIsDrawing(false);
  };

  const cancelDrawing = () => {
    setDrawingPoints([]);
    setIsDrawing(false);
  };

  const centerMap = () => {
    mapRef.current?.animateToRegion({
      latitude: activeChild.location.lat,
      longitude: activeChild.location.lng,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }, 1000);
    showToast('Map centered on child', 'info');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.BG_PRIMARY }} edges={['top', 'bottom']}>
      <View style={{ flex: 1 }}>
        
        {/* 1. THE MAP (Full Screen Background) */}
        <MapView
          ref={mapRef}
          style={StyleSheet.absoluteFill}
          initialRegion={{
            latitude: activeChild.location.lat,
            longitude: activeChild.location.lng,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          onPress={handleMapPress}
          mapType="standard"
        >
          <Marker coordinate={{ latitude: activeChild.location.lat, longitude: activeChild.location.lng }}>
            <View style={{ 
              width: 44, height: 44, borderRadius: 22, 
              backgroundColor: colors.ACCENT_TEAL, borderWidth: 3, borderColor: '#FFF',
              justifyContent: 'center', alignItems: 'center', elevation: 5
            }}>
              <ThemedText style={{ fontSize: 20, fontWeight: 'bold', color: '#FFF' }}>
                {activeChild.name.charAt(0)}
              </ThemedText>
            </View>
          </Marker>

          {activeChild.safeZones.map(zone => (
            <Circle
              key={zone.id}
              center={{ latitude: zone.lat, longitude: zone.lng }}
              radius={zone.radius}
              strokeColor={zone.color}
              fillColor={zone.color + '30'}
              strokeWidth={2}
            />
          ))}

          {isDrawing && drawingPoints.length > 0 && (
            <Polygon
              coordinates={drawingPoints}
              strokeColor={colors.ACCENT_TEAL}
              fillColor={colors.ACCENT_TEAL + '40'}
              strokeWidth={2}
            />
          )}
          
          {isDrawing && drawingPoints.map((point, index) => (
            <Marker key={index} coordinate={point} pinColor={colors.ACCENT_TEAL} />
          ))}
        </MapView>

        {/* 2. TOP UI LAYER (Fully Clickable Header) */}
        <View style={styles.topContainer}>
          <TouchableOpacity 
            activeOpacity={0.8}
            onPress={() => router.push('/child-profile')}
            style={{ marginBottom: 12 }}
          >
            <GlassCard style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
                <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: colors.BG_TERTIARY, justifyContent: 'center', alignItems: 'center' }}>
                  <Ionicons name="chevron-back" size={20} color={colors.TEXT_PRIMARY} />
                </View>
                <View style={{ flex: 1 }}>
                  <ThemedText weight="bold" style={{ fontSize: 16, color: colors.TEXT_PRIMARY }}>{activeChild.name}</ThemedText>
                  <ThemedText style={{ fontSize: 11, color: colors.TEXT_SECONDARY }}>{activeChild.location.address}</ThemedText>
                </View>
              </View>
              <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, backgroundColor: colors.SUCCESS + '20' }}>
                <ThemedText style={{ fontSize: 10, fontWeight: 'bold', color: colors.SUCCESS }}>SAFE</ThemedText>
              </View>
            </GlassCard>
          </TouchableOpacity>

          {isDrawing && (
            <GlassCard style={{ backgroundColor: colors.ACCENT_TEAL + '20', borderColor: colors.ACCENT_TEAL, padding: 10, alignItems: 'center' }}>
              <ThemedText style={{ fontSize: 13, color: colors.ACCENT_TEAL, fontWeight: '600' }}>
                Tap map to add points ({drawingPoints.length} added)
              </ThemedText>
            </GlassCard>
          )}
        </View>

        {/* 3. FLOATING ACTION BUTTONS (Right Side) */}
        <View style={styles.fabContainer}>
          {!isDrawing ? (
            <View style={{ gap: 12 }}>
              {/* Center Map Button */}
              <TouchableOpacity 
                onPress={centerMap}
                style={[styles.fab, { backgroundColor: colors.BG_SECONDARY, borderWidth: 1, borderColor: colors.BORDER }]}
              >
                <Ionicons name="locate" size={24} color={colors.ACCENT_TEAL} />
              </TouchableOpacity>
              
              {/* Draw Zone Button */}
              <TouchableOpacity 
                onPress={() => setIsDrawing(true)}
                style={[styles.fab, { backgroundColor: colors.ACCENT_TEAL }]}
              >
                <Ionicons name="create-outline" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ gap: 12 }}>
              <TouchableOpacity 
                onPress={finishDrawing}
                style={[styles.fab, { backgroundColor: colors.SUCCESS }]}
              >
                <Ionicons name="checkmark" size={28} color="#FFF" />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={cancelDrawing}
                style={[styles.fab, { backgroundColor: colors.DANGER }]}
              >
                <Ionicons name="close" size={28} color="#FFF" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* 4. BOTTOM INFO CARD */}
        <View style={styles.bottomContainer}>
          <GlassCard style={{ padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <ThemedText style={{ fontSize: 12, color: colors.TEXT_SECONDARY, marginBottom: 4 }}>Current Location</ThemedText>
              <ThemedText font="mono" style={{ fontSize: 14, color: colors.TEXT_PRIMARY }}>
                {activeChild.location.lat.toFixed(5)}, {activeChild.location.lng.toFixed(5)}
              </ThemedText>
            </View>
            <TouchableOpacity 
              onPress={centerMap}
              style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.ACCENT_TEAL, justifyContent: 'center', alignItems: 'center' }}
            >
              <Ionicons name="navigate" size={20} color="#FFF" />
            </TouchableOpacity>
          </GlassCard>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  topContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingTop: 10,
    zIndex: 10,
  },
  fabContainer: {
    position: 'absolute',
    top: 160, 
    right: 20,
    zIndex: 10,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 30,
    zIndex: 10,
  },
});