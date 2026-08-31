import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { useThemeStore } from '../store/themeStore';
import { useToastStore } from '../store/toastStore';
import { ThemedText } from '../components/ui/ThemedText';
import { GlassCard } from '../components/ui/GlassCard';
import { GradientButton } from '../components/ui/GradientButton';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { BASE_URL } from '../api/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ✅ Helper function to parse API errors
const getErrorMessage = (error: any): string => {
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  
  if (error?.response?.status === 422 && error.response?.data?.detail) {
    const detail = error.response.data.detail;
    if (Array.isArray(detail)) {
      return detail[0]?.msg || 'Validation failed';
    }
    if (typeof detail === 'string') return detail;
  }
  
  if (error?.response?.data?.detail) {
    return error.response.data.detail;
  }
  
  return 'An error occurred. Please try again.';
};

export default function AddChildScreen() {
  const router = useRouter();
  const { colors } = useThemeStore();
  const { showToast } = useToastStore();
  
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [grade, setGrade] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [medicalNotes, setMedicalNotes] = useState('');
  const [childPhoto, setChildPhoto] = useState<string | null>(null);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Permission to access camera roll is required!');
      return;
    }

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
    quality: 1,
  });

    if (!result.canceled) {
      const imageUrl = result.assets[0].uri;
      
      // ✅ Copy image to app's document directory for persistence
      const fileName = `child_${Date.now()}.jpg`;
      const fileUri = FileSystem.documentDirectory + fileName;
      
      try {
        await FileSystem.copyAsync({
          from: imageUrl,
          to: fileUri,
        });
        setChildPhoto(fileUri); // ✅ Save the persistent file path
      } catch (error) {
        console.error('Error saving image:', error);
        setChildPhoto(imageUrl); // Fallback to original URI
      }
    }
  };

  const handleAddChild = async () => {
    if (!name || !age || !gender) {
      showToast('Please fill in all required fields', 'warning');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        showToast('Authentication required', 'error');
        router.replace('/(auth)/login');
        return;
      }

      const response = await axios.post(
        `${BASE_URL}/children/`,
        {
          name,
          age: parseInt(age),
          gender,
          grade: grade || null,
          school_name: schoolName || null,
          medical_notes: medicalNotes || null,
          profile_photo_url: childPhoto,
        },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      showToast('Child added successfully!', 'success');
      // Navigate to pair band screen with child ID
      router.replace(`/pair-band?childId=${response.data.id}`);
    } catch (error: any) {
      console.error('Add child error:', error);
      showToast(getErrorMessage(error), 'error'); // ✅ Use helper function
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.BG_PRIMARY }} edges={['top', 'bottom']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 24, flexGrow: 1 }}>
        
        <View style={{ marginBottom: 32, marginTop: 20 }}>
          <ThemedText weight="bold" style={{ fontSize: 28, color: colors.TEXT_PRIMARY, marginBottom: 8 }}>
            Add Child
          </ThemedText>
          <ThemedText style={{ fontSize: 14, color: colors.TEXT_SECONDARY }}>
            Let's start by adding your child's information
          </ThemedText>
        </View>

        {/* Profile Photo */}
        <View style={{ alignItems: 'center', marginBottom: 24 }}>
          <TouchableOpacity onPress={pickImage} style={{ position: 'relative' }}>
            <View style={{ 
              width: 100, height: 100, borderRadius: 50, 
              backgroundColor: colors.BG_TERTIARY,
              justifyContent: 'center', alignItems: 'center',
              borderWidth: 2, borderColor: colors.ACCENT_TEAL,
              borderStyle: 'dashed'
            }}>
              {childPhoto ? (
                <Image source={{ uri: childPhoto }} style={{ width: 100, height: 100, borderRadius: 50 }} />
              ) : (
                <Ionicons name="camera-outline" size={40} color={colors.TEXT_SECONDARY} />
              )}
            </View>
            <View style={{ 
              position: 'absolute', bottom: 0, right: 0,
              backgroundColor: colors.ACCENT_TEAL,
              width: 32, height: 32, borderRadius: 16,
              justifyContent: 'center', alignItems: 'center'
            }}>
              <Ionicons name="pencil" size={16} color="#FFF" />
            </View>
          </TouchableOpacity>
          <ThemedText style={{ fontSize: 12, color: colors.TEXT_SECONDARY, marginTop: 8 }}>
            Tap to add photo (optional)
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
                placeholder="Enter child's full name"
                placeholderTextColor={colors.TEXT_SECONDARY}
                value={name}
                onChangeText={setName}
                style={{ flex: 1, height: 50, color: colors.TEXT_PRIMARY, fontSize: 15 }}
              />
            </View>
          </View>

          <View>
            <ThemedText style={{ fontSize: 12, color: colors.TEXT_SECONDARY, marginBottom: 6 }}>
              Age *
            </ThemedText>
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.BG_TERTIARY, borderRadius: 12, borderWidth: 1, borderColor: colors.BORDER, paddingHorizontal: 12 }}>
              <Ionicons name="calendar-outline" size={20} color={colors.TEXT_SECONDARY} style={{ marginRight: 8 }} />
              <TextInput
                placeholder="Enter age"
                placeholderTextColor={colors.TEXT_SECONDARY}
                value={age}
                onChangeText={setAge}
                keyboardType="number-pad"
                style={{ flex: 1, height: 50, color: colors.TEXT_PRIMARY, fontSize: 15 }}
              />
            </View>
          </View>

          <View>
            <ThemedText style={{ fontSize: 12, color: colors.TEXT_SECONDARY, marginBottom: 6 }}>
              Gender *
            </ThemedText>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity
                onPress={() => setGender('Male')}
                style={{
                  flex: 1,
                  padding: 14,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: gender === 'Male' ? colors.ACCENT_TEAL : colors.BORDER,
                  backgroundColor: gender === 'Male' ? colors.ACCENT_TEAL + '20' : colors.BG_TERTIARY,
                  alignItems: 'center',
                }}
              >
                <ThemedText style={{ color: gender === 'Male' ? colors.ACCENT_TEAL : colors.TEXT_SECONDARY, fontWeight: '600' }}>
                  Male
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setGender('Female')}
                style={{
                  flex: 1,
                  padding: 14,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: gender === 'Female' ? colors.ACCENT_TEAL : colors.BORDER,
                  backgroundColor: gender === 'Female' ? colors.ACCENT_TEAL + '20' : colors.BG_TERTIARY,
                  alignItems: 'center',
                }}
              >
                <ThemedText style={{ color: gender === 'Female' ? colors.ACCENT_TEAL : colors.TEXT_SECONDARY, fontWeight: '600' }}>
                  Female
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>

          <View>
            <ThemedText style={{ fontSize: 12, color: colors.TEXT_SECONDARY, marginBottom: 6 }}>
              Grade/Class
            </ThemedText>
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.BG_TERTIARY, borderRadius: 12, borderWidth: 1, borderColor: colors.BORDER, paddingHorizontal: 12 }}>
              <Ionicons name="school-outline" size={20} color={colors.TEXT_SECONDARY} style={{ marginRight: 8 }} />
              <TextInput
                placeholder="e.g., 3rd Grade"
                placeholderTextColor={colors.TEXT_SECONDARY}
                value={grade}
                onChangeText={setGrade}
                style={{ flex: 1, height: 50, color: colors.TEXT_PRIMARY, fontSize: 15 }}
              />
            </View>
          </View>

          <View>
            <ThemedText style={{ fontSize: 12, color: colors.TEXT_SECONDARY, marginBottom: 6 }}>
              School Name
            </ThemedText>
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.BG_TERTIARY, borderRadius: 12, borderWidth: 1, borderColor: colors.BORDER, paddingHorizontal: 12 }}>
              <Ionicons name="business-outline" size={20} color={colors.TEXT_SECONDARY} style={{ marginRight: 8 }} />
              <TextInput
                placeholder="Enter school name"
                placeholderTextColor={colors.TEXT_SECONDARY}
                value={schoolName}
                onChangeText={setSchoolName}
                style={{ flex: 1, height: 50, color: colors.TEXT_PRIMARY, fontSize: 15 }}
              />
            </View>
          </View>

          <View>
            <ThemedText style={{ fontSize: 12, color: colors.TEXT_SECONDARY, marginBottom: 6 }}>
              Medical Notes
            </ThemedText>
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.BG_TERTIARY, borderRadius: 12, borderWidth: 1, borderColor: colors.BORDER, paddingHorizontal: 12 }}>
              <Ionicons name="medical-outline" size={20} color={colors.TEXT_SECONDARY} style={{ marginRight: 8 }} />
              <TextInput
                placeholder="Any allergies or medical conditions"
                placeholderTextColor={colors.TEXT_SECONDARY}
                value={medicalNotes}
                onChangeText={setMedicalNotes}
                multiline
                numberOfLines={3}
                style={{ flex: 1, height: 80, color: colors.TEXT_PRIMARY, fontSize: 15, textAlignVertical: 'top' }}
              />
            </View>
          </View>
        </GlassCard>

        <GradientButton title="Continue to Pair Band" onPress={handleAddChild} />

        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 16, alignItems: 'center', marginBottom: 40 }}>
          <ThemedText style={{ color: colors.TEXT_SECONDARY, fontSize: 14 }}>Cancel</ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
}