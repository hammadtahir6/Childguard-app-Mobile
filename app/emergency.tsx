import React, { useEffect, useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions, 
  Animated, 
  Alert,
  ScrollView 
} from 'react-native';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { useToastStore } from '../store/toastStore';

const { width, height } = Dimensions.get('window');

export default function EmergencyScreen() {
  const router = useRouter();
  const { showToast } = useToastStore();
  
  const [timeLeft, setTimeLeft] = useState(45);
  const [isPaused, setIsPaused] = useState(false);
  const [showResolveConfirm, setShowResolveConfirm] = useState(false);
  
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const hapticRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.05, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    ).start();

    hapticRef.current = setInterval(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }, 2000);

    return () => {
      if (hapticRef.current) clearInterval(hapticRef.current);
    };
  }, []);

  useEffect(() => {
    if (isPaused) {
      if (countdownRef.current) clearTimeout(countdownRef.current);
      return;
    }

    if (timeLeft <= 0) {
      showToast('Alerting secondary contact...', 'warning');
      setTimeLeft(45);
      return;
    }

    countdownRef.current = setTimeout(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => {
      if (countdownRef.current) clearTimeout(countdownRef.current);
    };
  }, [timeLeft, isPaused]);

  const handlePause = () => {
    const newPausedState = !isPaused;
    setIsPaused(newPausedState);
    
    if (newPausedState) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      showToast('⏸ Escalation Paused', 'info');
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      showToast('▶ Escalation Resumed', 'warning');
    }
  };

  const handleResolve = () => {
    if (!showResolveConfirm) {
      setShowResolveConfirm(true);
      return;
    }
    
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    showToast('✅ Alert Resolved — Stay Safe!', 'success');
    
    if (hapticRef.current) clearInterval(hapticRef.current);
    if (countdownRef.current) clearTimeout(countdownRef.current);
    
    setTimeout(() => router.replace('/(tabs)'), 500);
  };

  const handleDismiss = () => {
    Alert.alert(
      'Leave Emergency Screen?',
      'The emergency alert is still active. Are you sure?',
      [
        { text: 'Stay', style: 'cancel' },
        { 
          text: 'Leave', 
          style: 'destructive',
          onPress: () => {
            if (hapticRef.current) clearInterval(hapticRef.current);
            if (countdownRef.current) clearTimeout(countdownRef.current);
            router.replace('/(tabs)');
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Close Button */}
      <TouchableOpacity onPress={handleDismiss} style={styles.closeButton}>
        <Ionicons name="close" size={24} color="#FFF" />
      </TouchableOpacity>

      {/* Pulsing Background */}
      <Animated.View style={[styles.bgPulse, { transform: [{ scale: pulseAnim }] }]} />
      
      {/* Flashing Banner */}
      <MotiView
        from={{ opacity: 1 }}
        animate={{ opacity: 0.4 }}
        transition={{ type: 'timing', duration: 500, loop: true }}
        style={styles.banner}
      >
        <Text style={styles.bannerText}>🚨 EMERGENCY 🚨</Text>
      </MotiView>

      {/* Scrollable Content */}
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Child Info */}
        <View style={styles.childInfo}>
          <MotiView
            from={{ scale: 1 }}
            animate={{ scale: 1.15 }}
            transition={{ type: 'timing', duration: 500, loop: true }}
            style={styles.avatarRing}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>SA</Text>
            </View>
          </MotiView>
          <Text style={styles.childName}>Sara Ahmed</Text>
          <Text style={styles.childStatus}>needs help right now</Text>
        </View>

        {/* Alert Type */}
        <View style={styles.alertType}>
          <Ionicons name="alert-circle" size={50} color="#FFF" />
          <Text style={styles.alertTitle}>FALL DETECTED</Text>
          <Text style={styles.alertTime}>Detected at 3:45 PM — 2 min ago</Text>
        </View>

        {/* Vitals */}
        <View style={styles.vitalsStrip}>
          <View style={styles.vitalCard}>
            <Ionicons name="heart" size={20} color="#FFF" />
            <Text style={styles.vitalText}>145 BPM</Text>
          </View>
          <View style={styles.vitalCard}>
            <Ionicons name="pulse" size={20} color="#FFF" />
            <Text style={styles.vitalText}>96%</Text>
          </View>
          <View style={styles.vitalCard}>
            <Ionicons name="thermometer" size={20} color="#FFF" />
            <Text style={styles.vitalText}>36.9°C</Text>
          </View>
        </View>

        {/* Escalation Section */}
        <View style={styles.escalation}>
          <Text style={[styles.escalationText, isPaused && styles.pausedText]}>
            {isPaused ? '⏸ ESCALATION PAUSED' : `Alerting Fatima Khan (Mother) in: ${timeLeft}s`}
          </Text>
          
          <View style={styles.progressBarBg}>
            <View 
              style={[
                styles.progressBarFill, 
                { 
                  width: `${(timeLeft / 45) * 100}%`,
                  backgroundColor: isPaused ? '#F59E0B' : '#EF4444'
                }
              ]} 
            />
          </View>
          
          <TouchableOpacity 
            onPress={handlePause} 
            style={styles.pauseButton}
            activeOpacity={0.7}
          >
            <Ionicons 
              name={isPaused ? 'play-circle' : 'pause-circle'} 
              size={18} 
              color="#FFF" 
            />
            <Text style={styles.pauseButtonText}>
              {isPaused ? 'Resume Escalation' : "Stop — I'm handling this"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity style={[styles.btn, styles.btnCall]} activeOpacity={0.8}>
            <Ionicons name="call" size={20} color="#EF4444" />
            <Text style={[styles.btnText, { color: '#EF4444' }]}>CALL CHILD NOW</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.btn, styles.btnOutline]} activeOpacity={0.8}>
            <Ionicons name="shield" size={20} color="#FFF" />
            <Text style={styles.btnText}>CALL POLICE — 15</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.btn, styles.btnOutline]} activeOpacity={0.8}>
            <Ionicons name="medical" size={20} color="#FFF" />
            <Text style={styles.btnText}>CALL RESCUE — 1122</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.btn, styles.btnResolve]} 
            onPress={handleResolve} 
            activeOpacity={0.8}
          >
            <Ionicons name={showResolveConfirm ? 'checkmark-circle' : 'shield-checkmark'} size={24} color="#FFF" />
            <Text style={[styles.btnText, { color: '#FFF', fontWeight: '800' }]}>
              {showResolveConfirm ? 'CONFIRM RESOLVE' : 'I AM WITH MY CHILD'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#0A0000',
    paddingTop: 60 
  },
  closeButton: { 
    position: 'absolute', 
    top: 50, 
    right: 20, 
    zIndex: 100, 
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20 
  },
  bgPulse: { 
    position: 'absolute', 
    top: 0, left: 0, right: 0, bottom: 0, 
    backgroundColor: '#2D0000', 
    zIndex: -1 
  },
  banner: { 
    alignSelf: 'center', 
    paddingVertical: 10, 
    paddingHorizontal: 24, 
    borderRadius: 10, 
    backgroundColor: '#EF4444',
    marginTop: 20,
    shadowColor: '#EF4444', 
    shadowOpacity: 0.8, 
    shadowRadius: 20, 
    elevation: 10 
  },
  bannerText: { 
    color: '#FFF', 
    fontSize: 26, 
    fontWeight: '900', 
    letterSpacing: 2 
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40
  },
  childInfo: { alignItems: 'center', marginTop: 20 },
  avatarRing: { 
    width: 100, height: 100, borderRadius: 50, 
    justifyContent: 'center', alignItems: 'center', 
    borderWidth: 4, borderColor: '#EF4444', 
    marginBottom: 16 
  },
  avatar: { 
    width: 80, height: 80, borderRadius: 40, 
    backgroundColor: '#EF4444', 
    justifyContent: 'center', alignItems: 'center' 
  },
  avatarText: { color: '#FFF', fontSize: 32, fontWeight: 'bold' },
  childName: { color: '#FFF', fontSize: 26, fontWeight: 'bold' },
  childStatus: { color: '#FFAAAA', fontSize: 16, marginTop: 6 },
  alertType: { alignItems: 'center', marginTop: 20 },
  alertTitle: { 
    color: '#FFF', fontSize: 26, fontWeight: '900', 
    letterSpacing: 2, marginTop: 12 
  },
  alertTime: { color: '#FFAAAA', fontSize: 14, marginTop: 6 },
  vitalsStrip: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: 25 
  },
  vitalCard: { 
    flex: 1, 
    backgroundColor: '#2D0000', 
    padding: 12, 
    borderRadius: 12, 
    alignItems: 'center', 
    marginHorizontal: 4, 
    borderWidth: 1, 
    borderColor: '#EF444440' 
  },
  vitalText: { color: '#FFF', fontSize: 14, fontWeight: 'bold', marginTop: 6 },
  escalation: { marginTop: 20, alignItems: 'center' },
  escalationText: { 
    color: '#FFAAAA', 
    fontSize: 14, 
    marginBottom: 10, 
    fontWeight: '600',
    textAlign: 'center'
  },
  pausedText: {
    color: '#F59E0B',
    fontSize: 16,
    fontWeight: 'bold'
  },
  progressBarBg: { 
    width: '100%', 
    height: 8, 
    backgroundColor: '#2D0000', 
    borderRadius: 4, 
    overflow: 'hidden' 
  },
  progressBarFill: { 
    height: '100%', 
    backgroundColor: '#EF4444' 
  },
  pauseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 14,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20
  },
  pauseButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600'
  },
  actions: { 
    gap: 12, 
    marginTop: 25,
    marginBottom: 20
  },
  btn: { 
    height: 56, 
    borderRadius: 14, 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    gap: 10 
  },
  btnCall: { backgroundColor: '#FFF' },
  btnOutline: { 
    backgroundColor: 'transparent', 
    borderWidth: 2, 
    borderColor: '#EF4444' 
  },
  btnResolve: { backgroundColor: '#10B981', marginTop: 8 },
  btnText: { fontSize: 15, fontWeight: '700', letterSpacing: 0.5 },
});