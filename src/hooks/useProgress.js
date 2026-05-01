import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'mandarin_progress';
const TOTAL_CARDS = 100;

const today = () => new Date().toISOString().split('T')[0]; // YYYY-MM-DD

// SM-2 algorithm. quality: 4 = correct ("Got it"), 1 = incorrect ("Still Learning").
function computeNextReview(existing, known) {
  const quality = known ? 4 : 1;
  const prev = {
    interval:    existing?.interval    ?? 0,
    easeFactor:  existing?.easeFactor  ?? 2.5,
    repetitions: existing?.repetitions ?? 0,
  };

  let interval, easeFactor, repetitions;

  if (quality >= 3) {
    if      (prev.repetitions === 0) interval = 1;
    else if (prev.repetitions === 1) interval = 6;
    else interval = Math.round(prev.interval * prev.easeFactor);

    repetitions = prev.repetitions + 1;
    // SM-2 ease factor update formula
    easeFactor = Math.max(
      1.3,
      prev.easeFactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)
    );
  } else {
    interval    = 1;
    repetitions = 0;
    easeFactor  = Math.max(1.3, prev.easeFactor - 0.2);
  }

  const due = new Date();
  due.setDate(due.getDate() + interval);

  return {
    interval,
    easeFactor,
    repetitions,
    dueDate: due.toISOString().split('T')[0],
  };
}

export const isDue = (entry) => !entry?.dueDate || entry.dueDate <= today();

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
    const srs = computeNextReview(progress[id], known);
    const updated = {
      ...progress,
      [id]: {
        ...progress[id],
        known,
        reviewedAt:    Date.now(),
        timesReviewed: ((progress[id]?.timesReviewed) || 0) + 1,
        timesKnown:    ((progress[id]?.timesKnown)    || 0) + (known ? 1 : 0),
        // SRS fields
        interval:    srs.interval,
        easeFactor:  srs.easeFactor,
        repetitions: srs.repetitions,
        dueDate:     srs.dueDate,
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

  const progressValues = Object.values(progress);
  const reviewedIds    = new Set(Object.keys(progress).map(Number));

  const stats = {
    known:    progressValues.filter(p => p.known).length,
    learning: progressValues.filter(p => !p.known).length,
    total:    TOTAL_CARDS,
    // Cards due today: anything never reviewed, or whose dueDate has arrived
    due: progressValues.filter(p => isDue(p)).length +
         (TOTAL_CARDS - reviewedIds.size),
  };

  return { progress, markCard, resetProgress, stats };
};
