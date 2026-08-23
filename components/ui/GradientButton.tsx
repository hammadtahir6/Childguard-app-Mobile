import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeStore } from '../../store/themeStore';
import { MotiView } from 'moti';

export const GradientButton = ({ title, onPress, loading, style }: any) => {
  const { colors } = useThemeStore();
  return (
    <MotiView from={{ scale: 1 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 15 }}>
      <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={[styles.container, style]}>
        <LinearGradient colors={[colors.ACCENT_TEAL, colors.ACCENT_PURPLE]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.gradient}>
          {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.text}>{title}</Text>}
        </LinearGradient>
      </TouchableOpacity>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  container: { 
    borderRadius: 14, 
    overflow: 'hidden', 
    height: 54,  // Ensure minimum height
    width: '100%', // Full width
    marginTop: 8
  },
  gradient: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    paddingHorizontal: 24 // Add horizontal padding
  },
  text: { 
    color: '#FFF', 
    fontSize: 16, 
    fontWeight: '700', 
    fontFamily: 'Inter_700Bold',
    textAlign: 'center'
  },
});