import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import NavButtons from '../NavButtons';

describe('NavButtons', () => {
  it('renders Prev and Skip buttons', () => {
    render(<NavButtons onPrev={jest.fn()} onSkip={jest.fn()} />);
    expect(screen.getByText('← Prev')).toBeTruthy();
    expect(screen.getByText('Skip →')).toBeTruthy();
  });

  it('calls onPrev when Prev is pressed', () => {
    const onPrev = jest.fn();
    render(<NavButtons onPrev={onPrev} onSkip={jest.fn()} />);
    fireEvent.press(screen.getByText('← Prev'));
    expect(onPrev).toHaveBeenCalledTimes(1);
  });

  it('calls onSkip when Skip is pressed', () => {
    const onSkip = jest.fn();
    render(<NavButtons onPrev={jest.fn()} onSkip={onSkip} />);
    fireEvent.press(screen.getByText('Skip →'));
    expect(onSkip).toHaveBeenCalledTimes(1);
  });
});
