import { Dimensions } from 'react-native';
import * as Speech from 'expo-speech';

export const PRAISE = [
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

export const CARD_WIDTH = Dimensions.get('window').width * 0.92;

export const speak = (character) => {
  Speech.stop();
  Speech.speak(character, { language: 'zh-CN', rate: 1.0 });
};
