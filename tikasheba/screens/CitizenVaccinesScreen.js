import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme, BASE_URL } from '../theme';

export default function CitizenVaccinesScreen({ token }) {
  const [regId, setRegId] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function fetchVaccines() {
    setLoading(true);
    setError('');
    setData(null);
    try {
      const res = await fetch(`${BASE_URL}/api/vaccine/log/reg/${encodeURIComponent(regId)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const json = await res.json();
      console.log(json)
      if (!res.ok) throw new Error(json?.message || 'Failed to fetch');
      setData(json);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={styles.sectionTitle}>Citizen Vaccine List</Text>
        <View style={styles.card}>
          <Text style={styles.inputLabel}>Registration ID</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter registration ID"
            placeholderTextColor={theme.muted}
            value={regId}
            onChangeText={setRegId}
          />
          <TouchableOpacity style={styles.primaryBtn} onPress={fetchVaccines} disabled={loading || !regId}>
            <Text style={styles.primaryBtnText}>{loading ? 'Loading...' : 'Fetch List'}</Text>
          </TouchableOpacity>
          {!!error && <Text style={styles.errorText}>{error}</Text>}
        </View>

        {data && (
          <View style={styles.card}>
            <Text style={styles.sectionSubtitle}>Citizen</Text>
            <Text style={styles.kv}><Text style={styles.k}>Name:</Text> <Text style={styles.v}>{data.citizen?.name || '-'}</Text></Text>

            <Text style={[styles.sectionSubtitle, { marginTop: 12 }]}>Vaccines Taken</Text>
            {Array.isArray(data.logs) && data.logs.length > 0 ? (
              data.logs.map((item, idx) => (
                <View key={`${item.vaccine_id}-${idx}`} style={styles.listItem}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.listTitle}>{item.vaccine_name}</Text>
                    <Text style={styles.listSub}>{new Date(item.date).toLocaleString()}</Text>
                  </View>
                  <View style={[styles.badge, { backgroundColor: theme.green }]}>
                    <Text style={styles.badgeText}>Taken</Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.mutedText}>No records found</Text>
            )}
          </View>
        )}
        <InfoBlock text="Fetches vaccine logs by registration ID. Staff authentication required." />
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
  inputLabel: {
    color: theme.text,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E2E6EA',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: theme.text,
  },
  primaryBtn: {
    backgroundColor: theme.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 16,
  },
  primaryBtnText: {
    color: '#fff',
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  errorText: {
    color: '#B00020',
    marginTop: 8,
  },
  sectionSubtitle: {
    color: theme.text,
    fontWeight: '700',
    fontSize: 14,
    marginBottom: 8,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EDF2F7',
  },
  listTitle: {
    color: theme.text,
    fontWeight: '700',
  },
  listSub: {
    color: theme.muted,
    fontSize: 12,
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    color: '#fff',
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  mutedText: { color: theme.muted },
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