import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import { ThemedText } from '../components/ui/ThemedText';
import { ThemedView } from '../components/ui/ThemedView';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function QRScan() {
  const router = useRouter();
  const [scanned, setScanned] = useState(false);

  // Simulate scan after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setScanned(true);
      // In a real app, this would pass the scanned code back
      setTimeout(() => router.back(), 1000);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemedView style={styles.container}>
      <View style={styles.viewfinder}>
        <View style={[styles.corner, { top: 0, left: 0, borderTopWidth: 4, borderLeftWidth: 4, borderColor: '#00D4AA' }]} />
        <View style={[styles.corner, { top: 0, right: 0, borderTopWidth: 4, borderRightWidth: 4, borderColor: '#00D4AA' }]} />
        <View style={[styles.corner, { bottom: 0, left: 0, borderBottomWidth: 4, borderLeftWidth: 4, borderColor: '#00D4AA' }]} />
        <View style={[styles.corner, { bottom: 0, right: 0, borderBottomWidth: 4, borderRightWidth: 4, borderColor: '#00D4AA' }]} />
        
        <MotiView 
          from={{ top: '10%' }} 
          animate={{ top: '90%' }} 
          transition={{ type: 'timing', duration: 2000, loop: true }}
          style={styles.laser} 
        />
      </View>

      <View style={styles.bottomContainer}>
        <ThemedText style={styles.instructionText}>
          {scanned ? 'QR Code Scanned!' : 'Align the QR code within the frame'}
        </ThemedText>
      </View>

      <TouchableOpacity 
        onPress={() => router.back()} 
        style={styles.closeButton}
      >
        <Ionicons name="close" size={24} color="#FFF" />
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  viewfinder: { 
    width: width * 0.7, 
    height: width * 0.7, 
    position: 'relative', 
    overflow: 'hidden',
    alignSelf: 'center',
    marginTop: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  corner: { 
    position: 'absolute', 
    width: 30, 
    height: 30 
  },
  laser: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#00D4AA',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 80,
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20
  },
  instructionText: {
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500'
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    left: 24,
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)'
  }
});