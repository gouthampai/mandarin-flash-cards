import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function ScreenHeader({ onGoToStats, onGoToCardList }) {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>Mandarin Flash Cards</Text>
      <View style={styles.headerBtns}>
        <TouchableOpacity onPress={onGoToCardList} style={styles.btn}>
          <Text style={styles.btnText}>Cards</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onGoToStats} style={styles.btn}>
          <Text style={styles.btnText}>Stats →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2C3E50',
  },
  headerBtns: {
    flexDirection: 'row',
    gap: 12,
  },
  btn: {
    padding: 6,
  },
  btnText: {
    color: '#2980B9',
    fontWeight: '600',
    fontSize: 15,
  },
});
