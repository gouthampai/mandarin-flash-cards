import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Speech from 'expo-speech';
import { FontAwesome5 } from '@expo/vector-icons';
import { pinyin } from 'pinyin-pro';
import { characters, getToneColor, getToneName } from '../data/characters';
import { useProgress, isDue } from '../hooks/useProgress';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

const PRAISE = [
  'Chinese baddie in your future!', 
  'Excellent!', 'Amazing!', 'Fantastic!', 'Outstanding!', 'Brilliant!',
  'Superb!', 'Incredible!', 'Phenomenal!', 'Magnificent!', 'Spectacular!',
  'Flawless!', 'Perfect!', 'Nailed it!', 'Crushed it!', 'Spot on!',
  'Legendary!', 'Masterful!', 'Extraordinary!', 'Sensational!', 'On fire!',
  'Unstoppable!', 'Impeccable!', 'Sublime!', 'Stellar!', 'Glorious!',
  'Impressive!', 'Exceptional!', 'Dazzling!', 'Immaculate!', 'Exquisite!',
  // fortune cookie easter eggs
  'A journey of a thousand miles begins with a single character.',
  'He who masters tones shall never go hungry in Beijing.',
  'Your future holds many dumplings and great success.',
  'The wise traveler learns the bathroom sign before all others.',
  'Confucius say: one who studies flashcards is already halfway there.',
  'He who orders off the menu impresses everyone at the table.',
  'Lucky numbers: 1, 6, 8, 88, 888.',
  'A good memory is the beginning of wisdom. Flashcards also help.',
  'You will soon say something that makes a local smile.',
  'The man who asks is a fool for five minutes. You asked nothing — you knew it.',
];

const speak = (character) => {
  Speech.stop();
  Speech.speak(character, { language: 'zh-CN', rate: 1.0 });
};

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.92;

