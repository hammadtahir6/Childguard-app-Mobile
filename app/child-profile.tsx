import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Alert, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '../store/themeStore';
import { useChildrenStore } from '../store/childrenStore';
import { useToastStore } from '../store/toastStore';
import { ThemedText } from '../components/ui/ThemedText';
import { GlassCard } from '../components/ui/GlassCard';

const { width } = Dimensions.get('window');

export default function ChildProfileScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { colors } = useThemeStore();
  const { children, activeChildId, setActiveChild, disconnectBand } = useChildrenStore();
  const { showToast } = useToastStore();
  
  const child = children.find(c => c.id === id) || children.find(c => c.id === activeChildId) || children[0];

  const handleUnpair = () => {
    Alert.alert(
      'Unpair Wristband',
      `This will disconnect the band from ${child.name}'s profile. You will need to re-pair it to receive updates.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Unpair',
          style: 'destructive',
          onPress: () => {
            disconnectBand(child.id);
            showToast('Band disconnected successfully', 'info');
            // In a real app, this would send an API request to the backend
          }
        }
      ]
    );
  };

  const handleSwitchChild = () => {
    // Simple cycle for demo, in real app this would open a modal
    const currentIndex = children.findIndex(c => c.id === child.id);
    const nextIndex = (currentIndex + 1) % children.length;
    const nextChild = children[nextIndex];
    setActiveChild(nextChild.id);
    showToast(`Switched to ${nextChild.name}`, 'info');
    // In a real app, you might reload the profile data here
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.BG_PRIMARY }} edges={['top', 'bottom']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        
        {/* Header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <TouchableOpacity onPress={() => router.back()} style={{ padding: 8 }}>
            <Ionicons name="arrow-back" size={24} color={colors.TEXT_PRIMARY} />
          </TouchableOpacity>
          
          {/* Switch Child Button */}
          <TouchableOpacity 
            onPress={handleSwitchChild}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 8, padding: 8, borderRadius: 20, backgroundColor: colors.BG_TERTIARY }}
          >
            <Ionicons name="people-outline" size={18} color={colors.ACCENT_TEAL} />
            <ThemedText style={{ fontSize: 13, color: colors.ACCENT_TEAL, fontWeight: '600' }}>
              Switch Child
            </ThemedText>
          </TouchableOpacity>
        </View>

        {/* Profile Hero */}
        <GlassCard style={{ padding: 24, alignItems: 'center', marginBottom: 20 }}>
          <View style={{ 
            width: 100, height: 100, borderRadius: 50, 
            backgroundColor: colors.ACCENT_TEAL + '20', 
            justifyContent: 'center', alignItems: 'center', 
            borderWidth: 4, borderColor: colors.ACCENT_TEAL, 
            marginBottom: 16 
          }}>
            <ThemedText style={{ fontSize: 36, fontWeight: 'bold', color: colors.ACCENT_TEAL }}>
              {child.name.charAt(0)}
            </ThemedText>
          </View>
          <ThemedText weight="bold" style={{ fontSize: 24, color: colors.TEXT_PRIMARY }}>{child.name}</ThemedText>
          <ThemedText style={{ fontSize: 14, color: colors.TEXT_SECONDARY, marginTop: 4 }}>
            {child.age} years old • {child.gender}
          </ThemedText>
          <View style={{ 
            marginTop: 12, paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, 
            backgroundColor: colors.SUCCESS + '20', flexDirection: 'row', alignItems: 'center', gap: 6 
          }}>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.SUCCESS }} />
            <ThemedText weight="bold" style={{ fontSize: 12, color: colors.SUCCESS }}>SAFE</ThemedText>
          </View>
        </GlassCard>

        {/* Wristband Status */}
        <GlassCard style={{ padding: 20, marginBottom: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Ionicons name="watch" size={20} color={colors.TEXT_PRIMARY} />
              <ThemedText weight="bold" style={{ fontSize: 16, color: colors.TEXT_PRIMARY }}>Wristband</ThemedText>
            </View>
            <TouchableOpacity 
              onPress={handleUnpair}
              style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: colors.DANGER }}
            >
              <ThemedText style={{ fontSize: 12, color: colors.DANGER, fontWeight: '600' }}>Unpair</ThemedText>
            </TouchableOpacity>
          </View>
          
          <View style={{ gap: 12 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <ThemedText style={{ fontSize: 13, color: colors.TEXT_SECONDARY }}>Band Code</ThemedText>
              <ThemedText font="mono" style={{ fontSize: 13, color: colors.ACCENT_TEAL, fontWeight: '600' }}>CG-2847-XKQP</ThemedText>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <ThemedText style={{ fontSize: 13, color: colors.TEXT_SECONDARY }}>Status</ThemedText>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: child.band.connected ? colors.SUCCESS : colors.DANGER }} />
                <ThemedText style={{ fontSize: 13, color: child.band.connected ? colors.SUCCESS : colors.DANGER, fontWeight: '600' }}>
                  {child.band.connected ? 'Connected' : 'Disconnected'}
                </ThemedText>
              </View>
            </View>
            <View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                <ThemedText style={{ fontSize: 13, color: colors.TEXT_SECONDARY }}>Battery</ThemedText>
                <ThemedText style={{ fontSize: 13, color: colors.TEXT_PRIMARY, fontWeight: '600' }}>{child.band.battery}%</ThemedText>
              </View>
              <View style={{ height: 6, backgroundColor: colors.BG_TERTIARY, borderRadius: 3, overflow: 'hidden' }}>
                <View style={{ width: `${child.band.battery}%`, height: '100%', backgroundColor: child.band.battery > 20 ? colors.ACCENT_TEAL : colors.DANGER }} />
              </View>
            </View>
          </View>
        </GlassCard>

        {/* Details */}
        <GlassCard style={{ padding: 20, marginBottom: 20 }}>
          <ThemedText weight="bold" style={{ fontSize: 16, color: colors.TEXT_PRIMARY, marginBottom: 16 }}>Details</ThemedText>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 20 }}>
            <View style={{ width: '45%' }}>
              <ThemedText style={{ fontSize: 11, color: colors.TEXT_SECONDARY, marginBottom: 4 }}>School</ThemedText>
              <ThemedText style={{ fontSize: 14, color: colors.TEXT_PRIMARY, fontWeight: '600' }}>{child.schoolSchedule?.name || 'Not set'}</ThemedText>
            </View>
            <View style={{ width: '45%' }}>
              <ThemedText style={{ fontSize: 11, color: colors.TEXT_SECONDARY, marginBottom: 4 }}>City</ThemedText>
              <ThemedText style={{ fontSize: 14, color: colors.TEXT_PRIMARY, fontWeight: '600' }}>Peshawar</ThemedText>
            </View>
            <View style={{ width: '100%' }}>
              <ThemedText style={{ fontSize: 11, color: colors.TEXT_SECONDARY, marginBottom: 4 }}>Medical Notes</ThemedText>
              <ThemedText style={{ fontSize: 14, color: colors.TEXT_PRIMARY, fontWeight: '600' }}>{child.medicalInfo?.allergies || 'No known allergies'}</ThemedText>
            </View>
          </View>
        </GlassCard>

        {/* Safe Zones */}
        <GlassCard style={{ padding: 20, marginBottom: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <ThemedText weight="bold" style={{ fontSize: 16, color: colors.TEXT_PRIMARY }}>Safe Zones</ThemedText>
            <TouchableOpacity onPress={() => router.push('/safe-zone-map')}>
              <ThemedText style={{ fontSize: 13, color: colors.ACCENT_TEAL, fontWeight: '600' }}>Manage →</ThemedText>
            </TouchableOpacity>
          </View>
          {child.safeZones.length === 0 ? (
            <ThemedText style={{ fontSize: 13, color: colors.TEXT_SECONDARY, textAlign: 'center', padding: 10 }}>No zones configured</ThemedText>
          ) : (
            child.safeZones.map(zone => (
              <View key={zone.id} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.BORDER }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: zone.color }} />
                  <ThemedText style={{ fontSize: 14, color: colors.TEXT_PRIMARY }}>{zone.name}</ThemedText>
                </View>
                <ThemedText style={{ fontSize: 12, color: colors.TEXT_SECONDARY }}>{zone.radius}m</ThemedText>
              </View>
            ))
          )}
        </GlassCard>

        {/* Quick Actions (Fills the bottom space meaningfully) */}
        <ThemedText weight="bold" style={{ fontSize: 16, color: colors.TEXT_PRIMARY, marginBottom: 12 }}>Quick Actions</ThemedText>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
          {[
            { icon: 'pulse', label: 'Health', route: '/(tabs)/health', color: colors.DANGER },
            { icon: 'notifications', label: 'Alerts', route: '/(tabs)/alerts', color: colors.WARNING },
            { icon: 'map', label: 'Map', route: '/(tabs)/map', color: colors.ACCENT_TEAL },
            
          ].map((action, i) => (
            <TouchableOpacity 
              key={i} 
              onPress={() => router.push(action.route as any)} 
              style={{ flex: 1, alignItems: 'center' }}
            >
              <View style={{ 
                width: 56, height: 56, borderRadius: 28, 
                backgroundColor: colors.BG_SECONDARY, 
                justifyContent: 'center', alignItems: 'center', 
                borderWidth: 1, borderColor: colors.BORDER,
                marginBottom: 8
              }}>
                <Ionicons name={action.icon as any} size={24} color={action.color} />
              </View>
              <ThemedText style={{ fontSize: 11, color: colors.TEXT_SECONDARY, fontWeight: '600' }}>{action.label}</ThemedText>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}