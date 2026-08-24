import React from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '../store/themeStore';
import { ThemedText } from '../components/ui/ThemedText';
import { GlassCard } from '../components/ui/GlassCard';

// REALISTIC MOCK DATA (Only things sensors can actually detect)
const ACTIVITY_DATA = [
  { time: '2:30 PM', title: 'Entered Home Zone', location: 'Home (GPS Trigger)', icon: 'home', color: '#10B981' },
  { time: '2:00 PM', title: 'Left School Zone', location: 'Beacon House (GPS Trigger)', icon: 'school', color: '#3B82F6' },
  { time: '11:15 AM', title: 'High Heart Rate Detected', location: 'School Zone (142 BPM)', icon: 'heart', color: '#EF4444' },
  { time: '8:15 AM', title: 'Entered School Zone', location: 'Beacon House (GPS Trigger)', icon: 'checkmark-circle', color: '#10B981' },
  { time: '7:52 AM', title: 'Left Home Zone', location: 'Home (GPS Trigger)', icon: 'walk', color: '#00D4AA' },
  { time: '7:30 AM', title: 'Band Synced & Connected', location: 'Home (Bluetooth)', icon: 'bluetooth', color: '#6B7280' },
];

export default function ActivityScreen() {
  const router = useRouter();
  const { colors } = useThemeStore();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.BG_PRIMARY }} edges={['top', 'bottom']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 40, flexGrow: 1 }}>
        
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
          <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, marginRight: 12 }}>
            <Ionicons name="arrow-back" size={24} color={colors.TEXT_PRIMARY} />
          </TouchableOpacity>
          <ThemedText weight="bold" style={{ fontSize: 22, color: colors.TEXT_PRIMARY }}>Today's Activity</ThemedText>
        </View>

        {/* Timeline */}
        <View style={{ paddingLeft: 10 }}>
          {ACTIVITY_DATA.map((item, index) => (
            <View key={index} style={{ flexDirection: 'row', marginBottom: index === ACTIVITY_DATA.length - 1 ? 0 : 24 }}>
              {/* Timeline Line & Dot */}
              <View style={{ alignItems: 'center', marginRight: 16 }}>
                <View style={{ 
                  width: 36, height: 36, borderRadius: 18, 
                  backgroundColor: item.color + '20', 
                  justifyContent: 'center', alignItems: 'center',
                  borderWidth: 2, borderColor: item.color,
                  zIndex: 2
                }}>
                  <Ionicons name={item.icon as any} size={18} color={item.color} />
                </View>
                {index < ACTIVITY_DATA.length - 1 && (
                  <View style={{ width: 2, flex: 1, backgroundColor: colors.BORDER, marginTop: 8 }} />
                )}
              </View>

              {/* Content */}
              <View style={{ flex: 1, paddingTop: 6 }}>
                <GlassCard style={{ padding: 14 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <ThemedText weight="bold" style={{ fontSize: 15, color: colors.TEXT_PRIMARY }}>{item.title}</ThemedText>
                    <ThemedText style={{ fontSize: 12, color: colors.TEXT_SECONDARY, fontWeight: '600' }}>{item.time}</ThemedText>
                  </View>
                  <ThemedText style={{ fontSize: 12, color: colors.TEXT_SECONDARY }}>{item.location}</ThemedText>
                </GlassCard>
              </View>
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}