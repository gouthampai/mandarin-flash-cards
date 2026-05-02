import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function FilterTabs({ filterMode, stats, onSelect }) {
  const tabs = [
    { mode: 'due',      label: `Due (${stats.due})` },
    { mode: 'learning', label: `Learning (${stats.total - stats.known})` },
    { mode: 'all',      label: `All (${stats.total})` },
  ];

  return (
    <View style={styles.row}>
      {tabs.map(({ mode, label }) => (
        <TouchableOpacity
          key={mode}
          style={[styles.tab, filterMode === mode && styles.tabActive]}
          onPress={() => onSelect(mode)}
        >
          <Text style={[styles.tabText, filterMode === mode && styles.tabTextActive]}>
            {label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    backgroundColor: '#E8EAF0',
    borderRadius: 10,
    padding: 3,
    marginBottom: 10,
  },
  tab: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 13,
    color: '#7F8C8D',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#2C3E50',
    fontWeight: '600',
  },
});
