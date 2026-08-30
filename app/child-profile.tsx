import React from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useThemeStore } from '../store/themeStore';
import { useChildrenStore } from '../store/childrenStore';
import { ThemedText } from '../components/ui/ThemedText';
import { GlassCard } from '../components/ui/GlassCard';
import { Ionicons } from '@expo/vector-icons';

export default function ChildProfileScreen() {
  const router = useRouter();
  const { colors } = useThemeStore();
  const { children, activeChildId } = useChildrenStore();
  
  // ✅ SAFE: Find active child with fallback
  const activeChild = children.length > 0 
    ? (children.find(c => c.id === activeChildId) || children[0])
    : null;

  if (!activeChild) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.BG_PRIMARY, justifyContent: 'center', alignItems: 'center' }}>
        <Ionicons name="person-outline" size={80} color={colors.TEXT_SECONDARY} />
        <ThemedText style={{ fontSize: 16, color: colors.TEXT_SECONDARY, marginTop: 16 }}>
          No child selected
        </ThemedText>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 24 }}>
          <ThemedText style={{ color: colors.ACCENT_TEAL, fontSize: 16 }}>Go Back</ThemedText>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // ✅ SAFE: Get band data with fallbacks using optional chaining
  const band = activeChild.band || {};
  const battery = band.battery ?? 100;
  const isConnected = band.is_connected ?? false;
  const bandCode = band.band_code ?? 'Not paired';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.BG_PRIMARY }} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
          <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, marginRight: 8 }}>
            <Ionicons name="arrow-back" size={24} color={colors.TEXT_PRIMARY} />
          </TouchableOpacity>
          <ThemedText weight="bold" style={{ fontSize: 24, color: colors.TEXT_PRIMARY }}>
            {activeChild.name}'s Profile
          </ThemedText>
        </View>

        {/* Profile Photo & Info */}
        <GlassCard style={{ padding: 20, alignItems: 'center', marginBottom: 20 }}>
          <View style={{ 
            width: 100, height: 100, borderRadius: 50, 
            backgroundColor: colors.ACCENT_TEAL,
            justifyContent: 'center', alignItems: 'center',
            marginBottom: 16
          }}>
            <ThemedText weight="bold" style={{ fontSize: 36, color: '#FFF' }}>
              {activeChild.name.charAt(0)}
            </ThemedText>
          </View>
          <ThemedText weight="bold" style={{ fontSize: 20, color: colors.TEXT_PRIMARY }}>
            {activeChild.name}
          </ThemedText>
          <ThemedText style={{ fontSize: 14, color: colors.TEXT_SECONDARY }}>
            Age {activeChild.age} • {activeChild.gender}
          </ThemedText>
          <View style={{ 
            marginTop: 8, paddingHorizontal: 12, paddingVertical: 4, 
            borderRadius: 12, backgroundColor: colors.SUCCESS + '20' 
          }}>
            <ThemedText style={{ fontSize: 12, fontWeight: 'bold', color: colors.SUCCESS }}>
              {activeChild.status}
            </ThemedText>
          </View>
        </GlassCard>

        {/* Band Status */}
        <ThemedText weight="bold" style={{ fontSize: 16, color: colors.TEXT_PRIMARY, marginBottom: 12 }}>
          Band Status
        </ThemedText>
        <GlassCard style={{ padding: 16, marginBottom: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
            <ThemedText style={{ fontSize: 14, color: colors.TEXT_SECONDARY }}>Connection</ThemedText>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <View style={{ 
                width: 8, height: 8, borderRadius: 4, 
                backgroundColor: isConnected ? colors.SUCCESS : colors.DANGER 
              }} />
              <ThemedText style={{ fontSize: 14, fontWeight: '600', color: isConnected ? colors.SUCCESS : colors.DANGER }}>
                {isConnected ? 'Connected' : 'Disconnected'}
              </ThemedText>
            </View>
          </View>
          
          <View style={{ marginBottom: 12 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
              <ThemedText style={{ fontSize: 14, color: colors.TEXT_SECONDARY }}>Battery</ThemedText>
              <ThemedText style={{ fontSize: 14, fontWeight: '600', color: colors.ACCENT_TEAL }}>
                {battery}%
              </ThemedText>
            </View>
            <View style={{ height: 6, backgroundColor: colors.BG_TERTIARY, borderRadius: 3, overflow: 'hidden' }}>
              <View style={{ width: `${battery}%`, height: '100%', backgroundColor: colors.ACCENT_TEAL }} />
            </View>
          </View>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <ThemedText style={{ fontSize: 14, color: colors.TEXT_SECONDARY }}>Band Code</ThemedText>
            <ThemedText style={{ fontSize: 14, fontWeight: '600', color: colors.TEXT_PRIMARY }}>
              {bandCode}
            </ThemedText>
          </View>
        </GlassCard>

        {/* Quick Actions */}
        <ThemedText weight="bold" style={{ fontSize: 16, color: colors.TEXT_PRIMARY, marginBottom: 12 }}>
          Quick Actions
        </ThemedText>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <TouchableOpacity 
            style={{ flex: 1, backgroundColor: colors.BG_SECONDARY, borderRadius: 14, padding: 16, alignItems: 'center' }}
            onPress={() => router.push('/call-child')}
          >
            <Ionicons name="call" size={24} color={colors.DANGER} style={{ marginBottom: 8 }} />
            <ThemedText style={{ fontSize: 12, color: colors.TEXT_PRIMARY, fontWeight: '600' }}>Call Child</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity 
            style={{ flex: 1, backgroundColor: colors.BG_SECONDARY, borderRadius: 14, padding: 16, alignItems: 'center' }}
            onPress={() => {}}
          >
            <Ionicons name="musical-notes" size={24} color={colors.ACCENT_TEAL} style={{ marginBottom: 8 }} />
            <ThemedText style={{ fontSize: 12, color: colors.TEXT_PRIMARY, fontWeight: '600' }}>Ring Band</ThemedText>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}