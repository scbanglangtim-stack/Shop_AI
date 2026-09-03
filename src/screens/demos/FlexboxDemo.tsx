import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
} from 'react-native';

type FlexDirectionType = 'column' | 'row';
type JustifyContentType = 'flex-start' | 'center' | 'space-between' | 'space-around' | 'flex-end';
type AlignItemsType = 'flex-start' | 'center' | 'stretch' | 'flex-end';

export default function FlexboxDemo() {
  const [direction, setDirection] = useState<FlexDirectionType>('row');
  const [justify, setJustify] = useState<JustifyContentType>('space-between');
  const [align, setAlign] = useState<AlignItemsType>('center');

  const directions: FlexDirectionType[] = ['row', 'column'];
  const justifies: JustifyContentType[] = [
    'flex-start',
    'center',
    'space-between',
    'space-around',
    'flex-end',
  ];
  const aligns: AlignItemsType[] = ['flex-start', 'center', 'stretch', 'flex-end'];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>Chương 4.1: Flexbox Mastery Interactive</Text>

      {/* 1. Bộ điều khiển Flex Direction */}
      <View style={styles.controlSection}>
        <Text style={styles.controlLabel}>Trục chính (flexDirection):</Text>
        <View style={styles.btnRow}>
          {directions.map(d => (
            <Pressable
              key={d}
              style={[styles.optBtn, direction === d && styles.optBtnActive]}
              onPress={() => setDirection(d)}
            >
              <Text style={[styles.optText, direction === d && styles.optTextActive]}>
                {d}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* 2. Bộ điều khiển Justify Content */}
      <View style={styles.controlSection}>
        <Text style={styles.controlLabel}>Căn trục chính (justifyContent):</Text>
        <View style={styles.btnWrap}>
          {justifies.map(j => (
            <Pressable
              key={j}
              style={[styles.optBtn, justify === j && styles.optBtnActive]}
              onPress={() => setJustify(j)}
            >
              <Text style={[styles.optText, justify === j && styles.optTextActive]}>
                {j}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* 3. Bộ điều khiển Align Items */}
      <View style={styles.controlSection}>
        <Text style={styles.controlLabel}>Căn trục phụ (alignItems):</Text>
        <View style={styles.btnWrap}>
          {aligns.map(a => (
            <Pressable
              key={a}
              style={[styles.optBtn, align === a && styles.optBtnActive]}
              onPress={() => setAlign(a)}
            >
              <Text style={[styles.optText, align === a && styles.optTextActive]}>
                {a}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Sân khấu trực quan hoá Flexbox Box */}
      <View style={styles.stageLabel}>
        <Text style={styles.stageTitle}>
          Sân khấu hiển thị layout ({direction} / {justify} / {align}):
        </Text>
      </View>

      <View
        style={[
          styles.stage,
          {
            flexDirection: direction,
            justifyContent: justify,
            alignItems: align,
          },
        ]}
      >
        <View style={[styles.box, styles.box1]}>
          <Text style={styles.boxText}>Box 1</Text>
        </View>
        <View style={[styles.box, styles.box2]}>
          <Text style={styles.boxText}>Box 2</Text>
        </View>
        <View style={[styles.box, styles.box3]}>
          <Text style={styles.boxText}>Box 3</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  content: { padding: 16, paddingBottom: 40 },
  header: { fontSize: 20, fontWeight: '800', color: '#FF4D4F', textAlign: 'center', marginBottom: 16 },
  controlSection: {
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
  },
  controlLabel: { fontSize: 14, fontWeight: '700', color: '#2C3E50', marginBottom: 8 },
  btnRow: { flexDirection: 'row', gap: 8 },
  btnWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  optBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#EAEAEA',
  },
  optBtnActive: { backgroundColor: '#FF4D4F' },
  optText: { fontSize: 12, fontWeight: '600', color: '#555' },
  optTextActive: { color: '#FFF' },
  stageLabel: { marginTop: 10, marginBottom: 8 },
  stageTitle: { fontSize: 14, fontWeight: '700', color: '#2C3E50' },
  stage: {
    height: 240,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#FF4D4F',
    borderStyle: 'dashed',
    padding: 8,
    elevation: 3,
  },
  box: {
    width: 68,
    height: 68,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  box1: { backgroundColor: '#FF6B6B' },
  box2: { backgroundColor: '#4ECDC4' },
  box3: { backgroundColor: '#45B7D1' },
  boxText: { color: '#FFF', fontWeight: '800', fontSize: 13 },
});
