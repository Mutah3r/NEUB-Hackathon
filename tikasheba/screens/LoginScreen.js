import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme, BASE_URL } from '../theme';

export default function LoginScreen({ onSuccess }) {
  const [centreId, setCentreId] = useState('');
  const [staffId, setStaffId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin() {
    setError('');
    if (!centreId || !staffId || !password) {
      setError('Please enter centre ID, staff ID, and password');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/staff/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vc_id: centreId, id: staffId, password }),
      });
      const data = await res.json();
      console.log(data);
      if (!res.ok) throw new Error(data?.message || 'Login failed');

      const token = data.token;

      // Fetch current user info
      const ures = await fetch(`${BASE_URL}/api/global/user`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = await ures.json();
      if (!ures.ok) throw new Error(user?.message || 'Failed to get user');
      console.log(user);

      // Persist token and user
      await AsyncStorage.setItem('ts_token', token);
      await AsyncStorage.setItem('ts_user', JSON.stringify(user));

      onSuccess(token, user);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScrollView contentContainerStyle={styles.centered}>
        <Text style={styles.appTitle}>Welcome</Text>
        <Text style={styles.appSubtitle}>Sign in to continue</Text>

        <View style={styles.card}>
          <Text style={styles.inputLabel}>Centre ID</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter centre ID"
            placeholderTextColor={theme.muted}
            value={centreId}
            onChangeText={setCentreId}
          />

          <Text style={styles.inputLabel}>Staff ID</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter staff ID"
            placeholderTextColor={theme.muted}
            value={staffId}
            onChangeText={setStaffId}
          />

          <Text style={styles.inputLabel}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter password"
            placeholderTextColor={theme.muted}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {!!error && <Text style={styles.errorText}>{error}</Text>}

          <TouchableOpacity style={styles.primaryBtn} onPress={handleLogin} disabled={loading}>
            <Text style={styles.primaryBtnText}>{loading ? 'Signing in...' : 'Sign In'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    flexGrow: 1,
  },
  appTitle: {
    color: theme.secondary,
    fontSize: 28,
    fontWeight: '800',
    marginTop: 24,
  },
  appSubtitle: {
    color: theme.muted,
    fontSize: 14,
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    width: '100%',
    maxWidth: 520,
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
});