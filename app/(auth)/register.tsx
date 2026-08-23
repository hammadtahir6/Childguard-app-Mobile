import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, ScrollView, Modal, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '../../components/ui/ThemedText';
import { ThemedView } from '../../components/ui/ThemedView';
import { GlassCard } from '../../components/ui/GlassCard';
import { GradientButton } from '../../components/ui/GradientButton';
import { useThemeStore } from '../../store/themeStore';
import { Ionicons } from '@expo/vector-icons';

const COUNTRIES = [
  { code: '+1', flag: '🇺🇸', name: 'USA' },
  { code: '+44', flag: '🇬🇧', name: 'UK' },
  { code: '+92', flag: '🇵', name: 'Pakistan' },
  { code: '+91', flag: '🇮', name: 'India' },
  { code: '+971', flag: '🇪', name: 'UAE' },
  { code: '+966', flag: '🇸🇦', name: 'Saudi Arabia' },
  { code: '+1', flag: '🇨🇦', name: 'Canada' },
  { code: '+61', flag: '🇦🇺', name: 'Australia' },
  { code: '+49', flag: '🇩🇪', name: 'Germany' },
  { code: '+33', flag: '🇫🇷', name: 'France' },
];

export default function Register() {
  const router = useRouter();
  const { colors } = useThemeStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[2]);

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
        <View style={{ padding: 24 }}>
          <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 16 }}>
            <Ionicons name="arrow-back" size={24} color={colors.TEXT_SECONDARY} />
          </TouchableOpacity>
          
          <ThemedText weight="bold" style={{ fontSize: 28, marginBottom: 8, color: colors.TEXT_PRIMARY }}>Create Account</ThemedText>
          <ThemedText style={{ fontSize: 14, color: colors.TEXT_SECONDARY, marginBottom: 32 }}>Start protecting your child today</ThemedText>
          
          <GlassCard style={{ padding: 24, gap: 16 }}>
            <View>
              <ThemedText style={{ fontSize: 12, color: colors.TEXT_SECONDARY, marginBottom: 6 }}>Full Name</ThemedText>
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.BG_TERTIARY, borderRadius: 12, borderWidth: 1, borderColor: colors.BORDER }}>
                <Ionicons name="person-outline" size={20} color={colors.TEXT_SECONDARY} style={{ marginLeft: 12, marginRight: 8 }} />
                <TextInput placeholder="Enter your full name" placeholderTextColor={colors.TEXT_SECONDARY} style={[styles.input, { flex: 1, backgroundColor: 'transparent', borderWidth: 0, color: colors.TEXT_PRIMARY }]} />
              </View>
            </View>
            
            <View>
              <ThemedText style={{ fontSize: 12, color: colors.TEXT_SECONDARY, marginBottom: 6 }}>Email Address</ThemedText>
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.BG_TERTIARY, borderRadius: 12, borderWidth: 1, borderColor: colors.BORDER }}>
                <Ionicons name="mail-outline" size={20} color={colors.TEXT_SECONDARY} style={{ marginLeft: 12, marginRight: 8 }} />
                <TextInput placeholder="Enter your email address" placeholderTextColor={colors.TEXT_SECONDARY} keyboardType="email-address" autoCapitalize="none" style={[styles.input, { flex: 1, backgroundColor: 'transparent', borderWidth: 0, color: colors.TEXT_PRIMARY }]} />
              </View>
            </View>
            
            <View>
              <ThemedText style={{ fontSize: 12, color: colors.TEXT_SECONDARY, marginBottom: 6 }}>Phone Number</ThemedText>
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.BG_TERTIARY, borderRadius: 12, borderWidth: 1, borderColor: colors.BORDER }}>
                <TouchableOpacity onPress={() => setShowCountryModal(true)} style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 14, borderRightWidth: 1, borderRightColor: colors.BORDER }}>
                  <ThemedText style={{ fontSize: 16, marginRight: 6 }}>{selectedCountry.flag}</ThemedText>
                  <ThemedText style={{ fontSize: 14, color: colors.TEXT_PRIMARY, marginRight: 4 }}>{selectedCountry.code}</ThemedText>
                  <Ionicons name="chevron-down" size={16} color={colors.TEXT_SECONDARY} />
                </TouchableOpacity>
                <TextInput placeholder="Enter your phone number" placeholderTextColor={colors.TEXT_SECONDARY} keyboardType="phone-pad" style={[styles.input, { flex: 1, backgroundColor: 'transparent', borderWidth: 0, marginLeft: 8, color: colors.TEXT_PRIMARY }]} />
              </View>
            </View>
            
            <View>
              <ThemedText style={{ fontSize: 12, color: colors.TEXT_SECONDARY, marginBottom: 6 }}>Password</ThemedText>
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.BG_TERTIARY, borderRadius: 12, borderWidth: 1, borderColor: colors.BORDER }}>
                <Ionicons name="lock-closed-outline" size={20} color={colors.TEXT_SECONDARY} style={{ marginLeft: 12, marginRight: 8 }} />
                <TextInput secureTextEntry={!showPassword} placeholder="Enter your password" placeholderTextColor={colors.TEXT_SECONDARY} style={[styles.input, { flex: 1, backgroundColor: 'transparent', borderWidth: 0, color: colors.TEXT_PRIMARY }]} />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ padding: 12, marginRight: 4 }}>
                  <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.TEXT_SECONDARY} />
                </TouchableOpacity>
              </View>
            </View>
            
            <View>
              <ThemedText style={{ fontSize: 12, color: colors.TEXT_SECONDARY, marginBottom: 6 }}>Confirm Password</ThemedText>
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.BG_TERTIARY, borderRadius: 12, borderWidth: 1, borderColor: colors.BORDER }}>
                <Ionicons name="lock-closed-outline" size={20} color={colors.TEXT_SECONDARY} style={{ marginLeft: 12, marginRight: 8 }} />
                <TextInput secureTextEntry={!showPassword} placeholder="Confirm your password" placeholderTextColor={colors.TEXT_SECONDARY} style={[styles.input, { flex: 1, backgroundColor: 'transparent', borderWidth: 0, color: colors.TEXT_PRIMARY }]} />
              </View>
            </View>
            
            <View>
              <ThemedText style={{ fontSize: 12, color: colors.TEXT_SECONDARY, marginBottom: 6 }}>City</ThemedText>
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.BG_TERTIARY, borderRadius: 12, borderWidth: 1, borderColor: colors.BORDER }}>
                <Ionicons name="location-outline" size={20} color={colors.TEXT_SECONDARY} style={{ marginLeft: 12, marginRight: 8 }} />
                <TextInput placeholder="Enter your city" placeholderTextColor={colors.TEXT_SECONDARY} style={[styles.input, { flex: 1, backgroundColor: 'transparent', borderWidth: 0, color: colors.TEXT_PRIMARY }]} />
              </View>
            </View>
          </GlassCard>
          
          <View style={{ marginTop: 32, gap: 16 }}>
            <GradientButton title="Create Account" onPress={() => router.push('/pair-band')} />
            <ThemedText style={{ textAlign: 'center', fontSize: 11, color: colors.TEXT_SECONDARY }}>By creating an account you agree to our Terms & Privacy Policy</ThemedText>
            
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={{ flex: 1, height: 1, backgroundColor: colors.BORDER }} />
              <ThemedText style={{ color: colors.TEXT_SECONDARY, fontSize: 12 }}>OR</ThemedText>
              <View style={{ flex: 1, height: 1, backgroundColor: colors.BORDER }} />
            </View>
            
            <TouchableOpacity style={[styles.input, { backgroundColor: colors.BG_SECONDARY, borderColor: colors.BORDER, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 8, borderWidth: 1 }]}>
              <Ionicons name="logo-google" size={20} color={colors.TEXT_PRIMARY} />
              <ThemedText weight="medium" style={{ color: colors.TEXT_PRIMARY }}>Continue with Google</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
              <ThemedText style={{ textAlign: 'center', color: colors.TEXT_SECONDARY, fontSize: 14 }}>Already have an account? <ThemedText style={{ color: colors.ACCENT_TEAL }}>Sign In</ThemedText></ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <Modal visible={showCountryModal} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: colors.BG_SECONDARY, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: '70%' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <ThemedText weight="bold" style={{ fontSize: 18, color: colors.TEXT_PRIMARY }}>Select Country Code</ThemedText>
              <TouchableOpacity onPress={() => setShowCountryModal(false)}><Ionicons name="close" size={24} color={colors.TEXT_SECONDARY} /></TouchableOpacity>
            </View>
            <FlatList
              data={COUNTRIES}
              keyExtractor={(item) => item.code + item.name}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => { setSelectedCountry(item); setShowCountryModal(false); }} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.BORDER }}>
                  <ThemedText style={{ fontSize: 20, marginRight: 12 }}>{item.flag}</ThemedText>
                  <ThemedText style={{ fontSize: 16, color: colors.TEXT_PRIMARY, flex: 1 }}>{item.name}</ThemedText>
                  <ThemedText style={{ fontSize: 16, color: colors.TEXT_SECONDARY }}>{item.code}</ThemedText>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  input: { height: 50, borderRadius: 12, paddingHorizontal: 16, fontSize: 15 },
});