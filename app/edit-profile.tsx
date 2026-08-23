import React, { useState } from 'react';
import { View, ScrollView, TextInput, TouchableOpacity, Image, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { ThemedText } from '../components/ui/ThemedText';
import { ThemedView } from '../components/ui/ThemedView';
import { GlassCard } from '../components/ui/GlassCard';
import { GradientButton } from '../components/ui/GradientButton';
import { useThemeStore } from '../store/themeStore';
import { useUserStore } from '../store/userStore';
import { useToastStore } from '../store/toastStore';
import { Ionicons } from '@expo/vector-icons';

export default function EditProfileScreen() {
  const router = useRouter();
  const { colors } = useThemeStore();
  const { profile, updateProfile } = useUserStore();
  const { showToast } = useToastStore();

  const [formData, setFormData] = useState({
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
  });
  const [photo, setPhoto] = useState<string | null>(profile.photo);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) setPhoto(result.assets[0].uri);
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      showToast('Name is required', 'error');
      return;
    }
    if (!formData.email.includes('@')) {
      showToast('Please enter a valid email', 'error');
      return;
    }
    updateProfile({ ...formData, photo });
    showToast('Profile updated successfully!', 'success');
    router.back();
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
        
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
          <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, marginRight: 12 }}>
            <Ionicons name="arrow-back" size={24} color={colors.TEXT_PRIMARY} />
          </TouchableOpacity>
          <ThemedText weight="bold" style={{ fontSize: 22, color: colors.TEXT_PRIMARY }}>Edit Profile</ThemedText>
        </View>

        {/* Photo Upload */}
        <View style={{ alignItems: 'center', marginBottom: 24 }}>
          <TouchableOpacity onPress={pickImage} style={{ position: 'relative' }}>
            <View style={{ 
              width: 120, height: 120, borderRadius: 60, 
              backgroundColor: colors.BG_TERTIARY, 
              justifyContent: 'center', alignItems: 'center',
              borderWidth: 3, borderColor: colors.ACCENT_TEAL,
              overflow: 'hidden'
            }}>
              {photo ? (
                <Image source={{ uri: photo }} style={{ width: '100%', height: '100%' }} />
              ) : (
                <Ionicons name="person" size={60} color={colors.TEXT_SECONDARY} />
              )}
            </View>
            <View style={{ 
              position: 'absolute', bottom: 0, right: 0, 
              width: 36, height: 36, borderRadius: 18, 
              backgroundColor: colors.ACCENT_TEAL, 
              justifyContent: 'center', alignItems: 'center',
              borderWidth: 3, borderColor: colors.BG_PRIMARY
            }}>
              <Ionicons name="camera" size={16} color="#FFF" />
            </View>
          </TouchableOpacity>
          <ThemedText style={{ fontSize: 13, color: colors.TEXT_SECONDARY, marginTop: 12 }}>
            Tap to change profile photo
          </ThemedText>
        </View>

        {/* Form */}
        <GlassCard style={{ padding: 20, gap: 16 }}>
          
          <View>
            <ThemedText style={{ fontSize: 12, color: colors.TEXT_SECONDARY, marginBottom: 6, fontWeight: '600' }}>
              Full Name *
            </ThemedText>
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.BG_TERTIARY, borderRadius: 12, borderWidth: 1, borderColor: colors.BORDER, paddingHorizontal: 12 }}>
              <Ionicons name="person-outline" size={20} color={colors.TEXT_SECONDARY} />
              <TextInput
                placeholder="Your full name"
                placeholderTextColor={colors.TEXT_SECONDARY}
                value={formData.name}
                onChangeText={(t) => setFormData({ ...formData, name: t })}
                style={{ flex: 1, height: 50, color: colors.TEXT_PRIMARY, fontSize: 15, marginLeft: 8 }}
              />
            </View>
          </View>

          <View>
            <ThemedText style={{ fontSize: 12, color: colors.TEXT_SECONDARY, marginBottom: 6, fontWeight: '600' }}>
              Email Address *
            </ThemedText>
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.BG_TERTIARY, borderRadius: 12, borderWidth: 1, borderColor: colors.BORDER, paddingHorizontal: 12 }}>
              <Ionicons name="mail-outline" size={20} color={colors.TEXT_SECONDARY} />
              <TextInput
                placeholder="your@email.com"
                placeholderTextColor={colors.TEXT_SECONDARY}
                value={formData.email}
                onChangeText={(t) => setFormData({ ...formData, email: t })}
                keyboardType="email-address"
                autoCapitalize="none"
                style={{ flex: 1, height: 50, color: colors.TEXT_PRIMARY, fontSize: 15, marginLeft: 8 }}
              />
            </View>
          </View>

          <View>
            <ThemedText style={{ fontSize: 12, color: colors.TEXT_SECONDARY, marginBottom: 6, fontWeight: '600' }}>
              Contact Number *
            </ThemedText>
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.BG_TERTIARY, borderRadius: 12, borderWidth: 1, borderColor: colors.BORDER, paddingHorizontal: 12 }}>
              <Ionicons name="call-outline" size={20} color={colors.TEXT_SECONDARY} />
              <TextInput
                placeholder="+92 300 1234567"
                placeholderTextColor={colors.TEXT_SECONDARY}
                value={formData.phone}
                onChangeText={(t) => setFormData({ ...formData, phone: t })}
                keyboardType="phone-pad"
                style={{ flex: 1, height: 50, color: colors.TEXT_PRIMARY, fontSize: 15, marginLeft: 8 }}
              />
            </View>
          </View>

          <View>
            <ThemedText style={{ fontSize: 12, color: colors.TEXT_SECONDARY, marginBottom: 6, fontWeight: '600' }}>
              Role
            </ThemedText>
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.BG_TERTIARY, borderRadius: 12, borderWidth: 1, borderColor: colors.BORDER, paddingHorizontal: 12, opacity: 0.6 }}>
              <Ionicons name="shield-checkmark" size={20} color={colors.TEXT_SECONDARY} />
              <TextInput
                value={profile.role}
                editable={false}
                style={{ flex: 1, height: 50, color: colors.TEXT_PRIMARY, fontSize: 15, marginLeft: 8 }}
              />
            </View>
            <ThemedText style={{ fontSize: 11, color: colors.TEXT_SECONDARY, marginTop: 4 }}>
              Role cannot be changed. Contact support for changes.
            </ThemedText>
          </View>

        </GlassCard>

        {/* Save Button */}
        <View style={{ marginTop: 24 }}>
          <GradientButton title="Save Changes" onPress={handleSave} />
        </View>

      </ScrollView>
    </ThemedView>
  );
}