import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ThemedText } from '../components/ui/ThemedText';
import { GlassCard } from '../components/ui/GlassCard';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '../store/themeStore';

export default function PlaceholderScreen({ title, description }: { title: string; description: string }) {
  const router = useRouter();
  const { colors } = useThemeStore();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.BG_PRIMARY }} edges={['top', 'bottom']}>
      <View style={{ padding: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
          <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, marginRight: 8 }}>
            <Ionicons name="arrow-back" size={24} color={colors.TEXT_PRIMARY} />
          </TouchableOpacity>
          <ThemedText weight="bold" style={{ fontSize: 24, color: colors.TEXT_PRIMARY }}>
            {title}
          </ThemedText>
        </View>

        <GlassCard style={{ padding: 20, alignItems: 'center' }}>
          <Ionicons name="construct-outline" size={64} color={colors.ACCENT_TEAL} />
          <ThemedText weight="bold" style={{ fontSize: 18, color: colors.TEXT_PRIMARY, marginTop: 16 }}>
            {description}
          </ThemedText>
          <ThemedText style={{ fontSize: 14, color: colors.TEXT_SECONDARY, textAlign: 'center', marginTop: 8 }}>
            This feature will be available in the next update.
          </ThemedText>
        </GlassCard>

        <TouchableOpacity 
          onPress={() => router.back()}
          style={{ marginTop: 24, paddingVertical: 14, borderRadius: 14, backgroundColor: colors.ACCENT_TEAL, alignItems: 'center' }}
        >
          <ThemedText weight="bold" style={{ color: '#FFF', fontSize: 16 }}>Go Back</ThemedText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}