import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  ScrollView,
  Pressable,
  FlatList,
  SectionList,
  ActivityIndicator,
  Modal,
  Switch,
  Alert,
  StyleSheet,
} from 'react-native';

export default function CoreComponentsDemo() {
  // State demo
  const [text, setText] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'flat' | 'section'>('flat');

  const flatData = [
    { id: '1', title: 'Tai nghe AirPods Pro', price: '4.990.000 đ' },
    { id: '2', title: 'iPhone 15 Pro Max', price: '30.990.000 đ' },
    { id: '3', title: 'Cáp sạc nhanh 20W Type-C', price: '450.000 đ' },
  ];

  const sectionData = [
    {
      title: '📱 Điện thoại',
      data: ['iPhone 15 Pro', 'Samsung Galaxy S24', 'Xiaomi 14 Ultra'],
    },
    {
      title: '🎧 Phụ kiện âm thanh',
      data: ['AirPods Pro 2', 'Sony WH-1000XM5', 'Loa Marshall Emberton'],
    },
  ];

  const handleAlert = () => {
    Alert.alert('Thông báo', 'Bạn vừa kích hoạt Alert từ Core Component!');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>Chương 2.6: Core Components Đầy Đủ</Text>

      {/* 1 & 2: View & Text */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1 & 2. View & Text</Text>
        <Text style={styles.desc}>
          View là hộp bố cục native, Text là thẻ duy nhất hiển thị văn bản.
        </Text>
      </View>

      {/* 3: Image */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3. Image (Hình ảnh)</Text>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400' }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      {/* 4: TextInput */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>4. TextInput (Controlled Component)</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập tên sản phẩm cần tìm..."
          placeholderTextColor="#999"
          value={text}
          onChangeText={setText}
        />
        <Text style={styles.preview}>Đang nhập: {text || '(Chưa nhập gì)'}</Text>
      </View>

      {/* 5 & 6: Pressable, Switch, Alert & Modal */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>5, 6, 10, 11, 12: Tương tác & Sự kiện</Text>
        
        <View style={styles.rowBetween}>
          <Text style={styles.label}>Công tắc Switch (Đổi trạng thái):</Text>
          <Switch
            value={isEnabled}
            onValueChange={setIsEnabled}
            trackColor={{ false: '#767577', true: '#FF8A8B' }}
            thumbColor={isEnabled ? '#FF4D4F' : '#f4f3f4'}
          />
        </View>

        <View style={styles.buttonRow}>
          <Pressable style={styles.btn} onPress={handleAlert}>
            <Text style={styles.btnText}>Bật Alert</Text>
          </Pressable>

          <Pressable style={[styles.btn, styles.btnSecondary]} onPress={() => setModalVisible(true)}>
            <Text style={styles.btnText}>Mở Modal</Text>
          </Pressable>
        </View>
      </View>

      {/* 9: ActivityIndicator */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>9. ActivityIndicator (Loading Spinner)</Text>
        <ActivityIndicator size="large" color="#FF4D4F" />
      </View>

      {/* 7 & 8: FlatList vs SectionList */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>7 & 8. FlatList vs SectionList</Text>
        <View style={styles.tabRow}>
          <Pressable
            style={[styles.tabBtn, activeTab === 'flat' && styles.tabBtnActive]}
            onPress={() => setActiveTab('flat')}
          >
            <Text style={[styles.tabText, activeTab === 'flat' && styles.tabTextActive]}>
              FlatList
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tabBtn, activeTab === 'section' && styles.tabBtnActive]}
            onPress={() => setActiveTab('section')}
          >
            <Text style={[styles.tabText, activeTab === 'section' && styles.tabTextActive]}>
              SectionList
            </Text>
          </Pressable>
        </View>

        {activeTab === 'flat' ? (
          <FlatList
            data={flatData}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View style={styles.listItem}>
                <Text style={styles.listTitle}>{item.title}</Text>
                <Text style={styles.listPrice}>{item.price}</Text>
              </View>
            )}
          />
        ) : (
          <SectionList
            sections={sectionData}
            keyExtractor={(item, index) => item + index}
            scrollEnabled={false}
            renderSectionHeader={({ section: { title } }) => (
              <Text style={styles.sectionHeader}>{title}</Text>
            )}
            renderItem={({ item }) => (
              <View style={styles.listItem}>
                <Text style={styles.listTitle}>{item}</Text>
              </View>
            )}
          />
        )}
      </View>

      {/* Modal Demo */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>🎉 ShopAI Modal</Text>
            <Text style={styles.modalBody}>
              Đây là hộp thoại Modal native tùy biến của React Native!
            </Text>
            <Pressable
              style={styles.modalCloseBtn}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.btnText}>Đóng Modal</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  content: { padding: 16, paddingBottom: 40 },
  header: { fontSize: 22, fontWeight: '800', color: '#FF4D4F', textAlign: 'center', marginBottom: 16 },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    elevation: 2,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#2C3E50', marginBottom: 8 },
  desc: { fontSize: 14, color: '#7F8C8D' },
  image: { width: '100%', height: 160, borderRadius: 10, marginTop: 4 },
  input: {
    height: 46,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#FAFAFA',
    color: '#333',
  },
  preview: { marginTop: 8, fontSize: 13, color: '#7F8C8D', fontStyle: 'italic' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  label: { fontSize: 14, color: '#2C3E50' },
  buttonRow: { flexDirection: 'row', gap: 10 },
  btn: {
    flex: 1,
    backgroundColor: '#FF4D4F',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnSecondary: { backgroundColor: '#34495E' },
  btnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
  tabRow: { flexDirection: 'row', marginBottom: 12, gap: 8 },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#EAEAEA',
    alignItems: 'center',
  },
  tabBtnActive: { backgroundColor: '#FF4D4F' },
  tabText: { fontWeight: '600', color: '#666' },
  tabTextActive: { color: '#FFF' },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  listTitle: { fontSize: 14, color: '#2C3E50', fontWeight: '500' },
  listPrice: { fontSize: 14, color: '#FF4D4F', fontWeight: '700' },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FF4D4F',
    backgroundColor: '#FFF0F0',
    padding: 6,
    borderRadius: 6,
    marginTop: 8,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    elevation: 6,
  },
  modalTitle: { fontSize: 20, fontWeight: '800', color: '#2C3E50', marginBottom: 10 },
  modalBody: { fontSize: 15, color: '#7F8C8D', textAlign: 'center', marginBottom: 20 },
  modalCloseBtn: {
    backgroundColor: '#FF4D4F',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
});
