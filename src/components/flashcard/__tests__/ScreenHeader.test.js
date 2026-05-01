import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import ScreenHeader from '../ScreenHeader';

describe('ScreenHeader', () => {
  it('renders title and nav buttons', () => {
    render(<ScreenHeader onGoToStats={jest.fn()} onGoToCardList={jest.fn()} />);
    expect(screen.getByText('Mandarin Flash Cards')).toBeTruthy();
    expect(screen.getByText('Stats →')).toBeTruthy();
    expect(screen.getByText('Cards')).toBeTruthy();
  });

  it('calls onGoToStats when Stats is pressed', () => {
    const onGoToStats = jest.fn();
    render(<ScreenHeader onGoToStats={onGoToStats} onGoToCardList={jest.fn()} />);
    fireEvent.press(screen.getByText('Stats →'));
    expect(onGoToStats).toHaveBeenCalledTimes(1);
  });

  it('calls onGoToCardList when Cards is pressed', () => {
    const onGoToCardList = jest.fn();
    render(<ScreenHeader onGoToStats={jest.fn()} onGoToCardList={onGoToCardList} />);
    fireEvent.press(screen.getByText('Cards'));
    expect(onGoToCardList).toHaveBeenCalledTimes(1);
  });
});
