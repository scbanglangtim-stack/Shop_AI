import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

/**
 * StyleSheetWalkthrough — Chương 2.4 & 3.2: Bản vẽ giao diện bằng StyleSheet
 */
export default function StyleSheetWalkthrough() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>ShopAI</Text>
      <Text style={styles.caption}>StyleSheet = bản vẽ giao diện bằng Object JS</Text>

      <Pressable style={styles.button}>
        <Text style={styles.buttonText}>Thêm vào giỏ</Text>
      </Pressable>

      {/* Mảng Style: Style sau ghi đè style trước */}
      <Pressable style={[styles.button, styles.buttonOutline]}>
        <Text style={[styles.buttonText, styles.buttonOutlineText]}>Xem chi tiết</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FF4D4F',
  },
  caption: {
    marginTop: 8,
    marginBottom: 24,
    fontSize: 14,
    color: '#7F8C8D',
    textAlign: 'center',
  },
  button: {
    width: 220,
    backgroundColor: '#FF4D4F',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    elevation: 3,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#FF4D4F',
    elevation: 0,
  },
  buttonOutlineText: {
    color: '#FF4D4F',
  },
});
