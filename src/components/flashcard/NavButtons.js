import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function NavButtons({ onPrev, onSkip }) {
  return (
    <View style={styles.row}>
      <TouchableOpacity style={styles.btn} onPress={onPrev}>
        <Text style={styles.btnText}>← Prev</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.btn, styles.skipBtn]} onPress={onSkip}>
        <Text style={[styles.btnText, styles.skipBtnText]}>Skip →</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginBottom: 8,
    gap: 16,
  },
  btn: {
    paddingVertical: 16,
    paddingHorizontal: 36,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#DFE1E8',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  skipBtn: {
    backgroundColor: '#2980B9',
    borderColor: '#2980B9',
  },
  btnText: {
    color: '#7F8C8D',
    fontSize: 16,
    fontWeight: '600',
  },
  skipBtnText: {
    color: '#fff',
  },
});
