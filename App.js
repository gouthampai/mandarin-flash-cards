import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import FlashCardScreen from './src/screens/FlashCardScreen';
import StatsScreen from './src/screens/StatsScreen';

export default function App() {
  const [screen, setScreen] = useState('flashcard');

  return (
    <>
      <StatusBar style="dark" />
      {screen === 'flashcard' ? (
        <FlashCardScreen onGoToStats={() => setScreen('stats')} />
      ) : (
        <StatsScreen onBack={() => setScreen('flashcard')} />
      )}
    </>
  );
}
