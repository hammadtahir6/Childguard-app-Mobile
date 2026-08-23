import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Modal, TextInput, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '../components/ui/ThemedText';
import { ThemedView } from '../components/ui/ThemedView';
import { GlassCard } from '../components/ui/GlassCard';
import { GradientButton } from '../components/ui/GradientButton';
import { useThemeStore } from '../store/themeStore';
import { EMERGENCY_CONTACTS } from '../constants/DummyData';
import { Ionicons } from '@expo/vector-icons';

export default function EmergencyContacts() {
  const router = useRouter();
  const { colors } = useThemeStore();
  const [contacts, setContacts] = useState(EMERGENCY_CONTACTS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRelation, setNewRelation] = useState('');

  const handleAddContact = () => {
    if (newName && newPhone) {
      setContacts([...contacts, { 
        id: Date.now(), 
        name: newName, 
        relation: newRelation || 'Contact', 
        phone: newPhone, 
        primary: false 
      }]);
      setShowAddModal(false);
      setNewName(''); setNewPhone(''); setNewRelation('');
    }
  };

  const handleDelete = (id: number) => {
    setContacts(contacts.filter(c => c.id !== id));
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
          <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, marginRight: 12 }}>
            <Ionicons name="arrow-back" size={24} color={colors.TEXT_PRIMARY} />
          </TouchableOpacity>
          <ThemedText weight="bold" style={{ fontSize: 20, color: colors.TEXT_PRIMARY }}>Emergency Contacts</ThemedText>
        </View>

        <ThemedText style={{ fontSize: 14, color: colors.TEXT_SECONDARY, marginBottom: 20, lineHeight: 20 }}>
          These people will be notified instantly if an emergency alert is triggered and not resolved within 60 seconds.
        </ThemedText>

        {/* Contacts List */}
        {contacts.map((contact) => (
          <GlassCard key={contact.id} style={{ flexDirection: 'row', alignItems: 'center', padding: 16, marginBottom: 12 }}>
            <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: colors.ACCENT_PURPLE + '20', justifyContent: 'center', alignItems: 'center', marginRight: 16 }}>
              <ThemedText weight="bold" style={{ fontSize: 18, color: colors.ACCENT_PURPLE }}>{contact.name.charAt(0)}</ThemedText>
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <ThemedText weight="bold" style={{ fontSize: 16, color: colors.TEXT_PRIMARY }}>{contact.name}</ThemedText>
                {contact.primary && (
                  <View style={{ backgroundColor: colors.ACCENT_TEAL + '20', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 }}>
                    <ThemedText style={{ fontSize: 10, color: colors.ACCENT_TEAL, fontWeight: 'bold' }}>PRIMARY</ThemedText>
                  </View>
                )}
              </View>
              <ThemedText style={{ fontSize: 13, color: colors.TEXT_SECONDARY, marginTop: 2 }}>{contact.relation} • {contact.phone}</ThemedText>
            </View>
            {!contact.primary && (
              <TouchableOpacity onPress={() => handleDelete(contact.id)} style={{ padding: 8 }}>
                <Ionicons name="trash-outline" size={20} color={colors.DANGER} />
              </TouchableOpacity>
            )}
          </GlassCard>
        ))}

        {/* Add Button */}
        <TouchableOpacity 
          onPress={() => setShowAddModal(true)}
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 16, borderWidth: 2, borderStyle: 'dashed', borderColor: colors.BORDER, marginTop: 8 }}
        >
          <Ionicons name="add-circle-outline" size={24} color={colors.ACCENT_TEAL} />
          <ThemedText weight="semibold" style={{ fontSize: 16, color: colors.ACCENT_TEAL, marginLeft: 8 }}>Add Emergency Contact</ThemedText>
        </TouchableOpacity>
      </ScrollView>

      {/* Add Contact Modal */}
      <Modal visible={showAddModal} transparent animationType="slide">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: colors.BG_SECONDARY, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <ThemedText weight="bold" style={{ fontSize: 20, color: colors.TEXT_PRIMARY }}>New Contact</ThemedText>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Ionicons name="close" size={24} color={colors.TEXT_SECONDARY} />
              </TouchableOpacity>
            </View>
            
            <View style={{ gap: 16 }}>
              <View>
                <ThemedText style={{ fontSize: 12, color: colors.TEXT_SECONDARY, marginBottom: 6 }}>Full Name</ThemedText>
                <TextInput placeholder="e.g. Fatima Khan" placeholderTextColor={colors.TEXT_SECONDARY} value={newName} onChangeText={setNewName} style={[styles.input, { backgroundColor: colors.BG_TERTIARY, borderColor: colors.BORDER, color: colors.TEXT_PRIMARY }]} />
              </View>
              <View>
                <ThemedText style={{ fontSize: 12, color: colors.TEXT_SECONDARY, marginBottom: 6 }}>Relation</ThemedText>
                <TextInput placeholder="e.g. Mother, Uncle" placeholderTextColor={colors.TEXT_SECONDARY} value={newRelation} onChangeText={setNewRelation} style={[styles.input, { backgroundColor: colors.BG_TERTIARY, borderColor: colors.BORDER, color: colors.TEXT_PRIMARY }]} />
              </View>
              <View>
                <ThemedText style={{ fontSize: 12, color: colors.TEXT_SECONDARY, marginBottom: 6 }}>Phone Number</ThemedText>
                <TextInput placeholder="+92 300 1234567" placeholderTextColor={colors.TEXT_SECONDARY} keyboardType="phone-pad" value={newPhone} onChangeText={setNewPhone} style={[styles.input, { backgroundColor: colors.BG_TERTIARY, borderColor: colors.BORDER, color: colors.TEXT_PRIMARY }]} />
              </View>
            </View>

            <View style={{ marginTop: 24 }}>
              <GradientButton title="Save Contact" onPress={handleAddContact} />
            </View>
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  input: { height: 50, borderRadius: 12, borderWidth: 1, paddingHorizontal: 16, fontSize: 15 }
});