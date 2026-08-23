import React, { useState, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import MapView, { Marker, Circle, Polygon, MapPressEvent } from 'react-native-maps';
import { useThemeStore } from '../../store/themeStore';
import { useChildrenStore } from '../../store/childrenStore';
import { ThemedText } from '../../components/ui/ThemedText';
import { GlassCard } from '../../components/ui/GlassCard';
import { Ionicons } from '@expo/vector-icons';

export default function MapScreen() {
  const { colors } = useThemeStore();
  const { children, activeChildId, updateChildSafeZones } = useChildrenStore();
  const activeChild = children.find(c => c.id === activeChildId) || children[0];
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingPoints, setDrawingPoints] = useState<{ latitude: number; longitude: number }[]>([]);
  const mapRef = useRef<MapView>(null);

  const handleMapPress = (event: MapPressEvent) => {
    if (!isDrawing) return;
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setDrawingPoints([...drawingPoints, { latitude, longitude }]);
  };

  const finishDrawing = () => {
    if (drawingPoints.length < 3) {
      Alert.alert('Not enough points', 'Please tap at least 3 points to create a zone.');
      return;
    }
    // Calculate center and radius for the zone
    const centerLat = drawingPoints.reduce((sum, p) => sum + p.latitude, 0) / drawingPoints.length;
    const centerLng = drawingPoints.reduce((sum, p) => sum + p.longitude, 0) / drawingPoints.length;
    const maxDist = Math.max(...drawingPoints.map(p => 
      Math.sqrt(Math.pow(p.latitude - centerLat, 2) + Math.pow(p.longitude - centerLng, 2))
    )) * 111000; // Convert to meters

    const newZone = {
      id: Date.now().toString(),
      name: 'New Safe Zone',
      lat: centerLat,
      lng: centerLng,
      radius: Math.round(maxDist),
      color: colors.ACCENT_TEAL,
    };

    updateChildSafeZones(activeChildId, [...activeChild.safeZones, newZone]);
    setDrawingPoints([]);
    setIsDrawing(false);
    Alert.alert('Zone Created', 'Safe zone has been added successfully!');
  };

  const cancelDrawing = () => {
    setDrawingPoints([]);
    setIsDrawing(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView 
        ref={mapRef}
        style={StyleSheet.absoluteFill} 
        initialRegion={{ 
          latitude: activeChild.location.lat, 
          longitude: activeChild.location.lng, 
          latitudeDelta: 0.01, 
          longitudeDelta: 0.01 
        }}
        mapType="standard"
        onPress={handleMapPress}
      >
        {children.map(child => (
          <Marker 
            key={child.id} 
            coordinate={{ latitude: child.location.lat, longitude: child.location.lng }}
          >
            <View style={{ 
              width: 40, 
              height: 40, 
              borderRadius: 20, 
              backgroundColor: colors.BG_SECONDARY, 
              borderWidth: 3, 
              borderColor: child.status === 'SAFE' ? colors.SUCCESS : colors.DANGER, 
              justifyContent: 'center', 
              alignItems: 'center' 
            }}>
              <ThemedText style={{ fontSize: 18, fontWeight: 'bold', color: colors.TEXT_PRIMARY }}>
                {child.name.charAt(0)}
              </ThemedText>
            </View>
          </Marker>
        ))}
        {activeChild.safeZones.map(zone => (
          <Circle 
            key={zone.id} 
            center={{ latitude: zone.lat, longitude: zone.lng }} 
            radius={zone.radius} 
            strokeColor={zone.color} 
            fillColor={`${zone.color}25`} 
            strokeWidth={2}
          />
        ))}
        {isDrawing && drawingPoints.length > 0 && (
          <Polygon 
            coordinates={drawingPoints} 
            strokeColor={colors.ACCENT_TEAL} 
            fillColor={`${colors.ACCENT_TEAL}30`} 
            strokeWidth={2}
          />
        )}
        {isDrawing && drawingPoints.map((point, i) => (
          <Marker key={i} coordinate={point} pinColor={colors.ACCENT_TEAL} />
        ))}
      </MapView>
      
      {/* Drawing Controls */}
      <View style={{ position: 'absolute', top: 60, right: 20, gap: 12 }}>
        <TouchableOpacity 
          onPress={() => { setIsDrawing(!isDrawing); setDrawingPoints([]); }}
          style={{ 
            width: 56, 
            height: 56, 
            borderRadius: 28, 
            backgroundColor: isDrawing ? colors.DANGER : colors.ACCENT_TEAL, 
            justifyContent: 'center', 
            alignItems: 'center',
            shadowColor: '#000',
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 5
          }}
        >
          <Ionicons name={isDrawing ? 'close' : 'create-outline'} size={24} color="#FFF" />
        </TouchableOpacity>
        {isDrawing && (
          <>
            <TouchableOpacity 
              onPress={finishDrawing}
              style={{ 
                width: 56, 
                height: 56, 
                borderRadius: 28, 
                backgroundColor: colors.SUCCESS, 
                justifyContent: 'center', 
                alignItems: 'center',
                shadowColor: '#000',
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 5
              }}
            >
              <Ionicons name="checkmark" size={24} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={cancelDrawing}
              style={{ 
                width: 56, 
                height: 56, 
                borderRadius: 28, 
                backgroundColor: colors.BG_SECONDARY, 
                justifyContent: 'center', 
                alignItems: 'center',
                borderWidth: 1,
                borderColor: colors.BORDER,
                shadowColor: '#000',
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 5
              }}
            >
              <Ionicons name="trash-outline" size={24} color={colors.TEXT_PRIMARY} />
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Instructions */}
      {isDrawing && (
        <View style={{ position: 'absolute', top: 140, left: 20, right: 20 }}>
          <GlassCard style={{ padding: 12, backgroundColor: colors.ACCENT_TEAL + '20', borderColor: colors.ACCENT_TEAL }}>
            <ThemedText style={{ fontSize: 13, color: colors.ACCENT_TEAL, fontWeight: '600', textAlign: 'center' }}>
              Tap on the map to draw zone points ({drawingPoints.length} points)
            </ThemedText>
          </GlassCard>
        </View>
      )}

      {/* Bottom Info */}
      <View style={{ position: 'absolute', bottom: 100, left: 20, right: 20 }}>
        <GlassCard style={{ padding: 16 }}>
          <ThemedText weight="bold" style={{ fontSize: 18, color: colors.TEXT_PRIMARY, marginBottom: 8 }}>
            {activeChild.name}
          </ThemedText>
          <ThemedText style={{ fontSize: 14, color: colors.TEXT_PRIMARY, marginBottom: 4 }}>
            📍 {activeChild.location.address}
          </ThemedText>
          <ThemedText font="mono" style={{ fontSize: 12, color: colors.TEXT_SECONDARY }}>
            {activeChild.location.lat.toFixed(5)}, {activeChild.location.lng.toFixed(5)}
          </ThemedText>
        </GlassCard>
      </View>
    </View>
  );
}