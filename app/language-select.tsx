import React from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '../components/ui/ThemedText';
import { ThemedView } from '../components/ui/ThemedView';
import { GlassCard } from '../components/ui/GlassCard';
import { useThemeStore } from '../store/themeStore';
import { useSettingsStore, Language } from '../store/settingsStore';
import { useToastStore } from '../store/toastStore';
import { Ionicons } from '@expo/vector-icons';

const LANGUAGES: { code: Language; name: string; native: string; flag: string }[] = [
  { code: 'en', name: 'English', native: 'English', flag: '🇬🇧' },
  { code: 'ur', name: 'Urdu', native: 'اردو', flag: '🇰' },
  { code: 'ar', name: 'Arabic', native: 'العربية', flag: '🇸🇦' },
  { code: 'es', name: 'Spanish', native: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', native: 'Français', flag: '🇫' },
  { code: 'zh', name: 'Chinese', native: '中文', flag: '🇨🇳' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
  { code: 'tr', name: 'Turkish', native: 'Türkçe', flag: '🇹🇷' },
];

export default function LanguageSelectScreen() {
  const router = useRouter();
  const { colors } = useThemeStore();
  const { language, setLanguage } = useSettingsStore();
  const { showToast } = useToastStore();

  const handleSelect = (code: Language) => {
    setLanguage(code);
    if (code === 'en') {
      showToast('Language changed to English', 'success');
    } else {
      const langName = LANGUAGES.find(l => l.code === code)?.name;
      showToast(`${langName} support coming soon. UI will update in next release.`, 'info');
    }
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
          <ThemedText weight="bold" style={{ fontSize: 22, color: colors.TEXT_PRIMARY }}>Select Language</ThemedText>
        </View>

        <ThemedText style={{ fontSize: 14, color: colors.TEXT_SECONDARY, marginBottom: 20, lineHeight: 20 }}>
          Choose your preferred language. The app interface will update accordingly.
        </ThemedText>

        {/* Language List */}
        <View style={{ gap: 10 }}>
          {LANGUAGES.map((lang) => {
            const isSelected = language === lang.code;
            return (
              <TouchableOpacity
                key={lang.code}
                onPress={() => handleSelect(lang.code)}
                activeOpacity={0.7}
                style={[
                  styles.langRow,
                  {
                    backgroundColor: isSelected ? colors.ACCENT_TEAL + '15' : colors.BG_SECONDARY,
                    borderColor: isSelected ? colors.ACCENT_TEAL : colors.BORDER,
                  }
                ]}
              >
                <ThemedText style={{ fontSize: 28, marginRight: 12 }}>{lang.flag}</ThemedText>
                <View style={{ flex: 1 }}>
                  <ThemedText weight="semibold" style={{ fontSize: 16, color: colors.TEXT_PRIMARY }}>
                    {lang.name}
                  </ThemedText>
                  <ThemedText style={{ fontSize: 13, color: colors.TEXT_SECONDARY, marginTop: 2 }}>
                    {lang.native}
                  </ThemedText>
                </View>
                {isSelected && (
                  <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: colors.ACCENT_TEAL, justifyContent: 'center', alignItems: 'center' }}>
                    <Ionicons name="checkmark" size={18} color="#FFF" />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Info Card */}
        <GlassCard style={{ marginTop: 24, padding: 16, backgroundColor: colors.BG_TERTIARY }}>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <Ionicons name="information-circle" size={24} color={colors.ACCENT_TEAL} />
            <View style={{ flex: 1 }}>
              <ThemedText weight="bold" style={{ fontSize: 14, color: colors.TEXT_PRIMARY, marginBottom: 4 }}>
                Translation Status
              </ThemedText>
              <ThemedText style={{ fontSize: 13, color: colors.TEXT_SECONDARY, lineHeight: 18 }}>
                English is fully supported. Other languages are being added. The UI will update in the next release.
              </ThemedText>
            </View>
          </View>
        </GlassCard>

      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  langRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
});