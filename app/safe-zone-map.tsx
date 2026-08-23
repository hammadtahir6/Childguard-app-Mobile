import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, TextInput, Alert, Dimensions } from 'react-native';
import MapView, { Circle, Marker, MapPressEvent } from 'react-native-maps';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ThemedText } from '../components/ui/ThemedText';
import { ThemedView } from '../components/ui/ThemedView';
import { GlassCard } from '../components/ui/GlassCard';
import { GradientButton } from '../components/ui/GradientButton';
import { useThemeStore } from '../store/themeStore';
import { useChildrenStore } from '../store/childrenStore';
import { useToastStore } from '../store/toastStore';
import { Ionicons } from '@expo/vector-icons';

const ZONE_COLORS = ['#00D4AA', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function SafeZoneMapScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const childId = params.childId as string;
  const { colors } = useThemeStore();
  const { children, updateChildSafeZones } = useChildrenStore();
  const { showToast } = useToastStore();
  
  // SAFETY CHECK: Handle empty children
  if (children.length === 0) {
    return (
      <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Ionicons name="alert-circle" size={64} color={colors.DANGER} />
        <ThemedText weight="bold" style={{ fontSize: 18, color: colors.TEXT_PRIMARY, marginTop: 16 }}>
          No Children Found
        </ThemedText>
        <ThemedText style={{ fontSize: 14, color: colors.TEXT_SECONDARY, textAlign: 'center', marginTop: 8, marginBottom: 20 }}>
          Please add a child first
        </ThemedText>
        <TouchableOpacity 
          onPress={() => router.push('/add-child')}
          style={{ paddingVertical: 12, paddingHorizontal: 24, backgroundColor: colors.ACCENT_TEAL, borderRadius: 12 }}
        >
          <ThemedText weight="bold" style={{ color: '#FFF', fontSize: 16 }}>Add Child</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }
  
  const child = children.find(c => c.id === childId) || children[0];
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [newZone, setNewZone] = useState<{
    lat: number;
    lng: number;
    name: string;
    radius: number;
    color: string;
  } | null>(null);

  const MAP_WIDTH = SCREEN_WIDTH - 40;
  const MAP_HEIGHT = 350;

  const handleMapPress = (event: MapPressEvent) => {
    if (!isDrawingMode) {
      showToast('Tap "Create New Zone" button first!', 'warning');
      return;
    }

    const { latitude, longitude } = event.nativeEvent.coordinate;
    setNewZone({
      lat: latitude,
      lng: longitude,
      name: `Zone ${child.safeZones.length + 1}`,
      radius: 100,
      color: ZONE_COLORS[0],
    });
    showToast('Zone placed! Configure it below', 'success');
  };

  const saveNewZone = () => {
    if (!newZone) {
      showToast('Tap on the map first', 'warning');
      return;
    }
    if (!newZone.name.trim()) {
      showToast('Enter a zone name', 'warning');
      return;
    }

    const zoneToAdd = {
      id: Date.now().toString(),
      name: newZone.name,
      lat: newZone.lat,
      lng: newZone.lng,
      radius: newZone.radius,
      color: newZone.color,
    };

    updateChildSafeZones(child.id, [...child.safeZones, zoneToAdd]);
    showToast(`"${newZone.name}" zone created!`, 'success');
    setIsDrawingMode(false);
    setNewZone(null);
  };

  const cancelDrawing = () => {
    setIsDrawingMode(false);
    setNewZone(null);
    showToast('Cancelled', 'info');
  };

  const deleteZone = (zoneId: string) => {
    Alert.alert(
      'Delete Zone?',
      'This zone will be removed permanently.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            updateChildSafeZones(child.id, child.safeZones.filter(z => z.id !== zoneId));
            showToast('Zone deleted', 'info');
          }
        }
      ]
    );
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 20, paddingBottom: 10 }}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, marginRight: 12 }}>
          <Ionicons name="arrow-back" size={24} color={colors.TEXT_PRIMARY} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <ThemedText weight="bold" style={{ fontSize: 20, color: colors.TEXT_PRIMARY }}>Safe Zones</ThemedText>
          <ThemedText style={{ fontSize: 13, color: colors.TEXT_SECONDARY }}>{child.name}'s zones</ThemedText>
        </View>
      </View>

      {/* Map Container */}
      <View style={{ 
        width: MAP_WIDTH, 
        height: MAP_HEIGHT, 
        marginHorizontal: 20, 
        borderRadius: 16, 
        overflow: 'hidden', 
        borderWidth: 1, 
        borderColor: colors.BORDER,
        backgroundColor: colors.BG_TERTIARY
      }}>
        <MapView
          style={{ width: MAP_WIDTH, height: MAP_HEIGHT }}
          initialRegion={{
            latitude: child.location.lat,
            longitude: child.location.lng,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          }}
          onPress={handleMapPress}
          scrollEnabled={!isDrawingMode}
          zoomEnabled={!isDrawingMode}
          mapType="standard"
        >
          <Marker coordinate={{ latitude: child.location.lat, longitude: child.location.lng }}>
            <View style={{ 
              width: 40, height: 40, borderRadius: 20, 
              backgroundColor: colors.ACCENT_TEAL, 
              borderWidth: 3, borderColor: '#FFF', 
              justifyContent: 'center', alignItems: 'center',
              elevation: 5
            }}>
              <ThemedText style={{ fontSize: 18, fontWeight: 'bold', color: '#FFF' }}>
                {child.name.charAt(0)}
              </ThemedText>
            </View>
          </Marker>

          {child.safeZones.map(zone => (
            <Circle
              key={zone.id}
              center={{ latitude: zone.lat, longitude: zone.lng }}
              radius={zone.radius}
              strokeColor={zone.color}
              fillColor={zone.color + '30'}
              strokeWidth={2}
            />
          ))}

          {newZone && (
            <>
              <Circle
                center={{ latitude: newZone.lat, longitude: newZone.lng }}
                radius={newZone.radius}
                strokeColor={newZone.color}
                fillColor={newZone.color + '40'}
                strokeWidth={3}
              />
              <Marker coordinate={{ latitude: newZone.lat, longitude: newZone.lng }} pinColor={newZone.color} />
            </>
          )}
        </MapView>

        {isDrawingMode && !newZone && (
          <View style={{ 
            position: 'absolute', top: 12, left: 12, right: 12, 
            backgroundColor: 'rgba(0,0,0,0.85)', padding: 12, borderRadius: 8,
            borderWidth: 1, borderColor: colors.ACCENT_TEAL
          }}>
            <ThemedText style={{ color: '#FFF', fontSize: 13, fontWeight: '600', textAlign: 'center' }}>
              👆 Tap anywhere on the map
            </ThemedText>
          </View>
        )}
      </View>

      {/* Controls */}
      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, marginTop: 16 }} contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
        
        {!isDrawingMode ? (
          <TouchableOpacity
            onPress={() => {
              setIsDrawingMode(true);
              setNewZone(null);
              showToast('Drawing mode ON - Tap the map', 'info');
            }}
            style={{
              paddingVertical: 16, borderRadius: 14, alignItems: 'center', marginBottom: 16,
              backgroundColor: colors.ACCENT_TEAL,
              flexDirection: 'row', justifyContent: 'center', gap: 8, elevation: 3
            }}
          >
            <Ionicons name="add-circle" size={22} color="#FFF" />
            <ThemedText weight="bold" style={{ color: '#FFF', fontSize: 16 }}>Create New Zone</ThemedText>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={cancelDrawing}
            style={{
              paddingVertical: 14, borderRadius: 14, alignItems: 'center', marginBottom: 16,
              backgroundColor: colors.DANGER,
              flexDirection: 'row', justifyContent: 'center', gap: 8, elevation: 3
            }}
          >
            <Ionicons name="close-circle" size={22} color="#FFF" />
            <ThemedText weight="bold" style={{ color: '#FFF', fontSize: 16 }}>Cancel Drawing</ThemedText>
          </TouchableOpacity>
        )}

        {newZone && (
          <GlassCard style={{ padding: 16, marginBottom: 16, borderWidth: 2, borderColor: colors.ACCENT_TEAL }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Ionicons name="location" size={20} color={colors.ACCENT_TEAL} />
              <ThemedText weight="bold" style={{ fontSize: 16, color: colors.TEXT_PRIMARY }}>Configure Zone</ThemedText>
            </View>

            <View style={{ marginBottom: 12 }}>
              <ThemedText style={{ fontSize: 12, color: colors.TEXT_SECONDARY, marginBottom: 6, fontWeight: '600' }}>Zone Name</ThemedText>
              <TextInput
                placeholder="e.g. Home, School, Park"
                placeholderTextColor={colors.TEXT_SECONDARY}
                value={newZone.name}
                onChangeText={(text) => setNewZone({ ...newZone, name: text })}
                autoFocus
                style={{
                  height: 46, backgroundColor: colors.BG_TERTIARY, borderRadius: 10,
                  borderWidth: 1, borderColor: colors.BORDER, paddingHorizontal: 12,
                  color: colors.TEXT_PRIMARY, fontSize: 14 
                }}
              />
            </View>

            <View style={{ marginBottom: 12 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                <ThemedText style={{ fontSize: 12, color: colors.TEXT_SECONDARY, fontWeight: '600' }}>Radius</ThemedText>
                <ThemedText weight="bold" style={{ fontSize: 14, color: colors.ACCENT_TEAL }}>{newZone.radius}m</ThemedText>
              </View>
              <View style={{ flexDirection: 'row', gap: 6 }}>
                {[50, 100, 200, 500].map(r => (
                  <TouchableOpacity
                    key={r}
                    onPress={() => setNewZone({ ...newZone, radius: r })}
                    style={{
                      flex: 1, paddingVertical: 8, borderRadius: 8,
                      backgroundColor: newZone.radius === r ? colors.ACCENT_TEAL : colors.BG_TERTIARY,
                      alignItems: 'center',
                      borderWidth: newZone.radius === r ? 1 : 0,
                      borderColor: colors.ACCENT_TEAL
                    }}
                  >
                    <ThemedText style={{ fontSize: 12, color: newZone.radius === r ? '#FFF' : colors.TEXT_SECONDARY, fontWeight: '600' }}>{r}m</ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={{ marginBottom: 16 }}>
              <ThemedText style={{ fontSize: 12, color: colors.TEXT_SECONDARY, marginBottom: 6, fontWeight: '600' }}>Zone Color</ThemedText>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {ZONE_COLORS.map(c => (
                  <TouchableOpacity
                    key={c}
                    onPress={() => setNewZone({ ...newZone, color: c })}
                    style={{
                      width: 36, height: 36, borderRadius: 18, backgroundColor: c,
                      borderWidth: newZone.color === c ? 3 : 1,
                      borderColor: newZone.color === c ? colors.TEXT_PRIMARY : 'transparent',
                      elevation: 3
                    }}
                  />
                ))}
              </View>
            </View>

            <GradientButton title="Save Zone" onPress={saveNewZone} />
          </GlassCard>
        )}

        <ThemedText weight="bold" style={{ fontSize: 16, color: colors.TEXT_PRIMARY, marginBottom: 12 }}>
          Active Zones ({child.safeZones.length})
        </ThemedText>

        {child.safeZones.length === 0 ? (
          <GlassCard style={{ padding: 24, alignItems: 'center' }}>
            <Ionicons name="location-outline" size={48} color={colors.TEXT_SECONDARY} />
            <ThemedText style={{ fontSize: 14, color: colors.TEXT_SECONDARY, marginTop: 8, textAlign: 'center' }}>
              No safe zones yet. Tap "Create New Zone" to add one.
            </ThemedText>
          </GlassCard>
        ) : (
          <View style={{ gap: 10 }}>
            {child.safeZones.map(zone => (
              <GlassCard key={zone.id} style={{ padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: zone.color, borderWidth: 2, borderColor: colors.BG_PRIMARY }} />
                <View style={{ flex: 1 }}>
                  <ThemedText weight="semibold" style={{ fontSize: 14, color: colors.TEXT_PRIMARY }}>{zone.name}</ThemedText>
                  <ThemedText style={{ fontSize: 12, color: colors.TEXT_SECONDARY }}>{zone.radius}m radius</ThemedText>
                </View>
                <TouchableOpacity onPress={() => deleteZone(zone.id)} style={{ padding: 6 }}>
                  <Ionicons name="trash-outline" size={18} color={colors.DANGER} />
                </TouchableOpacity>
              </GlassCard>
            ))}
          </View>
        )}

      </ScrollView>
    </ThemedView>
  );
}