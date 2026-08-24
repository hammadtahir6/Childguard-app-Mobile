import React, { useState } from 'react';
import { View, ScrollView, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { ThemedText } from '../components/ui/ThemedText';
import { ThemedView } from '../components/ui/ThemedView';
import { GlassCard } from '../components/ui/GlassCard';
import { useThemeStore } from '../store/themeStore';
import { useChildrenStore } from '../store/childrenStore';
import { Ionicons } from '@expo/vector-icons';

export default function AddChildScreen() {
  const router = useRouter();
  const { colors } = useThemeStore();
  const { addChild } = useChildrenStore();
  const [photo, setPhoto] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '', age: '', gender: '', grade: '', schoolName: '', startTime: '08:00', endTime: '14:00', medical: ''
  });

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [1, 1], quality: 0.8,
    });
    if (!result.canceled) setPhoto(result.assets[0].uri);
  };

  const handleContinue = () => {
    if (!formData.name) {
      Alert.alert('Missing Info', 'Please enter the child\'s name.');
      return;
    }
    addChild({
      id: Date.now().toString(), name: formData.name, age: parseInt(formData.age) || 0, gender: formData.gender,
      photo: photo || undefined, status: 'SAFE', vitals: { heartRate: 85, spo2: 98, temperature: 36.5 },
      location: { lat: 34.0151, lng: 71.5249, address: 'Peshawar, Pakistan', inSafeZone: true },
      band: { battery: 100, connected: false }, safeZones: [],
      medicalInfo: { allergies: formData.medical },
      schoolSchedule: { name: formData.schoolName, startTime: formData.startTime, endTime: formData.endTime }
    });
    router.push('/pair-band');
  };

  const handleSkip = () => {
    handleContinue();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.BG_PRIMARY }} edges={['top', 'bottom']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 40, flexGrow: 1 }}>
        
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
          <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, marginRight: 12 }}>
            <Ionicons name="arrow-back" size={24} color={colors.TEXT_PRIMARY} />
          </TouchableOpacity>
          <View>
            <ThemedText weight="bold" style={{ fontSize: 22, color: colors.TEXT_PRIMARY }}>Add Child Profile</ThemedText>
            <ThemedText style={{ fontSize: 14, color: colors.TEXT_SECONDARY, marginTop: 4 }}>Set up your child's profile to get started</ThemedText>
          </View>
        </View>

        {/* Photo Section */}
        <View style={{ alignItems: 'center', marginBottom: 24 }}>
          <TouchableOpacity onPress={pickImage} style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: colors.BG_TERTIARY, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderStyle: 'dashed', borderColor: colors.BORDER, overflow: 'hidden' }}>
            {photo ? <Image source={{ uri: photo }} style={{ width: '100%', height: '100%' }} /> : (
              <View style={{ alignItems: 'center' }}>
                <Ionicons name="camera-outline" size={28} color={colors.TEXT_SECONDARY} />
                <ThemedText style={{ fontSize: 10, color: colors.TEXT_SECONDARY, marginTop: 4 }}>Add Photo</ThemedText>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Form Card */}
        <GlassCard style={{ padding: 20, gap: 20 }}>
          
          <View>
            <ThemedText style={{ fontSize: 12, color: colors.TEXT_SECONDARY, marginBottom: 6, fontWeight: '600' }}>Child's Full Name *</ThemedText>
            <TextInput placeholder="e.g. Sara Ahmed" placeholderTextColor={colors.TEXT_SECONDARY} value={formData.name} onChangeText={(t) => setFormData({...formData, name: t})} style={[styles.input, { backgroundColor: colors.BG_TERTIARY, borderColor: colors.BORDER, color: colors.TEXT_PRIMARY }]} />
          </View>

          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{ flex: 1 }}>
              <ThemedText style={{ fontSize: 12, color: colors.TEXT_SECONDARY, marginBottom: 6, fontWeight: '600' }}>Age *</ThemedText>
              <TextInput placeholder="8" placeholderTextColor={colors.TEXT_SECONDARY} keyboardType="number-pad" value={formData.age} onChangeText={(t) => setFormData({...formData, age: t})} style={[styles.input, { backgroundColor: colors.BG_TERTIARY, borderColor: colors.BORDER, color: colors.TEXT_PRIMARY }]} />
            </View>
            <View style={{ flex: 1 }}>
              <ThemedText style={{ fontSize: 12, color: colors.TEXT_SECONDARY, marginBottom: 6, fontWeight: '600' }}>Gender *</ThemedText>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {['Boy', 'Girl'].map(g => (
                  <TouchableOpacity key={g} onPress={() => setFormData({...formData, gender: g})} style={{ flex: 1, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: formData.gender === g ? colors.ACCENT_TEAL : colors.BORDER, backgroundColor: formData.gender === g ? colors.ACCENT_TEAL + '20' : colors.BG_TERTIARY, alignItems: 'center' }}>
                    <ThemedText style={{ color: formData.gender === g ? colors.ACCENT_TEAL : colors.TEXT_SECONDARY, fontSize: 13, fontWeight: '600' }}>{g}</ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          <View>
            <ThemedText style={{ fontSize: 12, color: colors.TEXT_SECONDARY, marginBottom: 6, fontWeight: '600' }}>Grade / Class</ThemedText>
            <TextInput placeholder="e.g. Class 3" placeholderTextColor={colors.TEXT_SECONDARY} value={formData.grade} onChangeText={(t) => setFormData({...formData, grade: t})} style={[styles.input, { backgroundColor: colors.BG_TERTIARY, borderColor: colors.BORDER, color: colors.TEXT_PRIMARY }]} />
          </View>

          <View style={{ height: 1, backgroundColor: colors.BORDER, marginVertical: 4 }} />
          
          <View>
            <ThemedText style={{ fontSize: 12, color: colors.TEXT_SECONDARY, marginBottom: 6, fontWeight: '600' }}>School Name</ThemedText>
            <TextInput placeholder="e.g. Beacon House" placeholderTextColor={colors.TEXT_SECONDARY} value={formData.schoolName} onChangeText={(t) => setFormData({...formData, schoolName: t})} style={[styles.input, { backgroundColor: colors.BG_TERTIARY, borderColor: colors.BORDER, color: colors.TEXT_PRIMARY }]} />
          </View>

          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{ flex: 1 }}>
              <ThemedText style={{ fontSize: 12, color: colors.TEXT_SECONDARY, marginBottom: 6, fontWeight: '600' }}>Start Time</ThemedText>
              <TextInput placeholder="08:00" value={formData.startTime} onChangeText={(t) => setFormData({...formData, startTime: t})} style={[styles.input, { backgroundColor: colors.BG_TERTIARY, borderColor: colors.BORDER, color: colors.TEXT_PRIMARY, textAlign: 'center' }]} />
            </View>
            <View style={{ flex: 1 }}>
              <ThemedText style={{ fontSize: 12, color: colors.TEXT_SECONDARY, marginBottom: 6, fontWeight: '600' }}>End Time</ThemedText>
              <TextInput placeholder="14:00" value={formData.endTime} onChangeText={(t) => setFormData({...formData, endTime: t})} style={[styles.input, { backgroundColor: colors.BG_TERTIARY, borderColor: colors.BORDER, color: colors.TEXT_PRIMARY, textAlign: 'center' }]} />
            </View>
          </View>

          <View style={{ height: 1, backgroundColor: colors.BORDER, marginVertical: 4 }} />
          
          <View>
            <ThemedText style={{ fontSize: 12, color: colors.TEXT_SECONDARY, marginBottom: 6, fontWeight: '600' }}>Medical Notes (Optional)</ThemedText>
            <TextInput 
              placeholder="Allergies, conditions, or anything important..." 
              placeholderTextColor={colors.TEXT_SECONDARY} 
              multiline numberOfLines={3} 
              value={formData.medical} 
              onChangeText={(t) => setFormData({...formData, medical: t})} 
              textAlignVertical="top"
              style={[styles.input, { backgroundColor: colors.BG_TERTIARY, borderColor: colors.BORDER, color: colors.TEXT_PRIMARY, height: 80, paddingTop: 12 }]} 
            />
          </View>
        </GlassCard>

        {/* Bottom Buttons */}
        <View style={{ marginTop: 24, gap: 12 }}>
          <TouchableOpacity 
            onPress={handleContinue}
            style={{ paddingVertical: 16, borderRadius: 14, alignItems: 'center', backgroundColor: colors.ACCENT_TEAL }}
          >
            <ThemedText weight="bold" style={{ color: '#FFF', fontSize: 16 }}>Continue to Band Pairing →</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSkip} style={{ paddingVertical: 16, alignItems: 'center' }}>
            <ThemedText style={{ fontSize: 14, color: colors.TEXT_SECONDARY, fontWeight: '500' }}>Skip — Add Band Later</ThemedText>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  input: { height: 50, borderRadius: 12, borderWidth: 1, paddingHorizontal: 16, fontSize: 15 },
});