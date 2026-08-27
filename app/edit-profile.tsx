import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useThemeStore } from '../store/themeStore';
import { useToastStore } from '../store/toastStore';
import { useAuthStore } from '../store/authStore';
import { ThemedText } from '../components/ui/ThemedText';
import { GlassCard } from '../components/ui/GlassCard';
import { GradientButton } from '../components/ui/GradientButton';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../api/config';

export default function EditProfileScreen() {
  const router = useRouter();
  const { colors } = useThemeStore();
  const { showToast } = useToastStore();
  const { user, logout } = useAuthStore();
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Load user data on mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token || !user) {
          router.replace('/(auth)/login');
          return;
        }

        // Fetch latest user data from backend
        const response = await axios.get(`${BASE_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userData = response.data;
        setFullName(userData.full_name || '');
        setEmail(userData.email || '');
        setPhone(userData.phone || '');
        setCity(userData.city || '');
        setProfilePhoto(userData.profile_photo_url || null);
      } catch (error) {
        console.error('Error loading user data:', error);
        // Fallback to store data
        if (user) {
          setFullName(user.full_name || '');
          setEmail(user.email || '');
        }
      }
    };

    loadUserData();
  }, [user]);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Permission to access camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setProfilePhoto(result.assets[0].uri);
    }
  };

  const handleSaveProfile = async () => {
    if (!fullName.trim() || !email.trim()) {
      showToast('Please fill in all required fields', 'warning');
      return;
    }

    setIsSaving(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        showToast('Session expired', 'error');
        router.replace('/(auth)/login');
        return;
      }

      // Update user profile via backend
      await axios.put(
        `${BASE_URL}/users/me`,
        {
          full_name: fullName.trim(),
          email: email.trim(),
          phone: phone.trim() || null,
          city: city.trim() || null,
          profile_photo_url: profilePhoto,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      showToast('Profile updated successfully!', 'success');
      
      // Update auth store with new data
      const response = await axios.get(`${BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Update local state
      setFullName(response.data.full_name);
      setEmail(response.data.email);
      setPhone(response.data.phone);
      setCity(response.data.city);
      setProfilePhoto(response.data.profile_photo_url);
      
      router.back();
    } catch (error: any) {
      console.error('Update profile error:', error);
      const errorMsg = error.response?.data?.detail || 'Failed to update profile. Please try again.';
      showToast(errorMsg, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Sign Out?',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/onboarding');
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.BG_PRIMARY }} edges={['top', 'bottom']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 24, flexGrow: 1 }}>
        
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 32 }}>
          <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, marginRight: 8 }}>
            <Ionicons name="arrow-back" size={24} color={colors.TEXT_PRIMARY} />
          </TouchableOpacity>
          <ThemedText weight="bold" style={{ fontSize: 24, color: colors.TEXT_PRIMARY }}>
            Edit Profile
          </ThemedText>
        </View>

        {/* Profile Photo */}
        <View style={{ alignItems: 'center', marginBottom: 32 }}>
          <TouchableOpacity onPress={pickImage} style={{ position: 'relative' }}>
            <View style={{ 
              width: 120, height: 120, borderRadius: 60, 
              backgroundColor: colors.BG_TERTIARY,
              justifyContent: 'center', alignItems: 'center',
              borderWidth: 3, borderColor: colors.ACCENT_TEAL,
              overflow: 'hidden'
            }}>
              {profilePhoto ? (
                <Image source={{ uri: profilePhoto }} style={{ width: 120, height: 120 }} />
              ) : (
                <ThemedText weight="bold" style={{ fontSize: 40, color: colors.TEXT_SECONDARY }}>
                  {fullName?.charAt(0) || 'U'}
                </ThemedText>
              )}
            </View>
            <View style={{ 
              position: 'absolute', bottom: 4, right: 4,
              backgroundColor: colors.ACCENT_TEAL,
              width: 36, height: 36, borderRadius: 18,
              justifyContent: 'center', alignItems: 'center',
              borderWidth: 2, borderColor: colors.BG_PRIMARY
            }}>
              <Ionicons name="camera" size={18} color="#FFF" />
            </View>
          </TouchableOpacity>
          <ThemedText style={{ fontSize: 12, color: colors.TEXT_SECONDARY, marginTop: 8 }}>
            Tap to change photo
          </ThemedText>
        </View>

        <GlassCard style={{ padding: 24, gap: 16, marginBottom: 24 }}>
          <View>
            <ThemedText style={{ fontSize: 12, color: colors.TEXT_SECONDARY, marginBottom: 6 }}>
              Full Name *
            </ThemedText>
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.BG_TERTIARY, borderRadius: 12, borderWidth: 1, borderColor: colors.BORDER, paddingHorizontal: 12 }}>
              <Ionicons name="person-outline" size={20} color={colors.TEXT_SECONDARY} style={{ marginRight: 8 }} />
              <TextInput
                placeholder="Enter your full name"
                placeholderTextColor={colors.TEXT_SECONDARY}
                value={fullName}
                onChangeText={setFullName}
                style={{ flex: 1, height: 50, color: colors.TEXT_PRIMARY, fontSize: 15 }}
              />
            </View>
          </View>

          <View>
            <ThemedText style={{ fontSize: 12, color: colors.TEXT_SECONDARY, marginBottom: 6 }}>
              Email Address *
            </ThemedText>
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.BG_TERTIARY, borderRadius: 12, borderWidth: 1, borderColor: colors.BORDER, paddingHorizontal: 12 }}>
              <Ionicons name="mail-outline" size={20} color={colors.TEXT_SECONDARY} style={{ marginRight: 8 }} />
              <TextInput
                placeholder="Enter your email"
                placeholderTextColor={colors.TEXT_SECONDARY}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                style={{ flex: 1, height: 50, color: colors.TEXT_PRIMARY, fontSize: 15 }}
              />
            </View>
          </View>

          <View>
            <ThemedText style={{ fontSize: 12, color: colors.TEXT_SECONDARY, marginBottom: 6 }}>
              Phone Number
            </ThemedText>
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.BG_TERTIARY, borderRadius: 12, borderWidth: 1, borderColor: colors.BORDER, paddingHorizontal: 12 }}>
              <Ionicons name="phone-portrait-outline" size={20} color={colors.TEXT_SECONDARY} style={{ marginRight: 8 }} />
              <TextInput
                placeholder="Enter your phone number"
                placeholderTextColor={colors.TEXT_SECONDARY}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                style={{ flex: 1, height: 50, color: colors.TEXT_PRIMARY, fontSize: 15 }}
              />
            </View>
          </View>

          <View>
            <ThemedText style={{ fontSize: 12, color: colors.TEXT_SECONDARY, marginBottom: 6 }}>
              City
            </ThemedText>
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.BG_TERTIARY, borderRadius: 12, borderWidth: 1, borderColor: colors.BORDER, paddingHorizontal: 12 }}>
              <Ionicons name="location-outline" size={20} color={colors.TEXT_SECONDARY} style={{ marginRight: 8 }} />
              <TextInput
                placeholder="Enter your city"
                placeholderTextColor={colors.TEXT_SECONDARY}
                value={city}
                onChangeText={setCity}
                style={{ flex: 1, height: 50, color: colors.TEXT_PRIMARY, fontSize: 15 }}
              />
            </View>
          </View>
        </GlassCard>

        <GradientButton 
          title={isSaving ? 'Saving...' : 'Save Changes'} 
          onPress={handleSaveProfile}
          disabled={isSaving}
        />

        <TouchableOpacity 
          onPress={handleLogout}
          style={{ marginTop: 24, paddingVertical: 16, borderRadius: 14, alignItems: 'center', backgroundColor: colors.DANGER + '10', borderWidth: 1, borderColor: colors.DANGER }}
        >
          <ThemedText weight="bold" style={{ fontSize: 16, color: colors.DANGER }}>
            Sign Out
          </ThemedText>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}