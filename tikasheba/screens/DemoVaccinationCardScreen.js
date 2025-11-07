import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';

export default function DemoVaccinationCardScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={styles.sectionTitle}>Scan Vaccination Card (Demo)</Text>
        <View style={styles.card}>
          <Text style={styles.mutedText}>Feature coming soon.</Text>
          <Text style={styles.mutedText}>We will auto-detect vaccine and update records.</Text>
          <View style={{ height: 160, borderRadius: 12, borderWidth: 2, borderColor: theme.muted, marginTop: 16, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: theme.muted }}>Camera Preview Placeholder</Text>
          </View>
          <TouchableOpacity style={[styles.secondaryBtn, { marginTop: 16 }]}>
            <Text style={styles.secondaryBtnText}>Try Demo</Text>
          </TouchableOpacity>
        </View>
        <InfoBlock text="We will add OCR/QR parsing here and link to backend when APIs are ready." />
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoBlock({ text }) {
  return (
    <View style={styles.info}>
      <Text style={styles.infoText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    color: theme.text,
    fontSize: 20,
    fontWeight: '800',
    marginHorizontal: 16,
    marginTop: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    marginTop: 12,
  },
  mutedText: { color: theme.muted },
  secondaryBtn: {
    backgroundColor: theme.secondary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  secondaryBtnText: {
    color: '#fff',
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  info: {
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: '#FFF5F2',
    borderLeftWidth: 6,
    borderLeftColor: theme.primary,
    padding: 12,
    borderRadius: 12,
  },
  infoText: { color: theme.text },
});