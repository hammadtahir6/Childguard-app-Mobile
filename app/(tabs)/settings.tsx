import React, { useEffect, useState } from 'react';
import { View, ScrollView, Switch, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '../../components/ui/ThemedText';
import { GlassCard } from '../../components/ui/GlassCard';
import { useThemeStore } from '../../store/themeStore';
import { useChildrenStore } from '../../store/childrenStore';
import { useToastStore } from '../../store/toastStore';
import { useAuthStore } from '../../store/authStore';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../../api/config';

export default function SettingsScreen() {
  const router = useRouter();
  const { colors, mode, toggleTheme } = useThemeStore();
  const { children } = useChildrenStore();
  const { showToast } = useToastStore();
  const { user, logout } = useAuthStore();
  
  const [userData, setUserData] = useState<any>(null);

  // Fetch real user data from backend
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) return;
        
        const response = await axios.get(`${BASE_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, []);

  const handleLogout = () => {
    Alert.alert(
      'Sign Out?',
      'You will need to sign in again to access ChildGuard.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await logout();
            showToast('Signed out successfully', 'info');
            router.replace('/onboarding');
          }
        }
      ]
    );
  };

  // Safe calculation for total zones
  const totalZones = (children || []).reduce((sum, child) => {
    return sum + (child.safeZones?.length || 0);
  }, 0);

  const SettingRow = ({ icon, title, subtitle, onPress, rightElement, iconColor }: any) => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={styles.row}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
        <View style={{ 
          width: 36, height: 36, borderRadius: 10, 
          backgroundColor: (iconColor || colors.ACCENT_TEAL) + '15',
          justifyContent: 'center', alignItems: 'center'
        }}>
          <Ionicons name={icon} size={18} color={iconColor || colors.ACCENT_TEAL} />
        </View>
        <View style={{ flex: 1 }}>
          <ThemedText style={{ fontSize: 15, color: colors.TEXT_PRIMARY, fontWeight: '500' }}>{title}</ThemedText>
          {subtitle && <ThemedText style={{ fontSize: 12, color: colors.TEXT_SECONDARY, marginTop: 2 }}>{subtitle}</ThemedText>}
        </View>
      </View>
      {rightElement || <Ionicons name="chevron-forward" size={20} color={colors.TEXT_SECONDARY} />}
    </TouchableOpacity>
  );

  const Divider = () => <View style={{ height: 1, backgroundColor: colors.BORDER, marginHorizontal: 16 }} />;

  return (
     <SafeAreaView style={{ flex: 1, backgroundColor: colors.BG_PRIMARY }} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 40, flexGrow: 1 }}>
        
        {/* Profile Header Card */}
        <GlassCard style={{ padding: 20, marginBottom: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
            <View style={{ 
              width: 64, height: 64, borderRadius: 32, 
              backgroundColor: colors.ACCENT_TEAL, 
              justifyContent: 'center', alignItems: 'center'
            }}>
              <ThemedText weight="bold" style={{ fontSize: 24, color: '#FFF' }}>
                {(userData?.full_name || user?.full_name || 'U').charAt(0)}
              </ThemedText>
            </View>
            <View style={{ flex: 1 }}>
              <ThemedText weight="bold" style={{ fontSize: 18, color: colors.TEXT_PRIMARY }}>
                {userData?.full_name || user?.full_name || 'Loading...'}
              </ThemedText>
              <ThemedText style={{ fontSize: 13, color: colors.TEXT_SECONDARY, marginTop: 2 }}>
                {userData?.email || user?.email || ''}
              </ThemedText>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
                <Ionicons name="shield-checkmark" size={12} color={colors.SUCCESS} />
                <ThemedText style={{ fontSize: 11, color: colors.SUCCESS, fontWeight: '600' }}>
                  Parent Account
                </ThemedText>
              </View>
            </View>
            <TouchableOpacity 
              onPress={() => router.push('/edit-profile')}
              style={{ padding: 8 }}
            >
              <Ionicons name="create-outline" size={20} color={colors.ACCENT_TEAL} />
            </TouchableOpacity>
          </View>
        </GlassCard>

        {/* ACCOUNT Section */}
        <ThemedText weight="semibold" style={{ fontSize: 12, color: colors.TEXT_SECONDARY, marginBottom: 8, marginLeft: 4, letterSpacing: 1 }}>
          ACCOUNT
        </ThemedText>
        <GlassCard style={{ marginBottom: 20, padding: 0 }}>
          <SettingRow
            icon="person-outline"
            title="Edit Profile"
            subtitle="Name, email, photo, contact"
            onPress={() => router.push('/edit-profile')}
            iconColor={colors.ACCENT_TEAL}
          />
          <Divider />
          <SettingRow
            icon="lock-closed-outline"
            title="Change Password"
            subtitle="Update your security credentials"
            onPress={() => router.push('/change-password')}
            iconColor="#6366F1"
          />
          <Divider />
          <SettingRow
            icon="shield-outline"
            title="Privacy & Security"
            subtitle="Data, permissions, 2FA"
            onPress={() => router.push('/privacy-security')}
            iconColor="#8B5CF6"
          />
        </GlassCard>

        {/* PREFERENCES Section */}
        <ThemedText weight="semibold" style={{ fontSize: 12, color: colors.TEXT_SECONDARY, marginBottom: 8, marginLeft: 4, letterSpacing: 1 }}>
          PREFERENCES
        </ThemedText>
        <GlassCard style={{ marginBottom: 20, padding: 0 }}>
          <SettingRow
            icon="language-outline"
            title="Language"
            subtitle="English"
            onPress={() => router.push('/language-select')}
            iconColor="#3B82F6"
          />
          <Divider />
          <SettingRow
            icon={mode === 'dark' ? 'moon' : 'sunny'}
            title="Dark Mode"
            rightElement={
              <Switch
                value={mode === 'dark'}
                onValueChange={toggleTheme}
                trackColor={{ false: colors.BG_TERTIARY, true: colors.ACCENT_TEAL }}
                thumbColor="#FFF"
              />
            }
            iconColor="#F59E0B"
          />
          <Divider />
          <SettingRow
            icon="notifications-outline"
            title="Notification Preferences"
            subtitle="Control alerts & priorities"
            onPress={() => router.push('/notification-prefs')}
            iconColor="#EF4444"
          />
        </GlassCard>

        {/* TRACKING & SAFETY Section */}
        <ThemedText weight="semibold" style={{ fontSize: 12, color: colors.TEXT_SECONDARY, marginBottom: 8, marginLeft: 4, letterSpacing: 1 }}>
          TRACKING & SAFETY
        </ThemedText>
        <GlassCard style={{ marginBottom: 20, padding: 0 }}>
          <SettingRow
            icon="navigate-outline"
            title="Location Update Interval"
            subtitle="Every 5 minutes"
            onPress={() => router.push('/location-timer')}
            iconColor="#10B981"
          />
          <Divider />
          <SettingRow
            icon="location-outline"
            title="Safe Zones"
            subtitle={`${totalZones} zones configured`}
            onPress={() => router.push('/safe-zone-map')}
            iconColor="#00D4AA"
          />
          <Divider />
          <SettingRow
            icon="people-outline"
            title="Emergency Contacts"
            subtitle="Manage contacts"
            onPress={() => router.push('/emergency-contacts')}
            iconColor="#EF4444"
          />
        </GlassCard>

        {/* SUPPORT Section */}
        <ThemedText weight="semibold" style={{ fontSize: 12, color: colors.TEXT_SECONDARY, marginBottom: 8, marginLeft: 4, letterSpacing: 1 }}>
          SUPPORT
        </ThemedText>
        <GlassCard style={{ marginBottom: 20, padding: 0 }}>
          <SettingRow
            icon="help-circle-outline"
            title="Help & FAQ"
            subtitle="Get support and guides"
            onPress={() => router.push('/help-faq')}
            iconColor="#3B82F6"
          />
          <Divider />
          <SettingRow
            icon="document-text-outline"
            title="Terms & Privacy"
            subtitle="Legal information"
            onPress={() => router.push('/terms-privacy')}
            iconColor="#6B7280"
          />
          <Divider />
          <SettingRow
            icon="information-circle-outline"
            title="About ChildGuard"
            subtitle="Version 1.0.0"
            onPress={() => showToast('ChildGuard v1.0.0\nAI-Powered Child Safety', 'info')}
            iconColor="#8B5CF6"
          />
        </GlassCard>

        {/* Logout Button */}
        <TouchableOpacity
          onPress={handleLogout}
          style={{
            paddingVertical: 16, borderRadius: 14, alignItems: 'center',
            backgroundColor: colors.DANGER + '10', borderWidth: 1, borderColor: colors.DANGER,
            flexDirection: 'row', justifyContent: 'center', gap: 8, marginTop: 8
          }}
        >
          <Ionicons name="log-out-outline" size={20} color={colors.DANGER} />
          <ThemedText weight="bold" style={{ fontSize: 16, color: colors.DANGER }}>
            Sign Out
          </ThemedText>
        </TouchableOpacity>

        <ThemedText style={{ textAlign: 'center', color: colors.TEXT_SECONDARY, fontSize: 12, marginTop: 24 }}>
          ChildGuard v1.0.0 • Made for child safety
        </ThemedText>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
});