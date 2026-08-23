import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { useThemeStore } from '../store/themeStore';

// Reusable Shimmer Block
function ShimmerBlock({ width, height, borderRadius = 8 }: { width: string | number; height: number; borderRadius?: number }) {
  const { colors } = useThemeStore();
  return (
    <MotiView
      from={{ opacity: 0.3 }}
      animate={{ opacity: 0.7 }}
      transition={{ type: 'timing', duration: 1000, loop: true }}
      // Cast to 'any' to bypass strict TypeScript DimensionValue union checks
      style={[{ width, height, borderRadius, backgroundColor: colors.BG_TERTIARY } as any]}
    />
  );
}

export function SkeletonText({ lines = 1 }: { lines?: number }) {
  return (
    <View style={{ gap: 8 }}>
      {Array.from({ length: lines }).map((_, i) => (
        <ShimmerBlock key={i} width={i === lines - 1 ? '70%' : '100%'} height={16} />
      ))}
    </View>
  );
}

export function SkeletonCard() {
  return (
    <View style={{ padding: 16, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.02)', marginBottom: 12 }}>
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <ShimmerBlock width={44} height={44} borderRadius={22} />
        <View style={{ flex: 1, gap: 8 }}>
          <ShimmerBlock width="60%" height={16} />
          <ShimmerBlock width="100%" height={12} />
          <ShimmerBlock width="40%" height={12} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Styles are now handled inline to avoid TS conflicts
});