export default function FlashCardScreen({ onGoToStats, onGoToCardList }) {
  const { progress, markCard, stats } = useProgress();
  const {
    state: listenState,
    heard,
    volume,
    permissionGranted,
    start: startListening,
    stop: stopListening,
    reset: resetListening,
  } = useSpeechRecognition();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [filterMode, setFilterMode] = useState('all');
  const flipAnim = useRef(new Animated.Value(0)).current;
  // Track whether we've already done one silent retry for the current recording attempt.
  // Resets on card navigation or any explicit user-initiated start.
  const silentRetryDoneRef = useRef(false);

  const filteredCards =
    filterMode === 'learning' ? characters.filter(c => !progress[c.id]?.known) :
    filterMode === 'due'      ? characters.filter(c => isDue(progress[c.id])) :
    characters;

  const card = filteredCards[currentIndex] || characters[0];
  const toneColor = getToneColor(card.tone);
  const cardProgress = progress[card.id];

  const contextStrings = [card.character, card.pinyin];

  const flipCard = () => {
    const toValue = isFlipped ? 0 : 1;
    Animated.spring(flipAnim, { toValue, friction: 8, tension: 10, useNativeDriver: true }).start();
    if (!isFlipped) speak(card.character);
    setIsFlipped(!isFlipped);
  };

  const frontInterpolate = flipAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });
  const backInterpolate = flipAnim.interpolate({ inputRange: [0, 1], outputRange: ['180deg', '360deg'] });
  const frontOpacity = flipAnim.interpolate({ inputRange: [0, 0.5, 0.5, 1], outputRange: [1, 1, 0, 0] });
  const backOpacity = flipAnim.interpolate({ inputRange: [0, 0.5, 0.5, 1], outputRange: [0, 0, 1, 1] });

  const resetCard = () => {
    setIsFlipped(false);
    flipAnim.setValue(0);
    resetListening();
    silentRetryDoneRef.current = false;
  };

  const goNext = (known) => {
    markCard(card.id, known);
    resetCard();
    setTimeout(() => {
      setCurrentIndex(prev => {
        const next = prev + 1;
        return next < filteredCards.length ? next : 0;
      });
    }, 50);
  };

  const goPrev = () => {
    resetCard();
    setTimeout(() => {
      setCurrentIndex(prev => (prev - 1 + filteredCards.length) % filteredCards.length);
    }, 50);
  };

  const setFilter = (mode) => {
    setFilterMode(mode);
    setCurrentIndex(0);
    resetCard();
  };

  // Preview the interval that would result from each rating choice
  const previewInterval = (known) => {
    const p = cardProgress;
    if (known) {
      const reps = p?.repetitions ?? 0;
      if (reps === 0) return '1d';
      if (reps === 1) return '6d';
      return `${Math.round((p?.interval ?? 1) * (p?.easeFactor ?? 2.5))}d`;
    }
    return '1d';
  };

  // On the first no-speech result, silently restart rather than interrupting the user.
  // Only surface the modal after two consecutive empty sessions.
  useEffect(() => {
    if (listenState === 'no-speech' && !silentRetryDoneRef.current) {
      silentRetryDoneRef.current = true;
      const t = setTimeout(() => {
        resetListening();
        startListening({ contextualStrings: contextStrings });
      }, 500);
      return () => clearTimeout(t);
    }
  }, [listenState]); // eslint-disable-line react-hooks/exhaustive-deps

  // Result modal — shown for 'done', or 'no-speech' only after the silent retry has fired
  const cardAliases = card.aliases ?? [];
  const isCorrect = heard?.some(t =>
    t.includes(card.character) || cardAliases.some(alias => t.includes(alias))
  );
  const displayHeard = heard?.[heard.length - 1];
  const modalVisible =
    listenState === 'done' ||
    (listenState === 'no-speech' && silentRetryDoneRef.current);

  // Snapshot whether the card was unflipped when the result arrived so the
  // modal can show the right praise even if the user flips the card afterward.
  const wasUnflippedRef = useRef(false);
  useEffect(() => {
    if (listenState === 'done') wasUnflippedRef.current = !isFlipped;
  }, [listenState]); // eslint-disable-line react-hooks/exhaustive-deps

  // Pick a new praise word each recognition session (changes when heard changes).
  const praiseWord = useMemo(
    () => PRAISE[Math.floor(Math.random() * PRAISE.length)],
    [heard],
  );

  if (filteredCards.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🎉</Text>
          <Text style={styles.emptyTitle}>All caught up!</Text>
          <Text style={styles.emptySubtitle}>You've marked all characters as known.</Text>
          <TouchableOpacity style={styles.resetFilterBtn} onPress={() => setFilter('all')}>
            <Text style={styles.resetFilterText}>Review All Cards</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>

      {/* Result modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={resetListening}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => { silentRetryDoneRef.current = false; resetListening(); }}
        >
          {/* Inner card stops touch from bubbling to the overlay dismiss */}
          <View style={styles.modalCard} onStartShouldSetResponder={() => true}>
            {listenState === 'no-speech' ? (
              <>
                <FontAwesome5 name="microphone-slash" size={36} color="#BDC3C7" />
                <Text style={styles.modalTitle}>Nothing heard</Text>
                <Text style={styles.modalSubtitle}>Try speaking a little louder</Text>
                <TouchableOpacity
                  style={styles.modalPrimaryBtn}
                  onPress={() => {
                    silentRetryDoneRef.current = false;
                    resetListening();
                    startListening({ contextualStrings: contextStrings });
                  }}
                >
                  <Text style={styles.modalPrimaryBtnText}>Try again</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { silentRetryDoneRef.current = false; resetListening(); }}>
                  <Text style={styles.modalDismissText}>Dismiss</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <FontAwesome5
                  name={isCorrect ? (wasUnflippedRef.current ? 'star' : 'check-circle') : 'times-circle'}
                  size={48}
                  color={isCorrect ? (wasUnflippedRef.current ? '#F39C12' : '#27AE60') : '#E74C3C'}
                />
                <Text style={[styles.modalTitle, { color: isCorrect ? (wasUnflippedRef.current ? '#F39C12' : '#27AE60') : '#E74C3C' }]}>
                  {isCorrect ? (wasUnflippedRef.current ? praiseWord : 'Correct!') : 'Not quite'}
                </Text>
                {!isCorrect && displayHeard && (
                  <>
                    <Text style={styles.modalLabel}>We heard</Text>
                    <Text style={styles.modalHeard}>{displayHeard}</Text>
                    <Text style={styles.modalPinyin}>
                      {pinyin(displayHeard, { toneType: 'symbol', separator: ' ' })}
                    </Text>
                  </>
                )}
                <TouchableOpacity
                  style={styles.modalPrimaryBtn}
                  onPress={() => { resetListening(); startListening({ contextualStrings: contextStrings }); }}
                >
                  <Text style={styles.modalPrimaryBtnText}>Try again</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={resetListening}>
                  <Text style={styles.modalDismissText}>Dismiss</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Mandarin Flash Cards</Text>
        <View style={styles.headerBtns}>
          <TouchableOpacity onPress={onGoToCardList} style={styles.statsBtn}>
            <Text style={styles.statsBtnText}>Cards</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onGoToStats} style={styles.statsBtn}>
            <Text style={styles.statsBtnText}>Stats →</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter tabs */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[styles.filterTab, filterMode === 'due' && styles.filterTabActive]}
          onPress={() => setFilter('due')}
        >
          <Text style={[styles.filterTabText, filterMode === 'due' && styles.filterTabTextActive]}>
            Due ({stats.due})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, filterMode === 'learning' && styles.filterTabActive]}
          onPress={() => setFilter('learning')}
        >
          <Text style={[styles.filterTabText, filterMode === 'learning' && styles.filterTabTextActive]}>
            Learning ({stats.total - stats.known})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, filterMode === 'all' && styles.filterTabActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterTabText, filterMode === 'all' && styles.filterTabTextActive]}>
            All ({characters.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Progress bar */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${(stats.known / stats.total) * 100}%` }]} />
      </View>
      <Text style={styles.progressText}>{stats.known} / {stats.total} known</Text>
      <Text style={styles.counter}>{currentIndex + 1} / {filteredCards.length}</Text>

      {/* Flash Card — flex:1 so it fills all remaining vertical space */}
      <TouchableOpacity activeOpacity={0.95} onPress={flipCard} style={styles.cardContainer}>
        {/* Front */}
        <Animated.View
          style={[
            styles.card,
            styles.cardFront,
            { borderTopColor: toneColor },
            { transform: [{ rotateY: frontInterpolate }], opacity: frontOpacity },
          ]}
        >
          <Text style={styles.characterFrequency}>#{card.id} most common</Text>
          <Text style={styles.character}>{card.character}</Text>
          <Text style={styles.tapHint}>Tap to reveal</Text>
          <TouchableOpacity style={styles.speakBtn} onPress={(e) => { e.stopPropagation?.(); speak(card.character); }}>
            <FontAwesome5 name="volume-up" size={18} color="#7F8C8D" />
          </TouchableOpacity>
          {cardProgress && (
            <View style={[styles.knownBadge, { backgroundColor: cardProgress.known ? '#27AE60' : '#E67E22' }]}>
              <Text style={styles.knownBadgeText}>{cardProgress.known ? '✓ Known' : '~ Learning'}</Text>
            </View>
          )}
        </Animated.View>

        {/* Back */}
        <Animated.View
          style={[
            styles.card,
            styles.cardBack,
            { borderTopColor: toneColor },
            { transform: [{ rotateY: backInterpolate }], opacity: backOpacity },
          ]}
        >
          <TouchableOpacity style={styles.speakBtn} onPress={(e) => { e.stopPropagation?.(); speak(card.character); }}>
            <FontAwesome5 name="volume-up" size={18} color="#7F8C8D" />
          </TouchableOpacity>
          <Text style={styles.pinyinLabel}>Pinyin</Text>
          <Text style={[styles.pinyin, { color: toneColor }]}>{card.pinyin}</Text>
          <Text style={[styles.toneName, { color: toneColor }]}>{getToneName(card.tone)}</Text>
          <View style={styles.divider} />
          <Text style={styles.meaningLabel}>Meaning</Text>
          <Text style={styles.meaning}>{card.meaning}</Text>
        </Animated.View>
      </TouchableOpacity>

      {/* Mic button — always visible so pronunciation can be attempted before flipping */}
      <View style={styles.micRow}>
          {permissionGranted === false ? (
            <Text style={styles.practiceNoPermission}>Microphone permission denied</Text>
          ) : listenState === 'idle' || listenState === 'error' ? (
            <TouchableOpacity
              style={styles.micBtn}
              onPress={() => startListening({ contextualStrings: contextStrings })}
            >
              <FontAwesome5 name="microphone" size={18} color="#2C3E50" />
              <Text style={styles.micBtnText}>Tap to speak</Text>
            </TouchableOpacity>
          ) : listenState === 'starting' ? (
            <View style={[styles.micBtn, styles.micBtnStarting]}>
              <FontAwesome5 name="microphone" size={18} color="#BDC3C7" />
              <Text style={[styles.micBtnText, { color: '#BDC3C7' }]}>Starting...</Text>
            </View>
          ) : listenState === 'listening' ? (
            <View style={styles.listeningGroup}>
              <View style={styles.volumeBar}>
                <View style={[
                  styles.volumeFill,
                  { width: `${Math.min(100, Math.max(0, (volume + 2) / 12 * 100))}%` },
                  volume > 3 ? styles.volumeHigh : volume > 0 ? styles.volumeMid : styles.volumeLow,
                ]} />
              </View>
              <TouchableOpacity style={styles.stopIconBtn} onPress={stopListening}>
                <FontAwesome5 name="stop-circle" size={36} color="#E74C3C" />
              </TouchableOpacity>
              <TouchableOpacity onPress={resetListening}>
                <Text style={styles.listeningDismiss}>Dismiss</Text>
              </TouchableOpacity>
            </View>
          ) : listenState === 'processing' ? (
            <View style={styles.processingBadge}>
              <Text style={styles.processingText}>Processing...</Text>
            </View>
          ) : null}
        </View>

      {/* Navigation & rating buttons */}
      {isFlipped ? (
        <View style={styles.ratingRow}>
          <View style={[styles.ratingBtnWrapper, styles.againBtn]}>
            <TouchableOpacity style={styles.ratingBtn} onPress={() => goNext(false)}>
              <Text style={styles.ratingBtnText}>Again</Text>
              <Text style={styles.ratingBtnInterval}>{previewInterval(false)}</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.ratingBtnWrapper, styles.knownBtn]}>
            <TouchableOpacity style={styles.ratingBtn} onPress={() => goNext(true)}>
              <Text style={styles.ratingBtnText}>Got It!</Text>
              <Text style={styles.ratingBtnInterval}>{previewInterval(true)}</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.navRow}>
          <TouchableOpacity style={styles.navBtn} onPress={goPrev}>
            <Text style={styles.navBtnText}>← Prev</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.navBtn, styles.nextBtn]} onPress={() => goNext(cardProgress?.known ?? false)}>
            <Text style={[styles.navBtnText, styles.nextBtnText]}>Skip →</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
    alignItems: 'center',
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
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
  modalTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2C3E50',
    marginTop: 4,
  },
  modalSubtitle: {
    fontSize: 15,
    color: '#7F8C8D',
  },
  modalLabel: {
    fontSize: 11,
    color: '#BDC3C7',
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginTop: 8,
  },
  modalHeard: {
    fontSize: 40,
    fontWeight: '400',
    color: '#2C3E50',
  },
  modalPinyin: {
    fontSize: 15,
    color: '#7F8C8D',
    marginBottom: 4,
  },
  modalPrimaryBtn: {
    backgroundColor: '#2980B9',
    paddingVertical: 13,
    paddingHorizontal: 40,
    borderRadius: 22,
    marginTop: 10,
  },
  modalPrimaryBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalDismissText: {
    fontSize: 13,
    color: '#BDC3C7',
    marginTop: 6,
    textDecorationLine: 'underline',
  },

  // Header
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2C3E50',
  },
  headerBtns: {
    flexDirection: 'row',
    gap: 12,
  },
  statsBtn: {
    padding: 6,
  },
  statsBtnText: {
    color: '#2980B9',
    fontWeight: '600',
    fontSize: 15,
  },

  // Filter
  filterRow: {
    flexDirection: 'row',
    backgroundColor: '#E8EAF0',
    borderRadius: 10,
    padding: 3,
    marginBottom: 10,
  },
  filterTab: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  filterTabActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  filterTabText: {
    fontSize: 13,
    color: '#7F8C8D',
    fontWeight: '500',
  },
  filterTabTextActive: {
    color: '#2C3E50',
    fontWeight: '600',
  },

  // Progress
  progressBar: {
    width: CARD_WIDTH,
    height: 5,
    backgroundColor: '#DFE1E8',
    borderRadius: 3,
    marginBottom: 3,
    overflow: 'hidden',
  },
  progressFill: {
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

  // Card — flex:1 fills all remaining vertical space
  cardContainer: {
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  cardFront: { backgroundColor: '#FFFFFF' },
  cardBack: { backgroundColor: '#FFFFFF' },
  characterFrequency: {
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
  speakBtn: {
    position: 'absolute',
    top: 14,
    left: 16,
    padding: 8,
  },
  knownBadge: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  knownBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  pinyinLabel: {
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
  meaningLabel: {
    fontSize: 11,
    color: '#BDC3C7',
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  meaning: {
    fontSize: 18,
    color: '#2C3E50',
    textAlign: 'center',
    fontWeight: '400',
    lineHeight: 26,
    paddingHorizontal: 8,
  },

  // Mic controls (below card, when flipped)
  micRow: {
    alignItems: 'center',
    marginBottom: 10,
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
  micBtnActive: {
    borderColor: '#E74C3C',
    backgroundColor: '#FDF0EF',
    gap: 8,
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
  stopIconBtn: {
    padding: 6,
  },
  listeningDismiss: {
    fontSize: 13,
    color: '#BDC3C7',
    textDecorationLine: 'underline',
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
  volumeLow: { backgroundColor: '#BDC3C7' },
  volumeMid: { backgroundColor: '#E67E22' },
  volumeHigh: { backgroundColor: '#27AE60' },
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
  practiceNoPermission: {
    fontSize: 12,
    color: '#E74C3C',
  },

  // Rating / nav buttons
  ratingRow: {
    flexDirection: 'row',
    marginBottom: 8,
    gap: 16,
  },
  ratingBtnWrapper: {
    borderRadius: 16,
    minWidth: 150,
    overflow: 'hidden',
  },
  ratingBtn: {
    paddingVertical: 16,
    paddingHorizontal: 28,
    alignItems: 'center',
  },
  againBtn: { backgroundColor: '#E74C3C' },
  knownBtn: { backgroundColor: '#27AE60' },
  ratingBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  ratingBtnInterval: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 11,
    marginTop: 2,
  },
  navRow: {
    flexDirection: 'row',
    marginBottom: 8,
    gap: 16,
  },
  navBtn: {
    paddingVertical: 16,
    paddingHorizontal: 36,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#DFE1E8',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  nextBtn: {
    backgroundColor: '#2980B9',
    borderColor: '#2980B9',
  },
  navBtnText: {
    color: '#7F8C8D',
    fontSize: 16,
    fontWeight: '600',
  },
  nextBtnText: { color: '#fff' },

  // Empty state
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyEmoji: { fontSize: 60, marginBottom: 16 },
  emptyTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    marginBottom: 32,
  },
  resetFilterBtn: {
    backgroundColor: '#2980B9',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 14,
  },
  resetFilterText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
