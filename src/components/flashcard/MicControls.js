import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

export default function MicControls({
  listenState,
  volume,
  permissionGranted,
  contextStrings,
  onStart,
  onStop,
  onReset,
}) {
  if (permissionGranted === false) {
    return (
      <View style={styles.row}>
        <Text style={styles.noPermission}>Microphone permission denied</Text>
      </View>
    );
  }

  if (listenState === 'idle' || listenState === 'error') {
    return (
      <View style={styles.row}>
        <TouchableOpacity style={styles.micBtn} onPress={() => onStart({ contextualStrings: contextStrings })}>
          <FontAwesome5 name="microphone" size={18} color="#2C3E50" />
          <Text style={styles.micBtnText}>Tap to speak</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (listenState === 'starting') {
    return (
      <View style={styles.row}>
        <View style={[styles.micBtn, styles.micBtnStarting]}>
          <FontAwesome5 name="microphone" size={18} color="#BDC3C7" />
          <Text style={[styles.micBtnText, { color: '#BDC3C7' }]}>Starting...</Text>
        </View>
      </View>
    );
  }

  if (listenState === 'listening') {
    const volumePct = `${Math.min(100, Math.max(0, (volume + 2) / 12 * 100))}%`;
    const volumeStyle = volume > 3 ? styles.volumeHigh : volume > 0 ? styles.volumeMid : styles.volumeLow;
    return (
      <View style={styles.row}>
        <View style={styles.listeningGroup}>
          <View style={styles.volumeBar}>
            <View style={[styles.volumeFill, { width: volumePct }, volumeStyle]} />
          </View>
          <TouchableOpacity style={styles.stopBtn} onPress={onStop}>
            <FontAwesome5 name="stop-circle" size={36} color="#E74C3C" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onReset}>
            <Text style={styles.dismiss}>Dismiss</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (listenState === 'processing') {
    return (
      <View style={styles.row}>
        <View style={styles.processingBadge}>
          <Text style={styles.processingText}>Processing...</Text>
        </View>
      </View>
    );
  }

  return <View style={styles.row} />;
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    marginBottom: 10,
  },
  noPermission: {
    fontSize: 12,
    color: '#E74C3C',
  },
  micBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 13,
    paddingHorizontal: 30,
    borderRadius: 26,
    borderWidth: 1.5,
    borderColor: '#BDC3C7',
  },
  micBtnStarting: {
    opacity: 0.5,
  },
  micBtnText: {
    fontSize: 16,
    color: '#2C3E50',
    fontWeight: '600',
  },
  listeningGroup: {
    alignItems: 'center',
    gap: 10,
  },
  volumeBar: {
    width: 120,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#F5C6C2',
    overflow: 'hidden',
  },
  volumeFill: {
    height: '100%',
    borderRadius: 2,
  },
  volumeLow:  { backgroundColor: '#BDC3C7' },
  volumeMid:  { backgroundColor: '#E67E22' },
  volumeHigh: { backgroundColor: '#27AE60' },
  stopBtn: {
    padding: 6,
  },
  dismiss: {
    fontSize: 13,
    color: '#BDC3C7',
    textDecorationLine: 'underline',
  },
  processingBadge: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 22,
    backgroundColor: '#EAF2FB',
  },
  processingText: {
    fontSize: 14,
    color: '#2980B9',
    fontWeight: '500',
  },
});
