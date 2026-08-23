import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useToastStore } from '../store/toastStore';
import { Ionicons } from '@expo/vector-icons';

const COLORS = { success: '#10B981', error: '#EF4444', warning: '#F59E0B', info: '#6366F1' };
const ICONS = { success: 'checkmark-circle', error: 'close-circle', warning: 'warning', info: 'information-circle' };

export default function Toast() {
  const { visible, message, type } = useToastStore();
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start();
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(fadeAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
          Animated.timing(translateY, { toValue: 20, duration: 300, useNativeDriver: true }),
        ]).start();
      }, 2700);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, { bottom: insets.bottom + 90, backgroundColor: COLORS[type], opacity: fadeAnim, transform: [{ translateY }] }]}>
      <Ionicons name={ICONS[type] as any} size={20} color="#FFF" />
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute', left: 20, right: 20, flexDirection: 'row', alignItems: 'center', gap: 10,
    padding: 16, borderRadius: 14, shadowColor: '#000', shadowOpacity: 0.4, shadowRadius: 8, elevation: 6, zIndex: 9999,
  },
  text: { color: '#FFF', fontSize: 14, fontWeight: '600', flex: 1 },
});