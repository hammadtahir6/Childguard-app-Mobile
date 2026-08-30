import React from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useThemeStore } from '../store/themeStore';
import { useChildrenStore } from '../store/childrenStore';
import { ThemedText } from '../components/ui/ThemedText';
import { GlassCard } from '../components/ui/GlassCard';
import { Ionicons } from '@expo/vector-icons';

export default function BandDetailsScreen() {
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
        <Ionicons name="watch-outline" size={80} color={colors.TEXT_SECONDARY} />
        <ThemedText style={{ fontSize: 16, color: colors.TEXT_SECONDARY, marginTop: 16 }}>
          No band paired
        </ThemedText>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 24 }}>
          <ThemedText style={{ color: colors.ACCENT_TEAL, fontSize: 16 }}>Go Back</ThemedText>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // ✅ SAFE: Get band data with fallbacks using optional chaining and nullish coalescing
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
            Band Details
          </ThemedText>
        </View>

        {/* Band Info Card */}
        <GlassCard style={{ padding: 20, marginBottom: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <View style={{ 
              width: 60, height: 60, borderRadius: 30, 
              backgroundColor: colors.ACCENT_TEAL,
              justifyContent: 'center', alignItems: 'center',
              marginRight: 16
            }}>
              <Ionicons name="watch" size={32} color="#FFF" />
            </View>
            <View>
              <ThemedText weight="bold" style={{ fontSize: 18, color: colors.TEXT_PRIMARY }}>
                ChildGuard Band
              </ThemedText>
              <ThemedText style={{ fontSize: 14, color: colors.TEXT_SECONDARY }}>
                Code: {bandCode}
              </ThemedText>
            </View>
          </View>

          {/* Connection Status */}
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
          
          {/* Battery */}
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
        </GlassCard>

        {/* Quick Actions */}
        <ThemedText weight="bold" style={{ fontSize: 16, color: colors.TEXT_PRIMARY, marginBottom: 12 }}>
          Band Controls
        </ThemedText>
        <View style={{ gap: 12 }}>
          <TouchableOpacity 
            style={{ 
              flexDirection: 'row', alignItems: 'center', gap: 12,
              backgroundColor: colors.BG_SECONDARY, borderRadius: 14, padding: 16 
            }}
            onPress={() => {}}
          >
            <Ionicons name="musical-notes" size={24} color={colors.ACCENT_TEAL} />
            <View style={{ flex: 1 }}>
              <ThemedText weight="bold" style={{ fontSize: 14, color: colors.TEXT_PRIMARY }}>
                Ring Band
              </ThemedText>
              <ThemedText style={{ fontSize: 12, color: colors.TEXT_SECONDARY }}>
                Make the band beep to help locate it
              </ThemedText>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.TEXT_SECONDARY} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={{ 
              flexDirection: 'row', alignItems: 'center', gap: 12,
              backgroundColor: colors.BG_SECONDARY, borderRadius: 14, padding: 16 
            }}
            onPress={() => {}}
          >
            <Ionicons name="refresh" size={24} color={colors.WARNING} />
            <View style={{ flex: 1 }}>
              <ThemedText weight="bold" style={{ fontSize: 14, color: colors.TEXT_PRIMARY }}>
                Refresh Location
              </ThemedText>
              <ThemedText style={{ fontSize: 12, color: colors.TEXT_SECONDARY }}>
                Get the latest GPS coordinates
              </ThemedText>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.TEXT_SECONDARY} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={{ 
              flexDirection: 'row', alignItems: 'center', gap: 12,
              backgroundColor: colors.DANGER + '20', borderRadius: 14, padding: 16,
              borderWidth: 1, borderColor: colors.DANGER
            }}
            onPress={() => {}}
          >
            <Ionicons name="unlink" size={24} color={colors.DANGER} />
            <View style={{ flex: 1 }}>
              <ThemedText weight="bold" style={{ fontSize: 14, color: colors.DANGER }}>
                Unpair Band
              </ThemedText>
              <ThemedText style={{ fontSize: 12, color: colors.TEXT_SECONDARY }}>
                Remove this band from your account
              </ThemedText>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.TEXT_SECONDARY} />
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}