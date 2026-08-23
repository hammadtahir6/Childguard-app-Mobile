import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { ThemedText } from './ui/ThemedText';
import { useThemeStore } from '../store/themeStore';
import { Ionicons } from '@expo/vector-icons';

export default function OfflineBanner() {
  const { colors } = useThemeStore();
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOffline(!state.isConnected);
    });
    return () => unsubscribe();
  }, []);

  if (!isOffline) return null;

  return (
    <View style={[styles.container, { backgroundColor: colors.DANGER }]}>
      {/* Changed to a valid Ionicon name */}
      <Ionicons name="alert-circle-outline" size={18} color="#FFF" />
      <ThemedText style={styles.text}>No Internet Connection</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 8,
  },
  text: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600',
  },
});