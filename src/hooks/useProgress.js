import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'mandarin_progress';

export const useProgress = () => {
  const [progress, setProgress] = useState({});

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) setProgress(JSON.parse(stored));
    } catch (e) {
      console.error('Failed to load progress', e);
    }
  };

  const markCard = async (id, known) => {
    const updated = {
      ...progress,
      [id]: {
        known,
        reviewedAt: Date.now(),
        timesReviewed: ((progress[id]?.timesReviewed) || 0) + 1,
      },
    };
    setProgress(updated);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save progress', e);
    }
  };

  const resetProgress = async () => {
    setProgress({});
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error('Failed to reset progress', e);
    }
  };

  const stats = {
    known: Object.values(progress).filter(p => p.known).length,
    learning: Object.values(progress).filter(p => !p.known).length,
    total: 100,
  };

  return { progress, markCard, resetProgress, stats };
};
