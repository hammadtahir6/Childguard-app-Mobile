import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useThemeStore } from '../store/themeStore';
import { useToastStore } from '../store/toastStore';
import { ThemedText } from '../components/ui/ThemedText';
import { Ionicons } from '@expo/vector-icons';

export default function QRScanScreen() {
  const router = useRouter();
  const { colors } = useThemeStore();
  const { showToast } = useToastStore();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanning, setScanning] = useState(true);

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    if (!scanning) return;
    setScanning(false);
    
    showToast('QR Code scanned!', 'success');
    
    // Process the QR code data (band ID or child ID)
    console.log('Scanned QR:', data);
    
    // Navigate based on QR data - for demo, just go to pair-band
    setTimeout(() => {
      // Extract child ID from QR data if present
      const childId = data.split(':')[1] || '';
      if (childId) {
        router.replace(`/pair-band?childId=${childId}`);
      } else {
        router.back();
      }
    }, 1000);
  };

  if (!permission) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.BG_PRIMARY, justifyContent: 'center', alignItems: 'center' }}>
        <ThemedText>Requesting camera permission...</ThemedText>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.BG_PRIMARY, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
        <Ionicons name="camera-outline" size={80} color={colors.TEXT_SECONDARY} />
        <ThemedText weight="bold" style={{ fontSize: 20, color: colors.TEXT_PRIMARY, marginTop: 20, marginBottom: 8 }}>
          Camera Permission Required
        </ThemedText>
        <ThemedText style={{ fontSize: 14, color: colors.TEXT_SECONDARY, textAlign: 'center', marginBottom: 24 }}>
          We need camera access to scan QR codes on bands
        </ThemedText>
        <TouchableOpacity 
          onPress={requestPermission}
          style={{ backgroundColor: colors.ACCENT_TEAL, paddingVertical: 14, paddingHorizontal: 32, borderRadius: 14 }}
        >
          <ThemedText weight="bold" style={{ color: '#FFF', fontSize: 16 }}>Grant Permission</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 16 }}>
          <ThemedText style={{ color: colors.TEXT_SECONDARY }}>Cancel</ThemedText>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }} edges={['top', 'bottom']}>
      <View style={{ flex: 1 }}>
        <CameraView
          style={{ flex: 1 }}
          facing="back"
          onBarcodeScanned={scanning ? handleBarCodeScanned : undefined}
          barcodeScannerSettings={{
            barcodeTypes: ['qr', 'pdf417'],
          }}
        />
        
        {/* Overlay */}
        <View style={StyleSheet.absoluteFillObject}>
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ width: 250, height: 250, borderWidth: 3, borderColor: colors.ACCENT_TEAL, borderRadius: 20 }} />
            <ThemedText weight="bold" style={{ fontSize: 16, color: '#FFF', marginTop: 20 }}>
              Scan Band QR Code
            </ThemedText>
            <ThemedText style={{ fontSize: 14, color: '#FFF', marginTop: 8, opacity: 0.8 }}>
              Position the QR code within the frame
            </ThemedText>
          </View>
        </View>

        {/* Header */}
        <View style={{ position: 'absolute', top: 50, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20 }}>
          <TouchableOpacity onPress={() => router.back()} style={{ padding: 8 }}>
            <Ionicons name="close" size={32} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Bottom Controls */}
        <View style={{ padding: 24, paddingBottom: 40 }}>
          <TouchableOpacity 
            onPress={() => router.push('/pair-band')}
            style={{ backgroundColor: colors.ACCENT_TEAL, paddingVertical: 16, borderRadius: 14, alignItems: 'center' }}
          >
            <ThemedText weight="bold" style={{ color: '#FFF', fontSize: 16 }}>Enter Code Manually</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}