import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useCardSession } from '../hooks/useCardSession';
import ScreenHeader     from '../components/flashcard/ScreenHeader';
import FilterTabs       from '../components/flashcard/FilterTabs';
import ProgressBar      from '../components/flashcard/ProgressBar';
import FlashCard        from '../components/flashcard/FlashCard';
import MicControls      from '../components/flashcard/MicControls';
import RecognitionModal from '../components/flashcard/RecognitionModal';
import RatingButtons    from '../components/flashcard/RatingButtons';
import NavButtons       from '../components/flashcard/NavButtons';

export default function FlashCardScreen({ onGoToStats, onGoToCardList }) {
  const {
    state: listenState,
    heard,
    volume,
    permissionGranted,
    start: startListening,
    stop: stopListening,
    reset: resetListening,
  } = useSpeechRecognition();

  const {
    stats,
    card,
    toneColor,
    cardProgress,
    contextStrings,
    currentIndex,
    filteredCards,
    isFlipped,
    filterMode,
    flipCard,
    goNext,
    goPrev,
    setFilter,
    frontInterpolate,
    backInterpolate,
    frontOpacity,
    backOpacity,
    isCorrect,
    displayHeard,
    modalVisible,
    praiseWord,
    wasUnflippedRef,
    silentRetryDoneRef,
  } = useCardSession({ listenState, heard, startListening, resetListening });

  const handleDismiss = () => {
    silentRetryDoneRef.current = false;
    resetListening();
  };

  const handleTryAgain = () => {
    silentRetryDoneRef.current = false;
    resetListening();
    startListening({ contextualStrings: contextStrings });
  };

  const handleNextCard = () => {
    resetListening();
    goNext(true);
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
      <RecognitionModal
        visible={modalVisible}
        listenState={listenState}
        isCorrect={isCorrect}
        wasUnflipped={wasUnflippedRef.current}
        displayHeard={displayHeard}
        praiseWord={praiseWord}
        onDismiss={handleDismiss}
        onTryAgain={handleTryAgain}
        onNextCard={handleNextCard}
      />

      <ScreenHeader onGoToStats={onGoToStats} onGoToCardList={onGoToCardList} />

      <FilterTabs filterMode={filterMode} stats={stats} onSelect={setFilter} />

      <ProgressBar
        known={stats.known}
        total={stats.total}
        current={currentIndex + 1}
        filteredCount={filteredCards.length}
      />

      <FlashCard
        card={card}
        toneColor={toneColor}
        cardProgress={cardProgress}
        onFlip={flipCard}
        frontInterpolate={frontInterpolate}
        backInterpolate={backInterpolate}
        frontOpacity={frontOpacity}
        backOpacity={backOpacity}
      />

      <MicControls
        listenState={listenState}
        volume={volume}
        permissionGranted={permissionGranted}
        contextStrings={contextStrings}
        onStart={startListening}
        onStop={stopListening}
        onReset={resetListening}
      />

      {isFlipped ? (
        <RatingButtons
          cardProgress={cardProgress}
          onAgain={() => goNext(false)}
          onGotIt={() => goNext(true)}
        />
      ) : (
        <NavButtons
          onPrev={goPrev}
          onSkip={() => goNext(cardProgress?.known ?? false)}
        />
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
