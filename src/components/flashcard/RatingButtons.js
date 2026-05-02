import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { previewInterval } from '../../utils/srs';

export default function RatingButtons({ cardProgress, onAgain, onGotIt }) {
  return (
    <View style={styles.row}>
      <View style={[styles.btnWrapper, styles.againWrapper]}>
        <TouchableOpacity style={styles.btn} onPress={onAgain}>
          <Text style={styles.btnText}>Again</Text>
          <Text style={styles.interval}>{previewInterval(cardProgress, false)}</Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.btnWrapper, styles.gotItWrapper]}>
        <TouchableOpacity style={styles.btn} onPress={onGotIt}>
          <Text style={styles.btnText}>Got It!</Text>
          <Text style={styles.interval}>{previewInterval(cardProgress, true)}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginBottom: 8,
    gap: 16,
  },
  btnWrapper: {
    borderRadius: 16,
    minWidth: 150,
    overflow: 'hidden',
  },
  againWrapper: { backgroundColor: '#E74C3C' },
  gotItWrapper: { backgroundColor: '#27AE60' },
  btn: {
    paddingVertical: 16,
    paddingHorizontal: 28,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  interval: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 11,
    marginTop: 2,
  },
});
