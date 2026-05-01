import React from 'react';
import { render, screen } from '@testing-library/react-native';
import MicControls from '../MicControls';

const base = {
  volume: -2,
  permissionGranted: true,
  contextStrings: ['你', 'nǐ'],
  onStart: jest.fn(),
  onStop: jest.fn(),
  onReset: jest.fn(),
};

describe('MicControls', () => {
  it('renders idle state', () => {
    render(<MicControls {...base} listenState="idle" />);
    expect(screen.getByText('Tap to speak')).toBeTruthy();
  });

  it('renders error state same as idle', () => {
    render(<MicControls {...base} listenState="error" />);
    expect(screen.getByText('Tap to speak')).toBeTruthy();
  });

  it('renders starting state', () => {
    render(<MicControls {...base} listenState="starting" />);
    expect(screen.getByText('Starting...')).toBeTruthy();
  });

  it('renders listening state', () => {
    render(<MicControls {...base} listenState="listening" volume={5} />);
    expect(screen.getByText('Dismiss')).toBeTruthy();
  });

  it('renders processing state', () => {
    render(<MicControls {...base} listenState="processing" />);
    expect(screen.getByText('Processing...')).toBeTruthy();
  });

  it('renders done state without crashing', () => {
    render(<MicControls {...base} listenState="done" />);
  });

  it('renders no-speech state without crashing', () => {
    render(<MicControls {...base} listenState="no-speech" />);
  });

  it('renders permission denied message', () => {
    render(<MicControls {...base} permissionGranted={false} listenState="idle" />);
    expect(screen.getByText('Microphone permission denied')).toBeTruthy();
  });
});
