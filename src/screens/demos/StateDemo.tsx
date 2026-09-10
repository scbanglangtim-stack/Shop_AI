import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

/** StateDemo — Chương 2.3: State đơn giản với useState */
export default function StateDemo() {
  const [quantity, setQuantity] = useState(1);

  return (
    <View style={styles.screen}>
      <Text style={styles.header}>Demo State: Tăng giảm số lượng</Text>
      <Text style={styles.label}>Số lượng hiện tại: {quantity}</Text>
      <View style={styles.row}>
        <Pressable style={styles.btn} onPress={() => setQuantity(prev => Math.max(1, prev - 1))}>
          <Text style={styles.btnText}>−</Text>
        </Pressable>
        <Pressable style={styles.btn} onPress={() => setQuantity(prev => prev + 1)}>
          <Text style={styles.btnText}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F5F5' },
  header: { fontSize: 20, fontWeight: '700', marginBottom: 20, color: '#2C3E50' },
  label: { fontSize: 22, marginBottom: 16, color: '#2C3E50' },
  row: { flexDirection: 'row', gap: 16 },
  btn: {
    width: 54,
    height: 54,
    borderRadius: 12,
    backgroundColor: '#FF4D4F',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  btnText: { color: '#fff', fontSize: 26, fontWeight: '700' },
});
