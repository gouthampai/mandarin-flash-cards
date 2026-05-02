import React from 'react';
import { render, screen } from '@testing-library/react-native';
import RecognitionModal from '../RecognitionModal';

const base = {
  visible: true,
  praiseWord: 'Amazing!',
  displayHeard: null,
  onDismiss: jest.fn(),
  onTryAgain: jest.fn(),
  onNextCard: jest.fn(),
};

describe('RecognitionModal', () => {
  it('renders nothing when not visible', () => {
    render(<RecognitionModal {...base} visible={false} listenState="done" isCorrect={false} wasUnflipped={false} />);
    expect(screen.queryByText('Not quite')).toBeNull();
  });

  it('renders no-speech state', () => {
    render(<RecognitionModal {...base} listenState="no-speech" isCorrect={false} wasUnflipped={false} />);
    expect(screen.getByText('Nothing heard')).toBeTruthy();
    expect(screen.getByText('Try again')).toBeTruthy();
  });

  it('renders incorrect result', () => {
    render(<RecognitionModal {...base} listenState="done" isCorrect={false} wasUnflipped={false} />);
    expect(screen.getByText('Not quite')).toBeTruthy();
    expect(screen.getByText('Try again')).toBeTruthy();
  });

  it('renders incorrect result with heard text', () => {
    render(
      <RecognitionModal
        {...base}
        listenState="done"
        isCorrect={false}
        wasUnflipped={false}
        displayHeard="māo"
      />
    );
    expect(screen.getByText('We heard')).toBeTruthy();
    expect(screen.getAllByText('māo').length).toBeGreaterThan(0);
  });

  it('renders correct result with Next Card button', () => {
    render(<RecognitionModal {...base} listenState="done" isCorrect={true} wasUnflipped={false} />);
    expect(screen.getByText('Correct!')).toBeTruthy();
    expect(screen.getByText('Next Card')).toBeTruthy();
  });

  it('renders praise word when correct without peeking', () => {
    render(<RecognitionModal {...base} listenState="done" isCorrect={true} wasUnflipped={true} />);
    expect(screen.getByText('Amazing!')).toBeTruthy();
    expect(screen.getByText('Next Card')).toBeTruthy();
  });
});
