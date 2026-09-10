import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, Pressable, StyleSheet } from 'react-native';
import { Post } from '@types';
import { fetchPostsWithAxios } from '@services/api';

/** AxiosDemo — Chương 2.7.4: Gọi API bằng Axios Instance + 3 trạng thái UI */
export default function AxiosDemo() {
  const [data, setData] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const posts = await fetchPostsWithAxios();
      setData(posts);
    } catch (err: any) {
      setError(err.message || 'Không thể kết nối đến máy chủ Axios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <View style={styles.screen}>
      <Text style={styles.header}>Chương 2.7.4: Axios Instance & Interceptors</Text>

      <Pressable style={styles.reloadBtn} onPress={loadData}>
        <Text style={styles.reloadText}>⚡ Gọi API bằng Axios</Text>
      </Pressable>

      {loading && (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#3498DB" />
          <Text style={styles.statusText}>Axios đang xử lý tự động parse JSON...</Text>
        </View>
      )}

      {!loading && error && (
        <View style={styles.centerBox}>
          <Text style={styles.errorText}>❌ {error}</Text>
          <Pressable style={styles.retryBtn} onPress={loadData}>
            <Text style={styles.reloadText}>Thử lại</Text>
          </Pressable>
        </View>
      )}

      {!loading && !error && (
        <FlatList
          data={data}
          keyExtractor={item => String(item.id)}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Axios res.data #{item.id}</Text>
              </View>
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
    backgroundColor: '#3498DB',
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
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#EBF5FB',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 6,
  },
  badgeText: { fontSize: 11, color: '#2980B9', fontWeight: '700' },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#2C3E50', marginBottom: 6 },
  cardBody: { fontSize: 13, color: '#7F8C8D' },
});
