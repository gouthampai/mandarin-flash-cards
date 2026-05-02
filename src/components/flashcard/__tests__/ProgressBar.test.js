import React from 'react';
import { render, screen } from '@testing-library/react-native';
import ProgressBar from '../ProgressBar';

describe('ProgressBar', () => {
  it('renders known count and card counter', () => {
    render(<ProgressBar known={25} total={100} current={3} filteredCount={50} />);
    expect(screen.getByText('25 / 100 known')).toBeTruthy();
    expect(screen.getByText('3 / 50')).toBeTruthy();
  });

  it('renders at zero progress without error', () => {
    render(<ProgressBar known={0} total={100} current={1} filteredCount={100} />);
    expect(screen.getByText('0 / 100 known')).toBeTruthy();
  });
});
