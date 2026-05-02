import React from 'react';
import { TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { CARD_WIDTH, speak } from '../../constants/flashcard';
import CardFront from './CardFront';
import CardBack from './CardBack';

export default function FlashCard({
  card,
  toneColor,
  cardProgress,
  onFlip,
  frontInterpolate,
  backInterpolate,
  frontOpacity,
  backOpacity,
}) {
  const handleSpeak = (e) => {
    e.stopPropagation?.();
    speak(card.character);
  };

  return (
    <TouchableOpacity activeOpacity={0.95} onPress={onFlip} style={styles.container}>
      <Animated.View
        style={[
          styles.card,
          { borderTopColor: toneColor },
          { transform: [{ rotateY: frontInterpolate }], opacity: frontOpacity },
        ]}
      >
        <CardFront card={card} cardProgress={cardProgress} onSpeak={handleSpeak} />
      </Animated.View>

      <Animated.View
        style={[
          styles.card,
          { borderTopColor: toneColor },
          { transform: [{ rotateY: backInterpolate }], opacity: backOpacity },
        ]}
      >
        <CardBack card={card} toneColor={toneColor} onSpeak={handleSpeak} />
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    flex: 1,
    marginBottom: 10,
  },
  card: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 20,
    borderTopWidth: 5,
    padding: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backfaceVisibility: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
});
