import React, { useRef } from 'react';
import { View, Text, Animated, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '@constants/theme';

const HEADER_MAX_HEIGHT = 140;
const HEADER_MIN_HEIGHT = 60;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

export default function CollapsingHeaderDemo() {
  const scrollY = useRef(new Animated.Value(0)).current;

  // Tính toán chiều cao co dãn mượt mà của Header
  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp',
  });

  const headerTitleOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0.5, 0.9],
    extrapolate: 'clamp',
  });

  const bannerScale = scrollY.interpolate({
    inputRange: [-100, 0],
    outputRange: [1.5, 1],
    extrapolateRight: 'clamp',
  });

  return (
    <View style={styles.container}>
      {/* Animated Collapsing Header */}
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <Animated.Text style={[styles.headerTitle, { opacity: headerTitleOpacity }]}>
          ShopAI Collapsing Header
        </Animated.Text>
        <Text style={styles.headerSubtitle}>Cuộn danh sách xuống để xem Header co lại</Text>
      </Animated.View>

      {/* Danh sách cuộn */}
      <Animated.ScrollView
        contentContainerStyle={styles.scrollContent}
        scrollEventThrottle={16}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: false,
        })}
      >
        {Array.from({ length: 20 }).map((_, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.cardTitle}>Dòng sản phẩm #{index + 1}</Text>
            <Text style={styles.cardDesc}>
              Hiệu ứng hoạt ảnh Reanimated / Animated chạy mượt mà 60FPS.
            </Text>
          </View>
        ))}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    elevation: 4,
    paddingHorizontal: 16,
  },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: '800' },
  headerSubtitle: { color: 'rgba(255,255,255,0.85)', fontSize: 12, marginTop: 4 },
  scrollContent: { paddingTop: HEADER_MAX_HEIGHT + 16, paddingHorizontal: 16, paddingBottom: 40 },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#2C3E50', marginBottom: 4 },
  cardDesc: { fontSize: 13, color: '#7F8C8D' },
});
