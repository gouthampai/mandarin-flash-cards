import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { pinyin } from 'pinyin-pro';
import { CARD_WIDTH } from '../../constants/flashcard';

export default function RecognitionModal({
  visible,
  listenState,
  isCorrect,
  wasUnflipped,
  displayHeard,
  praiseWord,
  onDismiss,
  onTryAgain,
  onNextCard,
}) {
  const accentColor = isCorrect
    ? (wasUnflipped ? '#F39C12' : '#27AE60')
    : '#E74C3C';

  const iconName = isCorrect
    ? (wasUnflipped ? 'star' : 'check-circle')
    : 'times-circle';

  const titleText = isCorrect
    ? (wasUnflipped ? praiseWord : 'Correct!')
    : 'Not quite';

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onDismiss}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onDismiss}>
        <View style={styles.card} onStartShouldSetResponder={() => true}>

          {listenState === 'no-speech' ? (
            <>
              <FontAwesome5 name="microphone-slash" size={36} color="#BDC3C7" />
              <Text style={styles.title}>Nothing heard</Text>
              <Text style={styles.subtitle}>Try speaking a little louder</Text>
              <TouchableOpacity style={styles.primaryBtn} onPress={onTryAgain}>
                <Text style={styles.primaryBtnText}>Try again</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onDismiss}>
                <Text style={styles.dismissText}>Dismiss</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <FontAwesome5 name={iconName} size={48} color={accentColor} />
              <Text style={[styles.title, { color: accentColor }]}>{titleText}</Text>

              {!isCorrect && displayHeard && (
                <>
                  <Text style={styles.heardLabel}>We heard</Text>
                  <Text style={styles.heardText}>{displayHeard}</Text>
                  <Text style={styles.heardPinyin}>
                    {pinyin(displayHeard, { toneType: 'symbol', separator: ' ' })}
                  </Text>
                </>
              )}

              {isCorrect ? (
                <TouchableOpacity
                  style={[styles.primaryBtn, { backgroundColor: '#27AE60' }]}
                  onPress={onNextCard}
                >
                  <Text style={styles.primaryBtnText}>Next Card</Text>
                </TouchableOpacity>
              ) : (
                <>
                  <TouchableOpacity style={styles.primaryBtn} onPress={onTryAgain}>
                    <Text style={styles.primaryBtnText}>Try again</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={onDismiss}>
                    <Text style={styles.dismissText}>Dismiss</Text>
                  </TouchableOpacity>
                </>
              )}
            </>
          )}

        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 36,
    alignItems: 'center',
    gap: 10,
    width: CARD_WIDTH,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2C3E50',
    marginTop: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#7F8C8D',
  },
  heardLabel: {
    fontSize: 11,
    color: '#BDC3C7',
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginTop: 8,
  },
  heardText: {
    fontSize: 40,
    fontWeight: '400',
    color: '#2C3E50',
  },
  heardPinyin: {
    fontSize: 15,
    color: '#7F8C8D',
    marginBottom: 4,
  },
  primaryBtn: {
    backgroundColor: '#2980B9',
    paddingVertical: 13,
    paddingHorizontal: 40,
    borderRadius: 22,
    marginTop: 10,
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  dismissText: {
    fontSize: 13,
    color: '#BDC3C7',
    marginTop: 6,
    textDecorationLine: 'underline',
  },
});
