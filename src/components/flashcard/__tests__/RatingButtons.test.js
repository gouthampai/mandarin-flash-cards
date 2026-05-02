import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import RatingButtons from '../RatingButtons';

describe('RatingButtons', () => {
  it('renders Again and Got It buttons with intervals for a new card', () => {
    render(<RatingButtons cardProgress={undefined} onAgain={jest.fn()} onGotIt={jest.fn()} />);
    expect(screen.getByText('Again')).toBeTruthy();
    expect(screen.getByText('Got It!')).toBeTruthy();
    // new card: both preview as 1d
    expect(screen.getAllByText('1d')).toHaveLength(2);
  });

  it('shows 6d preview after first successful review', () => {
    const cardProgress = { repetitions: 1, interval: 1, easeFactor: 2.5, known: true };
    render(<RatingButtons cardProgress={cardProgress} onAgain={jest.fn()} onGotIt={jest.fn()} />);
    expect(screen.getByText('6d')).toBeTruthy();
  });

  it('calls onAgain when Again is pressed', () => {
    const onAgain = jest.fn();
    render(<RatingButtons cardProgress={undefined} onAgain={onAgain} onGotIt={jest.fn()} />);
    fireEvent.press(screen.getByText('Again'));
    expect(onAgain).toHaveBeenCalledTimes(1);
  });

  it('calls onGotIt when Got It is pressed', () => {
    const onGotIt = jest.fn();
    render(<RatingButtons cardProgress={undefined} onAgain={jest.fn()} onGotIt={onGotIt} />);
    fireEvent.press(screen.getByText('Got It!'));
    expect(onGotIt).toHaveBeenCalledTimes(1);
  });
});
