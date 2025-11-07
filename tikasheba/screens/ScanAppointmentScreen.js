import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme, BASE_URL } from '../theme';

export default function ScanAppointmentScreen({ token }) {
  const [qrText, setQrText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [parsedJson, setParsedJson] = useState(null);

  useEffect(() => {
    if (!permission) {
      // Initialize permission state
      requestPermission();
    }
  }, [permission]);

  const handleBarCodeScanned = ({ data }) => {
    setScanned(true);
    setQrText(data);
    try {
      const parsed = JSON.parse(data);
      setParsedJson(parsed);
      setResult({ type: 'success', message: 'QR scanned and parsed.' });
    } catch (e) {
      setParsedJson(null);
      setResult({ type: 'error', message: 'Scanned text is not valid JSON.' });
    }
  };

  async function markDone() {
    setLoading(true);
    setResult(null);
    try {
      let appointmentId = undefined;
      try {
        const parsed = JSON.parse(qrText);
        if (parsed && parsed.id) appointmentId = parsed.id;
      } catch (_) {
        const prefix = 'appointment:';
        if (qrText && qrText.startsWith(prefix)) {
          appointmentId = qrText.slice(prefix.length);
        }
      }
      const res = await fetch(`${BASE_URL}/api/appointment/done`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ qr_text: qrText, appointment_id: appointmentId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Failed to mark done');
      setResult({ type: 'success', message: `Done: ${data.id}` });
    } catch (e) {
      setResult({ type: 'error', message: e.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 24 }}>
        <Text style={styles.sectionTitle}>Scan Appointment QR</Text>

        <View style={styles.cameraCard}>
          {!permission || !permission.granted ? (
            <View>
              <Text style={styles.muted}>No access to camera. Please allow permission.</Text>
              <TouchableOpacity style={[styles.primaryBtn, { marginTop: 12 }]} onPress={requestPermission}>
                <Text style={styles.primaryBtnText}>Grant Camera Permission</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.cameraBox}>
              {!scanned ? (
                <CameraView
                  style={StyleSheet.absoluteFillObject}
                  facing="back"
                  barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
                  onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                />
              ) : (
                <View style={[styles.cameraOverlay, { justifyContent: 'center', alignItems: 'center' }]}>
                  <Text style={styles.overlayText}>QR Scanned</Text>
                </View>
              )}
              <View style={styles.scanFrame} />
            </View>
          )}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
            <TouchableOpacity style={styles.secondaryBtn} onPress={() => { setScanned(false); setParsedJson(null); setResult(null); }}>
              <Text style={styles.secondaryBtnText}>Scan Again</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryBtn} onPress={() => setQrText('')}>
              <Text style={styles.secondaryBtnText}>Clear</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.cameraHint}>Point camera at QR. Parsed JSON will appear below.</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.inputLabel}>Paste QR Payload</Text>
          <TextInput
            style={styles.input}
            placeholder="Paste scanned QR payload or appointment ID"
            placeholderTextColor={theme.muted}
            value={qrText}
            onChangeText={setQrText}
          />
          <TouchableOpacity style={styles.primaryBtn} onPress={markDone} disabled={loading || !qrText}>
            <Text style={styles.primaryBtnText}>{loading ? 'Marking...' : 'Mark Done'}</Text>
          </TouchableOpacity>
          {result && (
            <View style={[styles.alert, result.type === 'success' ? styles.alertSuccess : styles.alertError]}>
              <Text style={styles.alertText}>{result.message}</Text>
            </View>
          )}
          {parsedJson ? (
            <View style={styles.jsonCard}>
              <Text style={styles.jsonTitle}>Scanned JSON</Text>
              <View style={styles.jsonBlock}>
                <Text style={styles.codeText}>{JSON.stringify(parsedJson, null, 2)}</Text>
              </View>
            </View>
          ) : qrText ? (
            <View style={styles.jsonCard}>
              <Text style={styles.jsonTitle}>Scanned Text</Text>
              <View style={styles.jsonBlock}>
                <Text style={styles.codeText}>{qrText}</Text>
              </View>
            </View>
          ) : null}
        </View>
        <InfoBlock text="Tip: The scanner uses your back camera to read QR payloads. Use Mark Done to update appointment status." />
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
  cameraCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    marginTop: 12,
  },
  cameraBox: {
    height: 260,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  cameraOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)'
  },
  overlayText: { color: '#fff', fontWeight: '700' },
  scanFrame: {
    position: 'absolute',
    top: 24,
    left: 24,
    right: 24,
    bottom: 24,
    borderWidth: 2,
    borderColor: theme.primary,
    borderRadius: 12,
  },
  cameraHint: { color: theme.muted, marginTop: 8 },
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
  alert: {
    marginTop: 12,
    borderRadius: 10,
    padding: 12,
  },
  alertSuccess: { backgroundColor: '#E8F6EE', borderColor: '#A6E3B4', borderWidth: 1 },
  alertError: { backgroundColor: '#FDECEC', borderColor: '#F5A9A9', borderWidth: 1 },
  alertText: { color: theme.text },
  jsonCard: { marginTop: 12 },
  jsonTitle: { color: theme.text, fontWeight: '700', marginBottom: 6 },
  jsonBlock: { backgroundColor: '#F7F9FC', borderRadius: 10, padding: 12, borderWidth: 1, borderColor: '#E8EEF5' },
  codeText: { color: theme.text },
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
  muted: { color: theme.muted },
});