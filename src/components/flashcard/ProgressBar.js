import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CARD_WIDTH } from '../../constants/flashcard';

export default function ProgressBar({ known, total, current, filteredCount }) {
  return (
    <>
      <View style={styles.bar}>
        <View style={[styles.fill, { width: `${(known / total) * 100}%` }]} />
      </View>
      <Text style={styles.progressText}>{known} / {total} known</Text>
      <Text style={styles.counter}>{current} / {filteredCount}</Text>
    </>
  );
}

const styles = StyleSheet.create({
  bar: {
    width: CARD_WIDTH,
    height: 5,
    backgroundColor: '#DFE1E8',
    borderRadius: 3,
    marginBottom: 3,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: '#27AE60',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#7F8C8D',
    marginBottom: 4,
  },
  counter: {
    fontSize: 13,
    color: '#95A5A6',
    marginBottom: 8,
    fontWeight: '500',
  },
});
