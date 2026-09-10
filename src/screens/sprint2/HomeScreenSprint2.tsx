import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Post } from '@types';
import { fetchPostsWithFetch } from '@services/api';

/**
 * HomeScreenSprint2 — Màn hình nghiệm thu hoàn chỉnh Sprint 2 (Chương 2)
 */
const HomeScreenSprint2 = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [keyword, setKeyword] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchPostsWithFetch();
      setPosts(data);
    } catch (err: any) {
      setError(err.message || 'Không thể tải dữ liệu từ máy chủ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredPosts = posts.filter(
    p =>
      p.title.toLowerCase().includes(keyword.toLowerCase()) ||
      p.body.toLowerCase().includes(keyword.toLowerCase()),
  );

  return (
    <SafeAreaView style={styles.safe}>
      {/* 1. Header & Banner */}
      <View style={styles.header}>
        <Text style={styles.brand}>ShopAI</Text>
        <Text style={styles.caption}>Môi trường đã sẵn sàng (Sprint 2)</Text>
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800',
          }}
          style={styles.banner}
          resizeMode="cover"
        />
      </View>

      {/* 2. Ô tìm kiếm Controlled Component */}
      <TextInput
        style={styles.input}
        placeholder="🔍 Tìm kiếm bài viết/sản phẩm..."
        placeholderTextColor="#95A5A6"
        value={keyword}
        onChangeText={setKeyword}
      />

      {/* 3. Nút bấm Làm mới danh sách */}
      <Pressable
        onPress={loadData}
        style={({ pressed }) => [styles.btn, pressed && { opacity: 0.85 }]}
      >
        <Text style={styles.btnText}>🔄 Làm mới danh sách (Fetch API)</Text>
      </Pressable>

      {/* 4. Vòng xoay Loading */}
      {loading && (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#FF4D4F" />
          <Text style={styles.loadingText}>Đang tải dữ liệu Sprint 2...</Text>
        </View>
      )}

      {/* 5. Báo lỗi */}
      {!loading && error && <Text style={styles.error}>{error}</Text>}

      {/* 6. Danh sách FlatList */}
      {!loading && !error && (
        <FlatList
          data={filteredPosts}
          keyExtractor={item => String(item.id)}
          contentContainerStyle={{ paddingBottom: 24 }}
          ListEmptyComponent={
            <Text style={styles.empty}>Không có kết quả nào cho từ khóa này</Text>
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Sprint 2 #{item.id}</Text>
              </View>
              <Text style={styles.cardTitle} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={styles.cardBody} numberOfLines={2}>
                {item.body}
              </Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F5F5' },
  header: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
  },
  brand: { fontSize: 28, fontWeight: '800', color: '#FF4D4F' },
  caption: { color: '#7F8C8D', marginTop: 4, fontSize: 14 },
  banner: { width: '100%', height: 130, borderRadius: 12, marginTop: 12 },
  input: {
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 10,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    fontSize: 15,
    color: '#2C3E50',
  },
  btn: {
    marginHorizontal: 16,
    marginBottom: 10,
    backgroundColor: '#FF4D4F',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
  },
  btnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
  centerBox: { marginTop: 40, alignItems: 'center' },
  loadingText: { marginTop: 10, color: '#7F8C8D' },
  card: {
    marginHorizontal: 16,
    marginTop: 10,
    padding: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    elevation: 2,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFF0F0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 6,
  },
  badgeText: { fontSize: 11, color: '#FF4D4F', fontWeight: '700' },
  cardTitle: { fontWeight: '700', fontSize: 15, color: '#2C3E50', marginBottom: 6 },
  cardBody: { color: '#7F8C8D', fontSize: 13, lineHeight: 18 },
  error: { color: '#E74C3C', textAlign: 'center', marginTop: 24, fontSize: 16, fontWeight: '700' },
  empty: { textAlign: 'center', color: '#95A5A6', marginTop: 40, fontSize: 15 },
});

export default HomeScreenSprint2;
