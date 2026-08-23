import React from 'react';
import { View } from 'react-native';
import { ThemedText } from './ui/ThemedText'; // Fixed path
import { useThemeStore } from '../store/themeStore'; // Fixed path
import { Ionicons } from '@expo/vector-icons';

interface LastSyncedProps {
  lastSynced: Date;
}

export default function LastSynced({ lastSynced }: LastSyncedProps) {
  const { colors } = useThemeStore();
  const timeAgo = Math.floor((Date.now() - lastSynced.getTime()) / 60000);
  const text = timeAgo < 1 ? 'Just now' : `${timeAgo} min ago`;

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
      <Ionicons name="sync" size={14} color={colors.TEXT_SECONDARY} />
      <ThemedText style={{ fontSize: 11, color: colors.TEXT_SECONDARY }}>
        Last synced {text}
      </ThemedText>
    </View>
  );
}