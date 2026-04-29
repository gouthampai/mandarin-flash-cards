import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { characters, getToneColor } from '../data/characters';
import { useProgress } from '../hooks/useProgress';

const SORT_OPTIONS = ['Frequency', 'Most Correct', 'Least Correct', 'Not Reviewed'];

export default function CardListScreen({ onBack }) {
  const { progress } = useProgress();
  const [sort, setSort] = useState('Frequency');

  const sorted = [...characters].sort((a, b) => {
    const pa = progress[a.id];
    const pb = progress[b.id];
    if (sort === 'Most Correct') return (pb?.timesKnown || 0) - (pa?.timesKnown || 0);
    if (sort === 'Least Correct') return (pa?.timesKnown || 0) - (pb?.timesKnown || 0);
    if (sort === 'Not Reviewed') {
      const aReviewed = pa?.timesReviewed > 0 ? 1 : 0;
      const bReviewed = pb?.timesReviewed > 0 ? 1 : 0;
      return aReviewed - bReviewed;
    }
    return a.id - b.id;
  });

  const renderItem = ({ item }) => {
    const p = progress[item.id];
    const timesKnown = p?.timesKnown || 0;
    const timesReviewed = p?.timesReviewed || 0;
    const toneColor = getToneColor(item.tone);

    return (
      <View style={styles.row}>
        <View style={[styles.toneBar, { backgroundColor: toneColor }]} />
        <Text style={styles.character}>{item.character}</Text>
        <View style={styles.details}>
          <Text style={styles.pinyin}>{item.pinyin}</Text>
          <Text style={styles.meaning} numberOfLines={1}>{item.meaning}</Text>
        </View>
        <View style={styles.stats}>
          {timesReviewed === 0 ? (
            <Text style={styles.notReviewed}>Not reviewed</Text>
          ) : (
            <>
              <Text style={styles.timesKnown}>{timesKnown}✓</Text>
              <Text style={styles.timesReviewed}>of {timesReviewed}</Text>
            </>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>All Cards</Text>
        <View style={styles.backBtn} />
      </View>

      <View style={styles.sortRow}>
        {SORT_OPTIONS.map((opt) => (
          <TouchableOpacity
            key={opt}
            style={[styles.sortBtn, sort === opt && styles.sortBtnActive]}
            onPress={() => setSort(opt)}
          >
            <Text style={[styles.sortBtnText, sort === opt && styles.sortBtnTextActive]}>
              {opt}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={sorted}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  backBtn: {
    width: 70,
  },
  backBtnText: {
    color: '#2980B9',
    fontWeight: '600',
    fontSize: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2C3E50',
  },
  sortRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 8,
  },
  sortBtn: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: '#E8EAF0',
  },
  sortBtnActive: {
    backgroundColor: '#2980B9',
  },
  sortBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7F8C8D',
  },
  sortBtnTextActive: {
    color: '#fff',
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 8,
    padding: 12,
    overflow: 'hidden',
  },
  toneBar: {
    width: 4,
    height: '100%',
    borderRadius: 2,
    marginRight: 12,
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
  },
  character: {
    fontSize: 32,
    fontWeight: '300',
    color: '#2C3E50',
    marginLeft: 12,
    width: 44,
  },
  details: {
    flex: 1,
    marginLeft: 12,
  },
  pinyin: {
    fontSize: 15,
    fontWeight: '500',
    color: '#2C3E50',
    marginBottom: 2,
  },
  meaning: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  stats: {
    alignItems: 'flex-end',
    minWidth: 56,
  },
  timesKnown: {
    fontSize: 16,
    fontWeight: '700',
    color: '#27AE60',
  },
  timesReviewed: {
    fontSize: 11,
    color: '#95A5A6',
  },
  notReviewed: {
    fontSize: 11,
    color: '#BDC3C7',
    fontStyle: 'italic',
  },
});
