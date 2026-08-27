import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/authStore';
import { useToastStore } from '../../store/toastStore';
import { ThemedText } from '../../components/ui/ThemedText';
import { GlassCard } from '../../components/ui/GlassCard';
import { GradientButton } from '../../components/ui/GradientButton';
import { useThemeStore } from '../../store/themeStore';
import { Ionicons } from '@expo/vector-icons';

export default function Login() {
  const { login } = useAuthStore();
  const { showToast } = useToastStore();
  const router = useRouter();
  const { colors } = useThemeStore();
  
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      showToast('Please fill in all fields', 'warning');
      return;
    }
    
    try {
      await login(email, password);
      showToast('Login successful!', 'success');
      router.replace('/(tabs)');
    } catch (error: any) {
      console.error('Login error:', error);
      showToast('Login failed. Please check your credentials.', 'error');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.BG_PRIMARY }} edges={['top', 'bottom']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
        <View style={{ padding: 24 }}>
          <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 16 }}>
            <Ionicons name="arrow-back" size={24} color={colors.TEXT_SECONDARY} />
          </TouchableOpacity>
          
          <ThemedText weight="bold" style={{ fontSize: 28, marginBottom: 8, color: colors.TEXT_PRIMARY }}>Welcome Back</ThemedText>
          <ThemedText style={{ fontSize: 14, color: colors.TEXT_SECONDARY, marginBottom: 32 }}>Sign in to ChildGuard</ThemedText>
          
          <GlassCard style={{ padding: 24, gap: 16 }}>
            <View>
              <ThemedText style={{ fontSize: 12, color: colors.TEXT_SECONDARY, marginBottom: 6 }}>Email Address</ThemedText>
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.BG_TERTIARY, borderRadius: 12, borderWidth: 1, borderColor: colors.BORDER }}>
                <Ionicons name="mail-outline" size={20} color={colors.TEXT_SECONDARY} style={{ marginLeft: 12, marginRight: 8 }} />
                <TextInput 
                  placeholder="Enter your email address" 
                  placeholderTextColor={colors.TEXT_SECONDARY} 
                  value={email}
                  onChangeText={setEmail}
                  style={[styles.input, { flex: 1, backgroundColor: 'transparent', borderWidth: 0, color: colors.TEXT_PRIMARY }]} 
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>
            
            <View>
              <ThemedText style={{ fontSize: 12, color: colors.TEXT_SECONDARY, marginBottom: 6 }}>Password</ThemedText>
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.BG_TERTIARY, borderRadius: 12, borderWidth: 1, borderColor: colors.BORDER }}>
                <Ionicons name="lock-closed-outline" size={20} color={colors.TEXT_SECONDARY} style={{ marginLeft: 12, marginRight: 8 }} />
                <TextInput 
                  secureTextEntry={!showPassword} 
                  placeholder="Enter your password" 
                  placeholderTextColor={colors.TEXT_SECONDARY} 
                  value={password}
                  onChangeText={setPassword}
                  style={[styles.input, { flex: 1, backgroundColor: 'transparent', borderWidth: 0, color: colors.TEXT_PRIMARY }]} 
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ padding: 12, marginRight: 4 }}>
                  <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.TEXT_SECONDARY} />
                </TouchableOpacity>
              </View>
            </View>
            
            <TouchableOpacity style={{ alignSelf: 'flex-end' }} onPress={() => router.push('/(auth)/forgot-password')}>
              <ThemedText style={{ fontSize: 13, color: colors.ACCENT_TEAL }}>Forgot Password?</ThemedText>
            </TouchableOpacity>
          </GlassCard>
          
          <View style={{ marginTop: 32, gap: 16 }}>
            <GradientButton title="Sign In" onPress={handleLogin} />
            
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={{ flex: 1, height: 1, backgroundColor: colors.BORDER }} />
              <ThemedText style={{ color: colors.TEXT_SECONDARY, fontSize: 12 }}>OR</ThemedText>
              <View style={{ flex: 1, height: 1, backgroundColor: colors.BORDER }} />
            </View>
            
            {/* Google Button Disabled for Now */}
            <TouchableOpacity 
              disabled
              style={[styles.input, { backgroundColor: colors.BG_TERTIARY, borderColor: colors.BORDER, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 8, borderWidth: 1, opacity: 0.5 }]}
            >
              <Ionicons name="logo-google" size={20} color={colors.TEXT_SECONDARY} />
              <ThemedText weight="medium" style={{ color: colors.TEXT_SECONDARY }}>Continue with Google (Coming Soon)</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
              <ThemedText style={{ textAlign: 'center', color: colors.TEXT_SECONDARY, fontSize: 14 }}>
                Don't have an account? <ThemedText style={{ color: colors.ACCENT_TEAL }}>Create one</ThemedText>
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  input: { height: 50, borderRadius: 12, paddingHorizontal: 16, fontSize: 15 },
});