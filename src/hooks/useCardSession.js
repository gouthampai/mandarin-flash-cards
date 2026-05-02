import { useState, useRef, useEffect, useMemo } from 'react';
import { Animated } from 'react-native';
import { characters, getToneColor } from '../data/characters';
import { useProgress, isDue } from './useProgress';
import { PRAISE, speak } from '../constants/flashcard';

export const useCardSession = ({ listenState, heard, startListening, resetListening }) => {
  const { progress, markCard, stats } = useProgress();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped]       = useState(false);
  const [filterMode, setFilterMode]     = useState('all');

  const flipAnim           = useRef(new Animated.Value(0)).current;
  const silentRetryDoneRef = useRef(false);
  const wasUnflippedRef    = useRef(false);

  const filteredCards =
    filterMode === 'learning' ? characters.filter(c => !progress[c.id]?.known) :
    filterMode === 'due'      ? characters.filter(c => isDue(progress[c.id])) :
    characters;

  const card         = filteredCards[currentIndex] || characters[0];
  const toneColor    = getToneColor(card.tone);
  const cardProgress = progress[card.id];
  const contextStrings = [card.character, card.pinyin];

  // Animated interpolations for the flip
  const frontInterpolate = flipAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });
  const backInterpolate  = flipAnim.interpolate({ inputRange: [0, 1], outputRange: ['180deg', '360deg'] });
  const frontOpacity     = flipAnim.interpolate({ inputRange: [0, 0.5, 0.5, 1], outputRange: [1, 1, 0, 0] });
  const backOpacity      = flipAnim.interpolate({ inputRange: [0, 0.5, 0.5, 1], outputRange: [0, 0, 1, 1] });

  const resetCard = () => {
    setIsFlipped(false);
    flipAnim.setValue(0);
    resetListening();
    silentRetryDoneRef.current = false;
  };

  const flipCard = () => {
    const toValue = isFlipped ? 0 : 1;
    Animated.spring(flipAnim, { toValue, friction: 8, tension: 10, useNativeDriver: true }).start();
    if (!isFlipped) speak(card.character);
    setIsFlipped(prev => !prev);
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

  // On the first no-speech result, silently restart rather than interrupting the user.
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

  // Snapshot whether the card was unflipped the moment a result lands.
  useEffect(() => {
    if (listenState === 'done') wasUnflippedRef.current = !isFlipped;
  }, [listenState]); // eslint-disable-line react-hooks/exhaustive-deps

  // Derived recognition values
  const cardAliases = card.aliases ?? [];
  const isCorrect = heard?.some(t =>
    t.includes(card.character) || cardAliases.some(alias => t.includes(alias))
  );
  const displayHeard = heard?.[heard.length - 1] ?? null;
  const modalVisible =
    listenState === 'done' ||
    (listenState === 'no-speech' && silentRetryDoneRef.current);

  // Pick a new praise word each recognition session.
  const praiseWord = useMemo(
    () => PRAISE[Math.floor(Math.random() * PRAISE.length)],
    [heard],
  );

  return {
    // data hooks
    progress,
    markCard,
    stats,
    // card identity
    card,
    toneColor,
    cardProgress,
    contextStrings,
    // navigation
    currentIndex,
    filteredCards,
    isFlipped,
    filterMode,
    flipCard,
    goNext,
    goPrev,
    setFilter,
    // animation
    frontInterpolate,
    backInterpolate,
    frontOpacity,
    backOpacity,
    // recognition results
    isCorrect,
    displayHeard,
    modalVisible,
    praiseWord,
    wasUnflippedRef,
    silentRetryDoneRef,
  };
};
