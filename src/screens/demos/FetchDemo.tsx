import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, Pressable, StyleSheet } from 'react-native';
import { Post } from '@types';
import { fetchPostsWithFetch } from '@services/api';

/** FetchDemo — Chương 2.7.3: Gọi API bằng Fetch + 3 trạng thái UI */
export default function FetchDemo() {
  const [data, setData] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const posts = await fetchPostsWithFetch();
      setData(posts);
    } catch (err: any) {
      setError(err.message || 'Không tải được dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let alive = true; // Tránh Memory Leak khi unmount
    loadData();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <View style={styles.screen}>
      <Text style={styles.header}>Chương 2.7.3: Fetch API (3 Trạng thái UI)</Text>

      <Pressable style={styles.reloadBtn} onPress={loadData}>
        <Text style={styles.reloadText}>🔄 Tải lại dữ liệu (Fetch)</Text>
      </Pressable>

      {/* 1. Trạng thái Đang tải */}
      {loading && (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#FF4D4F" />
          <Text style={styles.statusText}>Đang gọi API qua Fetch...</Text>
        </View>
      )}

      {/* 2. Trạng thái Báo lỗi */}
      {!loading && error && (
        <View style={styles.centerBox}>
          <Text style={styles.errorText}>❌ {error}</Text>
          <Pressable style={styles.retryBtn} onPress={loadData}>
            <Text style={styles.reloadText}>Thử lại</Text>
          </Pressable>
        </View>
      )}

      {/* 3. Trạng thái Có dữ liệu thành công */}
      {!loading && !error && (
        <FlatList
          data={data}
          keyExtractor={item => String(item.id)}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardId}>Bài viết #{item.id}</Text>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardBody} numberOfLines={2}>
                {item.body}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F5F5F5', padding: 16 },
  header: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 12,
    textAlign: 'center',
  },
  reloadBtn: {
    backgroundColor: '#FF4D4F',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 14,
    elevation: 2,
  },
  reloadText: { color: '#FFF', fontWeight: '700', fontSize: 15 },
  centerBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  statusText: { marginTop: 12, color: '#7F8C8D', fontSize: 15 },
  errorText: { color: '#E74C3C', fontSize: 16, fontWeight: '700', marginBottom: 12 },
  retryBtn: {
    backgroundColor: '#34495E',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  list: { paddingBottom: 24 },
  card: {
    backgroundColor: '#FFF',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
  },
  cardId: { fontSize: 12, color: '#FF4D4F', fontWeight: '700', marginBottom: 4 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#2C3E50', marginBottom: 6 },
  cardBody: { fontSize: 13, color: '#7F8C8D' },
});
