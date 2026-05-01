import React from 'react';
import { Animated } from 'react-native';
import { render, screen } from '@testing-library/react-native';
import FlashCard from '../FlashCard';

const makeAnim = () => {
  const v = new Animated.Value(0);
  return v.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });
};
const makeOpacity = () => {
  const v = new Animated.Value(0);
  return v.interpolate({ inputRange: [0, 0.5, 0.5, 1], outputRange: [1, 1, 0, 0] });
};

const card = {
  id: 1,
  character: '你',
  pinyin: 'nǐ',
  tone: '3',
  meaning: 'you',
};

const base = {
  card,
  toneColor: '#27AE60',
  cardProgress: undefined,
  onFlip: jest.fn(),
  frontInterpolate: makeAnim(),
  backInterpolate: makeAnim(),
  frontOpacity: makeOpacity(),
  backOpacity: makeOpacity(),
};

describe('FlashCard', () => {
  it('renders the character on the front face', () => {
    render(<FlashCard {...base} />);
    expect(screen.getByText('你')).toBeTruthy();
  });

  it('renders pinyin and meaning on the back face', () => {
    render(<FlashCard {...base} />);
    expect(screen.getByText('nǐ')).toBeTruthy();
    expect(screen.getByText('you')).toBeTruthy();
  });

  it('renders Known badge when card is marked known', () => {
    const progress = { known: true, repetitions: 2, interval: 6, easeFactor: 2.5 };
    render(<FlashCard {...base} cardProgress={progress} />);
    expect(screen.getByText('✓ Known')).toBeTruthy();
  });

  it('renders Learning badge when card is not yet known', () => {
    const progress = { known: false, repetitions: 0, interval: 1, easeFactor: 2.5 };
    render(<FlashCard {...base} cardProgress={progress} />);
    expect(screen.getByText('~ Learning')).toBeTruthy();
  });
});
