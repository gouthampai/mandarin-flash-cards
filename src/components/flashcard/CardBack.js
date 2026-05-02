import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { getToneName } from '../../data/characters';

export default function CardBack({ card, toneColor, onSpeak }) {
  return (
    <>
      <TouchableOpacity style={styles.speakBtn} onPress={onSpeak}>
        <FontAwesome5 name="volume-up" size={18} color="#7F8C8D" />
      </TouchableOpacity>
      <Text style={styles.label}>Pinyin</Text>
      <Text style={[styles.pinyin, { color: toneColor }]}>{card.pinyin}</Text>
      <Text style={[styles.toneName, { color: toneColor }]}>{getToneName(card.tone)}</Text>
      <View style={styles.divider} />
      <Text style={styles.label}>Meaning</Text>
      <Text style={styles.meaning}>{card.meaning}</Text>
    </>
  );
}

const styles = StyleSheet.create({
  speakBtn: {
    position: 'absolute',
    top: 14,
    left: 16,
    padding: 8,
  },
  label: {
    fontSize: 11,
    color: '#BDC3C7',
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  pinyin: {
    fontSize: 44,
    fontWeight: '300',
    marginBottom: 2,
  },
  toneName: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 20,
  },
  divider: {
    width: 40,
    height: 1,
    backgroundColor: '#ECF0F1',
    marginBottom: 20,
  },
  meaning: {
    fontSize: 18,
    color: '#2C3E50',
    textAlign: 'center',
    fontWeight: '400',
    lineHeight: 26,
    paddingHorizontal: 8,
  },
});
