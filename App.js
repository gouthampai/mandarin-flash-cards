import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import FlashCardScreen from './src/screens/FlashCardScreen';
import StatsScreen from './src/screens/StatsScreen';
import CardListScreen from './src/screens/CardListScreen';

export default function App() {
  const [screen, setScreen] = useState('flashcard');

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      {screen === 'flashcard' ? (
        <FlashCardScreen
          onGoToStats={() => setScreen('stats')}
          onGoToCardList={() => setScreen('cardlist')}
        />
      ) : screen === 'stats' ? (
        <StatsScreen onBack={() => setScreen('flashcard')} />
      ) : (
        <CardListScreen onBack={() => setScreen('flashcard')} />
      )}
    </SafeAreaProvider>
  );
}
