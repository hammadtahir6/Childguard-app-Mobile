import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ThemedText } from '../components/ui/ThemedText';
import { ThemedView } from '../components/ui/ThemedView';
import { GlassCard } from '../components/ui/GlassCard';
import { useThemeStore } from '../store/themeStore';
import { useChildrenStore } from '../store/childrenStore';
import { Ionicons } from '@expo/vector-icons';

export default function ChildProfileScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { colors } = useThemeStore();
  const { children, deleteChild } = useChildrenStore();
  const child = children.find(c => c.id === id) || children[0];
  const [isEditing, setIsEditing] = useState(false);

  return (
    <ThemedView style={{ flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
        
        {/* Header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <TouchableOpacity onPress={() => router.back()} style={{ padding: 8 }}>
            <Ionicons name="arrow-back" size={24} color={colors.TEXT_PRIMARY} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsEditing(!isEditing)} style={{ padding: 8 }}>
            <Ionicons name={isEditing ? "close" : "create-outline"} size={24} color={colors.ACCENT_TEAL} />
          </TouchableOpacity>
        </View>

        {/* Profile Hero */}
        <GlassCard style={{ padding: 24, alignItems: 'center', marginBottom: 20 }}>
          <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: colors.ACCENT_TEAL + '20', justifyContent: 'center', alignItems: 'center', borderWidth: 4, borderColor: colors.ACCENT_TEAL, marginBottom: 16 }}>
            <ThemedText style={{ fontSize: 36, fontWeight: 'bold', color: colors.ACCENT_TEAL }}>{child.name.charAt(0)}</ThemedText>
          </View>
          <ThemedText weight="bold" style={{ fontSize: 24, color: colors.TEXT_PRIMARY }}>{child.name}</ThemedText>
          <ThemedText style={{ fontSize: 14, color: colors.TEXT_SECONDARY, marginTop: 4 }}>{child.age} years old • {child.gender}</ThemedText>
          <View style={{ marginTop: 12, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, backgroundColor: colors.SUCCESS + '20' }}>
            <ThemedText weight="bold" style={{ fontSize: 12, color: colors.SUCCESS }}>SAFE ●</ThemedText>
          </View>
        </GlassCard>

        {/* Band Status */}
        <GlassCard style={{ padding: 16, marginBottom: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <ThemedText weight="bold" style={{ fontSize: 16, color: colors.TEXT_PRIMARY }}>⌚ Wristband</ThemedText>
            <TouchableOpacity style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: colors.DANGER }}>
              <ThemedText style={{ fontSize: 12, color: colors.DANGER, fontWeight: '600' }}>Unpair</ThemedText>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
            <ThemedText style={{ fontSize: 13, color: colors.TEXT_SECONDARY }}>Band Code</ThemedText>
            <ThemedText font="mono" style={{ fontSize: 13, color: colors.ACCENT_TEAL }}>CG-2847-XKQP</ThemedText>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
            <ThemedText style={{ fontSize: 13, color: colors.TEXT_SECONDARY }}>Status</ThemedText>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.SUCCESS }} />
              <ThemedText style={{ fontSize: 13, color: colors.SUCCESS, fontWeight: '600' }}>Connected</ThemedText>
            </View>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <ThemedText style={{ fontSize: 13, color: colors.TEXT_SECONDARY }}>Battery</ThemedText>
            <ThemedText style={{ fontSize: 13, color: colors.TEXT_PRIMARY, fontWeight: '600' }}>{child.band.battery}%</ThemedText>
          </View>
          <View style={{ height: 6, backgroundColor: colors.BG_TERTIARY, borderRadius: 3, marginTop: 8, overflow: 'hidden' }}>
            <View style={{ width: `${child.band.battery}%`, height: '100%', backgroundColor: colors.ACCENT_TEAL }} />
          </View>
        </GlassCard>

        {/* Info Grid */}
        <GlassCard style={{ padding: 16, marginBottom: 20 }}>
          <ThemedText weight="bold" style={{ fontSize: 16, color: colors.TEXT_PRIMARY, marginBottom: 16 }}>Details</ThemedText>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
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
        <GlassCard style={{ padding: 16, marginBottom: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <ThemedText weight="bold" style={{ fontSize: 16, color: colors.TEXT_PRIMARY }}>Safe Zones</ThemedText>
            <TouchableOpacity onPress={() => router.push('/(tabs)/map')}>
              <ThemedText style={{ fontSize: 13, color: colors.ACCENT_TEAL, fontWeight: '600' }}>Manage →</ThemedText>
            </TouchableOpacity>
          </View>
          {child.safeZones.map(zone => (
            <View key={zone.id} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.BORDER }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: zone.color }} />
                <ThemedText style={{ fontSize: 14, color: colors.TEXT_PRIMARY }}>{zone.name}</ThemedText>
              </View>
              <ThemedText style={{ fontSize: 12, color: colors.TEXT_SECONDARY }}>{zone.radius}m</ThemedText>
            </View>
          ))}
        </GlassCard>

        {/* Quick Actions */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 8 }}>
          {[
            { icon: 'pulse', label: 'Health', route: '/(tabs)/health' },
            { icon: 'notifications', label: 'Alerts', route: '/(tabs)/alerts' },
            { icon: 'map', label: 'Map', route: '/(tabs)/map' }
          ].map((action, i) => (
            <TouchableOpacity key={i} onPress={() => router.push(action.route as any)} style={{ alignItems: 'center', flex: 1 }}>
              <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: colors.BG_SECONDARY, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: colors.BORDER, marginBottom: 8 }}>
                <Ionicons name={action.icon as any} size={24} color={colors.ACCENT_TEAL} />
              </View>
              <ThemedText style={{ fontSize: 12, color: colors.TEXT_SECONDARY, fontWeight: '600' }}>{action.label}</ThemedText>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>
    </ThemedView>
  );
}