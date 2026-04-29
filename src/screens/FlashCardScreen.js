import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  Platform,
} from 'react-native';
import { characters, getToneColor, getToneName } from '../data/characters';
import { useProgress } from '../hooks/useProgress';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width * 0.88;
const CARD_HEIGHT = height * 0.48;

export default function FlashCardScreen({ onGoToStats }) {
  const { progress, markCard, stats } = useProgress();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'learning'
  const flipAnim = useRef(new Animated.Value(0)).current;

  const filteredCards = filterMode === 'learning'
    ? characters.filter(c => !progress[c.id]?.known)
    : characters;

  const card = filteredCards[currentIndex] || characters[0];
  const toneColor = getToneColor(card.tone);
  const cardProgress = progress[card.id];

  const flipCard = () => {
    const toValue = isFlipped ? 0 : 1;
    Animated.spring(flipAnim, {
      toValue,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
    setIsFlipped(!isFlipped);
  };

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  const frontOpacity = flipAnim.interpolate({
    inputRange: [0, 0.5, 0.5, 1],
    outputRange: [1, 1, 0, 0],
  });

  const backOpacity = flipAnim.interpolate({
    inputRange: [0, 0.5, 0.5, 1],
    outputRange: [0, 0, 1, 1],
  });

  const goNext = (known) => {
    markCard(card.id, known);
    setIsFlipped(false);
    flipAnim.setValue(0);
    setTimeout(() => {
      setCurrentIndex(prev => {
        const next = prev + 1;
        return next < filteredCards.length ? next : 0;
      });
    }, 50);
  };

  const goPrev = () => {
    setIsFlipped(false);
    flipAnim.setValue(0);
    setTimeout(() => {
      setCurrentIndex(prev => (prev - 1 + filteredCards.length) % filteredCards.length);
    }, 50);
  };

  const setFilter = (mode) => {
    setFilterMode(mode);
    setCurrentIndex(0);
    setIsFlipped(false);
    flipAnim.setValue(0);
  };

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
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Mandarin Flash Cards</Text>
        <TouchableOpacity onPress={onGoToStats} style={styles.statsBtn}>
          <Text style={styles.statsBtnText}>Stats →</Text>
        </TouchableOpacity>
      </View>

      {/* Filter tabs */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[styles.filterTab, filterMode === 'all' && styles.filterTabActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterTabText, filterMode === 'all' && styles.filterTabTextActive]}>
            All ({characters.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, filterMode === 'learning' && styles.filterTabActive]}
          onPress={() => setFilter('learning')}
        >
          <Text style={[styles.filterTabText, filterMode === 'learning' && styles.filterTabTextActive]}>
            Still Learning ({stats.total - stats.known})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Progress bar */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${(stats.known / stats.total) * 100}%` }]} />
      </View>
      <Text style={styles.progressText}>{stats.known} / {stats.total} known</Text>

      {/* Card counter */}
      <Text style={styles.counter}>
        {currentIndex + 1} / {filteredCards.length}
      </Text>

      {/* Flash Card */}
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
          <Text style={styles.pinyinLabel}>Pinyin</Text>
          <Text style={[styles.pinyin, { color: toneColor }]}>{card.pinyin}</Text>
          <Text style={[styles.toneName, { color: toneColor }]}>{getToneName(card.tone)}</Text>
          <View style={styles.divider} />
          <Text style={styles.meaningLabel}>Meaning</Text>
          <Text style={styles.meaning}>{card.meaning}</Text>
        </Animated.View>
      </TouchableOpacity>

      {/* Navigation & rating buttons */}
      {isFlipped ? (
        <View style={styles.ratingRow}>
          <View style={[styles.ratingBtnWrapper, styles.againBtn]}>
            <TouchableOpacity style={styles.ratingBtn} onPress={() => goNext(false)}>
              <Text style={styles.ratingBtnText}>Still Learning</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.ratingBtnWrapper, styles.knownBtn]}>
            <TouchableOpacity style={styles.ratingBtn} onPress={() => goNext(true)}>
              <Text style={styles.ratingBtnText}>Got It!</Text>
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
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 20 : 8,
    paddingBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2C3E50',
  },
  statsBtn: {
    padding: 6,
  },
  statsBtnText: {
    color: '#2980B9',
    fontWeight: '600',
    fontSize: 15,
  },
  filterRow: {
    flexDirection: 'row',
    backgroundColor: '#E8EAF0',
    borderRadius: 10,
    padding: 3,
    marginBottom: 12,
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
  progressBar: {
    width: CARD_WIDTH,
    height: 6,
    backgroundColor: '#DFE1E8',
    borderRadius: 3,
    marginBottom: 4,
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
    marginBottom: 6,
  },
  counter: {
    fontSize: 13,
    color: '#95A5A6',
    marginBottom: 10,
    fontWeight: '500',
  },
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
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
  cardFront: {
    backgroundColor: '#FFFFFF',
  },
  cardBack: {
    backgroundColor: '#FFFFFF',
  },
  characterFrequency: {
    position: 'absolute',
    top: 16,
    right: 16,
    fontSize: 11,
    color: '#BDC3C7',
    fontWeight: '500',
  },
  character: {
    fontSize: 110,
    color: '#2C3E50',
    fontWeight: '300',
    lineHeight: 130,
  },
  tapHint: {
    fontSize: 13,
    color: '#BDC3C7',
    marginTop: 8,
    fontStyle: 'italic',
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
    fontSize: 42,
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
    fontSize: 16,
    color: '#2C3E50',
    textAlign: 'center',
    fontWeight: '400',
    lineHeight: 24,
    paddingHorizontal: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    marginTop: 24,
    gap: 16,
  },
  ratingBtnWrapper: {
    borderRadius: 14,
    minWidth: 140,
    overflow: 'hidden',
  },
  ratingBtn: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  againBtn: {
    backgroundColor: '#E74C3C',
  },
  knownBtn: {
    backgroundColor: '#27AE60',
  },
  ratingBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  navRow: {
    flexDirection: 'row',
    marginTop: 24,
    gap: 16,
  },
  navBtn: {
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 14,
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
    fontSize: 15,
    fontWeight: '600',
  },
  nextBtnText: {
    color: '#fff',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyEmoji: {
    fontSize: 60,
    marginBottom: 16,
  },
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
