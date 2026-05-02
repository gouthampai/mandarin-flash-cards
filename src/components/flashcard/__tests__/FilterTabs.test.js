import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import FilterTabs from '../FilterTabs';

const stats = { due: 5, known: 20, total: 100 };

describe('FilterTabs', () => {
  it('renders all three tabs with counts', () => {
    render(<FilterTabs filterMode="all" stats={stats} onSelect={jest.fn()} />);
    expect(screen.getByText('Due (5)')).toBeTruthy();
    expect(screen.getByText('Learning (80)')).toBeTruthy();
    expect(screen.getByText('All (100)')).toBeTruthy();
  });

  it('calls onSelect with the correct mode', () => {
    const onSelect = jest.fn();
    render(<FilterTabs filterMode="all" stats={stats} onSelect={onSelect} />);
    fireEvent.press(screen.getByText('Due (5)'));
    expect(onSelect).toHaveBeenCalledWith('due');
  });
});
