import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MotiView } from 'moti';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '../store/themeStore';
import { useChildrenStore } from '../store/childrenStore';
import { ThemedText } from '../components/ui/ThemedText';

const { width, height } = Dimensions.get('window');

export default function CallChildScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { colors } = useThemeStore();
  const { activeChildId, children } = useChildrenStore();
  
  const activeChild = children.find(c => c.id === activeChildId) || children[0];
  
  const [callStatus, setCallStatus] = useState<'calling' | 'connected'>('calling');
  const [seconds, setSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  
  // FIX 1: Changed NodeJS.Timeout to ReturnType<typeof setInterval>
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Simulate connection after 2.5 seconds
  useEffect(() => {
    const connectTimeout = setTimeout(() => {
      setCallStatus('connected');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    }, 2500);

    return () => {
      clearTimeout(connectTimeout);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const endCall = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (timerRef.current) clearInterval(timerRef.current);
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F172A' }} edges={['top', 'bottom']}>
      <View style={styles.container}>
        
        {/* Background Gradient Effect */}
        <View style={styles.bgGlow} />

        {/* Top Section: Avatar & Info */}
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <MotiView
            from={{ scale: 1 }}
            animate={{ scale: callStatus === 'calling' ? 1.15 : 1 }}
            transition={{ type: 'timing', duration: 1000, loop: callStatus === 'calling' }}
            style={styles.avatarContainer}
          >
            <View style={styles.avatar}>
              <ThemedText style={{ fontSize: 48, fontWeight: 'bold', color: '#FFF' }}>
                {activeChild.name.charAt(0)}
              </ThemedText>
            </View>
          </MotiView>

          <ThemedText weight="bold" style={{ fontSize: 32, color: '#FFF', marginTop: 32 }}>
            {activeChild.name}
          </ThemedText>
          
          <ThemedText style={{ fontSize: 18, color: '#94A3B8', marginTop: 8 }}>
            {callStatus === 'calling' ? 'Calling band...' : formatTime(seconds)}
          </ThemedText>
          
          {callStatus === 'connected' && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#10B981' }} />
              <ThemedText style={{ fontSize: 14, color: '#10B981', fontWeight: '600' }}>Connected via LTE</ThemedText>
            </View>
          )}
        </View>

        {/* Bottom Section: Controls */}
        <View style={styles.controlsContainer}>
          <View style={styles.controlsRow}>
            {/* Mute Button */}
            <TouchableOpacity 
              onPress={() => { setIsMuted(!isMuted); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
              style={[styles.controlBtn, isMuted && { backgroundColor: '#FFF' }]}
            >
              <Ionicons name={isMuted ? 'mic-off' : 'mic'} size={28} color={isMuted ? '#0F172A' : '#FFF'} />
              <ThemedText style={{ fontSize: 12, color: isMuted ? '#0F172A' : '#CBD5E1', marginTop: 8, fontWeight: '600' }}>Mute</ThemedText>
            </TouchableOpacity>

            {/* Speaker Button */}
            <TouchableOpacity 
              onPress={() => { setIsSpeakerOn(!isSpeakerOn); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
              style={[styles.controlBtn, isSpeakerOn && { backgroundColor: '#FFF' }]}
            >
              <Ionicons name={isSpeakerOn ? 'volume-high' : 'volume-medium'} size={28} color={isSpeakerOn ? '#0F172A' : '#FFF'} />
              <ThemedText style={{ fontSize: 12, color: isSpeakerOn ? '#0F172A' : '#CBD5E1', marginTop: 8, fontWeight: '600' }}>Speaker</ThemedText>
            </TouchableOpacity>
          </View>

          {/* End Call Button */}
          <TouchableOpacity 
            onPress={endCall}
            activeOpacity={0.8}
            style={styles.endCallBtn}
          >
            <Ionicons name="call" size={36} color="#FFF" style={{ transform: [{ rotate: '135deg' }] }} />
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'space-between', paddingBottom: 40 },
  // FIX 2: Replaced invalid 'blurRadius' with valid React Native shadow properties for the glow effect
  bgGlow: {
    position: 'absolute', 
    top: '20%', 
    left: '50%', 
    width: 300, 
    height: 300, 
    borderRadius: 150,
    backgroundColor: 'rgba(0, 212, 170, 0.15)',
    shadowColor: '#00D4AA',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 100,
    elevation: 20,
  },
  avatarContainer: {
    width: 140, height: 140, borderRadius: 70,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 3, borderColor: 'rgba(255,255,255,0.2)',
  },
  avatar: {
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: '#00D4AA',
    justifyContent: 'center', alignItems: 'center',
  },
  controlsContainer: { alignItems: 'center', gap: 40 },
  controlsRow: { flexDirection: 'row', gap: 60 },
  controlBtn: { alignItems: 'center', width: 70 },
  endCallBtn: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: '#EF4444',
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#EF4444', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4, shadowRadius: 12, elevation: 10,
  },
});