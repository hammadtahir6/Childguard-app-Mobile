import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ThemedText } from '../components/ui/ThemedText';
import { GradientButton } from '../components/ui/GradientButton';
import { Ionicons } from '@expo/vector-icons';

export default function HelpFAQScreen() {
  const router = useRouter();
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }} edges={['top', 'bottom']}>
      <View style={{ padding: 20 }}>
        <Ionicons name="arrow-back" size={24} onPress={() => router.back()} />
        <ThemedText weight="bold" style={{ fontSize: 24, marginTop: 20 }}>Help & FAQ</ThemedText>
        <ThemedText style={{ marginTop: 10 }}>Coming soon in next update!</ThemedText>
        <GradientButton title="Go Back" onPress={() => router.back()} style={{ marginTop: 20 }} />
      </View>
    </SafeAreaView>
  );
}