import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

export default function CardFront({ card, cardProgress, onSpeak }) {
  return (
    <>
      <TouchableOpacity style={styles.speakBtn} onPress={onSpeak}>
        <FontAwesome5 name="volume-up" size={18} color="#7F8C8D" />
      </TouchableOpacity>
      <Text style={styles.frequency}>#{card.id} most common</Text>
      <Text style={styles.character}>{card.character}</Text>
      <Text style={styles.tapHint}>Tap to reveal</Text>
      {cardProgress && (
        <View style={[styles.badge, { backgroundColor: cardProgress.known ? '#27AE60' : '#E67E22' }]}>
          <Text style={styles.badgeText}>{cardProgress.known ? '✓ Known' : '~ Learning'}</Text>
        </View>
      )}
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
  frequency: {
    position: 'absolute',
    top: 16,
    right: 16,
    fontSize: 11,
    color: '#BDC3C7',
    fontWeight: '500',
  },
  character: {
    fontSize: 120,
    color: '#2C3E50',
    fontWeight: '300',
    lineHeight: 140,
  },
  tapHint: {
    fontSize: 13,
    color: '#BDC3C7',
    marginTop: 8,
    fontStyle: 'italic',
  },
  badge: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
});
