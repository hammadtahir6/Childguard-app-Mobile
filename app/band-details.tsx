import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '../store/themeStore';
import { useChildrenStore } from '../store/childrenStore';
import { useToastStore } from '../store/toastStore';
import { ThemedText } from '../components/ui/ThemedText';
import { GlassCard } from '../components/ui/GlassCard';

export default function BandDetailsScreen() {
  const router = useRouter();
  const { colors } = useThemeStore();
  const { activeChildId, children, disconnectBand } = useChildrenStore();
  const { showToast } = useToastStore();
  
  const activeChild = children.find(c => c.id === activeChildId) || children[0];
  const [signalStrength] = useState(4); // 1-5 scale

  const handleUnpair = () => {
    Alert.alert(
      'Unpair Wristband',
      `This will disconnect the band from ${activeChild.name}'s profile.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Unpair',
          style: 'destructive',
          onPress: () => {
            disconnectBand(activeChild.id);
            showToast('Band disconnected', 'info');
          }
        }
      ]
    );
  };

  const handleRingBand = () => {
    showToast('Ringing band...', 'info');
    // In real app: send command to band via BLE/API
  };

  const handleUpdateFirmware = () => {
    showToast('Checking for updates...', 'info');
    // In real app: check firmware version via API
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.BG_PRIMARY }} edges={['top', 'bottom']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 40, flexGrow: 1 }}>
        
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
          <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, marginRight: 12 }}>
            <Ionicons name="arrow-back" size={24} color={colors.TEXT_PRIMARY} />
          </TouchableOpacity>
          <ThemedText weight="bold" style={{ fontSize: 22, color: colors.TEXT_PRIMARY }}>Band Details</ThemedText>
        </View>

        {/* Band Hero */}
        <GlassCard style={{ padding: 24, alignItems: 'center', marginBottom: 20 }}>
          <View style={{ 
            width: 100, height: 100, borderRadius: 50, 
            backgroundColor: colors.ACCENT_TEAL + '20',
            justifyContent: 'center', alignItems: 'center',
            borderWidth: 3, borderColor: colors.ACCENT_TEAL,
            marginBottom: 16
          }}>
            <Ionicons name="watch" size={50} color={colors.ACCENT_TEAL} />
          </View>
          <ThemedText weight="bold" style={{ fontSize: 20, color: colors.TEXT_PRIMARY, marginBottom: 4 }}>
            ChildGuard Band Pro
          </ThemedText>
          <ThemedText style={{ fontSize: 14, color: colors.TEXT_SECONDARY }}>
            Assigned to {activeChild.name}
          </ThemedText>
          <View style={{ 
            marginTop: 12, paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20,
            backgroundColor: activeChild.band.connected ? colors.SUCCESS + '20' : colors.DANGER + '20',
            flexDirection: 'row', alignItems: 'center', gap: 6
          }}>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: activeChild.band.connected ? colors.SUCCESS : colors.DANGER }} />
            <ThemedText weight="bold" style={{ fontSize: 12, color: activeChild.band.connected ? colors.SUCCESS : colors.DANGER }}>
              {activeChild.band.connected ? 'Connected' : 'Disconnected'}
            </ThemedText>
          </View>
        </GlassCard>

        {/* Band Info */}
        <GlassCard style={{ padding: 20, marginBottom: 20 }}>
          <ThemedText weight="bold" style={{ fontSize: 16, color: colors.TEXT_PRIMARY, marginBottom: 16 }}>Band Information</ThemedText>
          
          <View style={{ gap: 16 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <ThemedText style={{ fontSize: 13, color: colors.TEXT_SECONDARY }}>Band Code</ThemedText>
              <ThemedText font="mono" style={{ fontSize: 14, color: colors.ACCENT_TEAL, fontWeight: '600' }}>CG-2847-XKQP</ThemedText>
            </View>
            
            <View style={{ height: 1, backgroundColor: colors.BORDER }} />
            
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <ThemedText style={{ fontSize: 13, color: colors.TEXT_SECONDARY }}>Firmware</ThemedText>
              <ThemedText style={{ fontSize: 14, color: colors.TEXT_PRIMARY, fontWeight: '600' }}>v1.2.3</ThemedText>
            </View>
            
            <View style={{ height: 1, backgroundColor: colors.BORDER }} />
            
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <ThemedText style={{ fontSize: 13, color: colors.TEXT_SECONDARY }}>Model</ThemedText>
              <ThemedText style={{ fontSize: 14, color: colors.TEXT_PRIMARY, fontWeight: '600' }}>CG-Pro 2024</ThemedText>
            </View>
            
            <View style={{ height: 1, backgroundColor: colors.BORDER }} />
            
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <ThemedText style={{ fontSize: 13, color: colors.TEXT_SECONDARY }}>Last Sync</ThemedText>
              <ThemedText style={{ fontSize: 14, color: colors.TEXT_PRIMARY, fontWeight: '600' }}>5 min ago</ThemedText>
            </View>
          </View>
        </GlassCard>

        {/* Battery Section */}
        <GlassCard style={{ padding: 20, marginBottom: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <ThemedText weight="bold" style={{ fontSize: 16, color: colors.TEXT_PRIMARY }}>Battery Level</ThemedText>
            <ThemedText weight="bold" style={{ fontSize: 18, color: activeChild.band.battery > 20 ? colors.ACCENT_TEAL : colors.DANGER }}>
              {activeChild.band.battery}%
            </ThemedText>
          </View>
          
          <View style={{ height: 12, backgroundColor: colors.BG_TERTIARY, borderRadius: 6, overflow: 'hidden', marginBottom: 8 }}>
            <View style={{ 
              width: `${activeChild.band.battery}%`, 
              height: '100%', 
              backgroundColor: activeChild.band.battery > 20 ? colors.ACCENT_TEAL : colors.DANGER,
              borderRadius: 6
            }} />
          </View>
          
          <ThemedText style={{ fontSize: 12, color: colors.TEXT_SECONDARY }}>
            {activeChild.band.battery > 50 ? 'Battery is healthy' : 
             activeChild.band.battery > 20 ? 'Consider charging soon' : 
             'Low battery - Charge immediately'}
          </ThemedText>
        </GlassCard>

        {/* Signal Strength */}
        <GlassCard style={{ padding: 20, marginBottom: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <ThemedText weight="bold" style={{ fontSize: 16, color: colors.TEXT_PRIMARY }}>Signal Strength</ThemedText>
            <ThemedText style={{ fontSize: 14, color: colors.TEXT_SECONDARY }}>{signalStrength}/5</ThemedText>
          </View>
          
          <View style={{ flexDirection: 'row', gap: 6, alignItems: 'flex-end', height: 40 }}>
            {[1, 2, 3, 4, 5].map((level) => (
              <View 
                key={level}
                style={{ 
                  width: 12, 
                  height: level * 8, 
                  backgroundColor: level <= signalStrength ? colors.ACCENT_TEAL : colors.BG_TERTIARY,
                  borderRadius: 2
                }} 
              />
            ))}
          </View>
        </GlassCard>

        {/* Actions */}
        <ThemedText weight="bold" style={{ fontSize: 16, color: colors.TEXT_PRIMARY, marginBottom: 12 }}>Band Actions</ThemedText>
        <View style={{ gap: 12 }}>
          <TouchableOpacity 
            onPress={handleRingBand}
            style={{ 
              flexDirection: 'row', alignItems: 'center', gap: 12,
              padding: 16, borderRadius: 14,
              backgroundColor: colors.BG_SECONDARY,
              borderWidth: 1, borderColor: colors.BORDER
            }}
          >
            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.ACCENT_TEAL + '20', justifyContent: 'center', alignItems: 'center' }}>
              <Ionicons name="musical-notes" size={20} color={colors.ACCENT_TEAL} />
            </View>
            <View style={{ flex: 1 }}>
              <ThemedText weight="semibold" style={{ fontSize: 15, color: colors.TEXT_PRIMARY }}>Ring Band</ThemedText>
              <ThemedText style={{ fontSize: 12, color: colors.TEXT_SECONDARY }}>Help locate the wristband</ThemedText>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.TEXT_SECONDARY} />
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={handleUpdateFirmware}
            style={{ 
              flexDirection: 'row', alignItems: 'center', gap: 12,
              padding: 16, borderRadius: 14,
              backgroundColor: colors.BG_SECONDARY,
              borderWidth: 1, borderColor: colors.BORDER
            }}
          >
            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#6366F1' + '20', justifyContent: 'center', alignItems: 'center' }}>
              <Ionicons name="download" size={20} color="#6366F1" />
            </View>
            <View style={{ flex: 1 }}>
              <ThemedText weight="semibold" style={{ fontSize: 15, color: colors.TEXT_PRIMARY }}>Update Firmware</ThemedText>
              <ThemedText style={{ fontSize: 12, color: colors.TEXT_SECONDARY }}>Current: v1.2.3</ThemedText>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.TEXT_SECONDARY} />
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={handleUnpair}
            style={{ 
              flexDirection: 'row', alignItems: 'center', gap: 12,
              padding: 16, borderRadius: 14,
              backgroundColor: colors.DANGER + '10',
              borderWidth: 1, borderColor: colors.DANGER
            }}
          >
            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.DANGER + '20', justifyContent: 'center', alignItems: 'center' }}>
              <Ionicons name="unlink" size={20} color={colors.DANGER} />
            </View>
            <View style={{ flex: 1 }}>
              <ThemedText weight="semibold" style={{ fontSize: 15, color: colors.DANGER }}>Unpair Band</ThemedText>
              <ThemedText style={{ fontSize: 12, color: colors.TEXT_SECONDARY }}>Disconnect from profile</ThemedText>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.DANGER} />
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}