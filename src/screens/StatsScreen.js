import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { characters, getToneColor } from '../data/characters';
import { useProgress } from '../hooks/useProgress';

export default function StatsScreen({ onBack }) {
  const { progress, stats, resetProgress } = useProgress();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'known' | 'learning'

  const knownCards = characters.filter(c => progress[c.id]?.known);
  const learningCards = characters.filter(c => progress[c.id] && !progress[c.id].known);
  const unseenCards = characters.filter(c => !progress[c.id]);

  const handleReset = () => {
    Alert.alert(
      'Reset Progress',
      'This will clear all your progress. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: resetProgress },
      ]
    );
  };

  const pct = stats.total > 0 ? Math.round((stats.known / stats.total) * 100) : 0;

  const renderCharacterList = (list, emptyMsg) => {
    if (list.length === 0) {
      return <Text style={styles.emptyMsg}>{emptyMsg}</Text>;
    }
    return (
      <View style={styles.characterGrid}>
        {list.map(card => (
          <View key={card.id} style={[styles.charChip, { borderColor: getToneColor(card.tone) }]}>
            <Text style={[styles.charChipCharacter, { color: getToneColor(card.tone) }]}>{card.character}</Text>
            <Text style={styles.charChipPinyin}>{card.pinyin}</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Your Progress</Text>
        <TouchableOpacity onPress={handleReset} style={styles.resetBtn}>
          <Text style={styles.resetBtnText}>Reset</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Overview cards */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { borderTopColor: '#27AE60' }]}>
            <Text style={styles.statValue}>{stats.known}</Text>
            <Text style={styles.statLabel}>Known</Text>
          </View>
          <View style={[styles.statCard, { borderTopColor: '#E67E22' }]}>
            <Text style={styles.statValue}>{stats.learning}</Text>
            <Text style={styles.statLabel}>Learning</Text>
          </View>
          <View style={[styles.statCard, { borderTopColor: '#95A5A6' }]}>
            <Text style={styles.statValue}>{unseenCards.length}</Text>
            <Text style={styles.statLabel}>Unseen</Text>
          </View>
        </View>

        {/* Ring / percentage */}
        <View style={styles.progressCircleContainer}>
          <View style={styles.progressCircleOuter}>
            <View style={styles.progressCircleInner}>
              <Text style={styles.progressPct}>{pct}%</Text>
              <Text style={styles.progressPctLabel}>mastered</Text>
            </View>
          </View>
          <Text style={styles.progressDesc}>
            {stats.known} of {stats.total} most common characters
          </Text>
        </View>

        {/* Tone legend */}
        <View style={styles.legendContainer}>
          <Text style={styles.legendTitle}>Tone Color Guide</Text>
          <View style={styles.legendRow}>
            {[
              { tone: '1', label: '1st – flat' },
              { tone: '2', label: '2nd – rising' },
              { tone: '3', label: '3rd – dip' },
              { tone: '4', label: '4th – falling' },
              { tone: 'neutral', label: 'Neutral' },
            ].map(({ tone, label }) => (
              <View key={tone} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: getToneColor(tone) }]} />
                <Text style={styles.legendLabel}>{label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Character list tabs */}
        <View style={styles.tabsRow}>
          {[
            { key: 'known', label: `Known (${knownCards.length})` },
            { key: 'learning', label: `Learning (${learningCards.length})` },
            { key: 'unseen', label: `Unseen (${unseenCards.length})` },
          ].map(tab => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, activeTab === tab.key && styles.tabActive]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {activeTab === 'known' && renderCharacterList(knownCards, 'No known characters yet. Keep studying!')}
        {activeTab === 'learning' && renderCharacterList(learningCards, 'No characters marked as still learning.')}
        {activeTab === 'unseen' && renderCharacterList(unseenCards, 'You\'ve reviewed all characters!')}
      </ScrollView>
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
  backBtn: { padding: 6 },
  backBtnText: { color: '#2980B9', fontWeight: '600', fontSize: 15 },
  title: { fontSize: 18, fontWeight: '700', color: '#2C3E50' },
  resetBtn: { padding: 6 },
  resetBtnText: { color: '#E74C3C', fontWeight: '600', fontSize: 15 },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
    width: '100%',
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 14,
    borderTopWidth: 4,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2C3E50',
  },
  statLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    fontWeight: '500',
    marginTop: 2,
  },
  progressCircleContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  progressCircleOuter: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#27AE60',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#27AE60',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  progressCircleInner: {
    width: 108,
    height: 108,
    borderRadius: 54,
    backgroundColor: '#F5F6FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressPct: {
    fontSize: 34,
    fontWeight: '700',
    color: '#2C3E50',
  },
  progressPctLabel: {
    fontSize: 11,
    color: '#7F8C8D',
    fontWeight: '500',
  },
  progressDesc: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  legendContainer: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    width: '100%',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  legendTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  legendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendLabel: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: '#E8EAF0',
    borderRadius: 10,
    padding: 3,
    marginBottom: 16,
    width: '100%',
  },
  tab: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 8,
    alignItems: 'center',
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
    fontSize: 12,
    color: '#7F8C8D',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#2C3E50',
    fontWeight: '700',
  },
  characterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'flex-start',
    width: '100%',
    paddingBottom: 10,
  },
  charChip: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 2,
    padding: 8,
    alignItems: 'center',
    minWidth: 60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 3,
    elevation: 1,
  },
  charChipCharacter: {
    fontSize: 28,
    fontWeight: '300',
  },
  charChipPinyin: {
    fontSize: 10,
    color: '#7F8C8D',
    fontWeight: '500',
  },
  emptyMsg: {
    color: '#95A5A6',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
  },
});
