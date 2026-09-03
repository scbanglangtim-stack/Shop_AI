import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

type CardProps = {
  name: string;
  price: number;
  quantity: number;
  onInc: () => void;
  onDec: () => void;
};

function ProductCard({ name, price, quantity, onInc, onDec }: CardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.price}>{price.toLocaleString('vi-VN')} VNĐ</Text>
      <View style={styles.row}>
        <Pressable style={styles.btn} onPress={onDec}>
          <Text style={styles.btnText}>−</Text>
        </Pressable>
        <Text style={styles.qty}>{quantity}</Text>
        <Pressable style={styles.btn} onPress={onInc}>
          <Text style={styles.btnText}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

/** DemoPropsState — Chương 2.3: Gộp Props + State (Lifting State Up) */
export default function DemoPropsState() {
  const price = 30000000;
  const [quantity, setQuantity] = useState(1);

  return (
    <View style={styles.screen}>
      <Text style={styles.header}>Demo Props + State (Lifting State Up)</Text>
      <ProductCard
        name="iPhone 15 Pro Max"
        price={price}
        quantity={quantity}
        onInc={() => setQuantity(q => q + 1)}
        onDec={() => setQuantity(q => Math.max(1, q - 1))}
      />
      <View style={styles.totalBox}>
        <Text style={styles.totalLabel}>Tạm tính thành tiền:</Text>
        <Text style={styles.totalValue}>
          {(price * quantity).toLocaleString('vi-VN')} VNĐ
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 16, justifyContent: 'center', backgroundColor: '#F5F5F5' },
  header: { fontSize: 20, fontWeight: '700', marginBottom: 16, textAlign: 'center', color: '#2C3E50' },
  card: { backgroundColor: '#fff', borderRadius: 14, padding: 18, elevation: 4 },
  name: { fontSize: 20, fontWeight: '800', color: '#2C3E50' },
  price: { marginTop: 6, color: '#7F8C8D', fontSize: 16 },
  row: { flexDirection: 'row', alignItems: 'center', marginTop: 16, gap: 14 },
  btn: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#FF4D4F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: { color: '#fff', fontSize: 22, fontWeight: '700' },
  qty: { fontSize: 20, fontWeight: '700', minWidth: 28, textAlign: 'center', color: '#2C3E50' },
  totalBox: { marginTop: 24, padding: 16, backgroundColor: '#fff', borderRadius: 12, elevation: 2 },
  totalLabel: { fontSize: 15, color: '#7F8C8D' },
  totalValue: { marginTop: 4, fontSize: 22, fontWeight: '800', color: '#FF4D4F' },
});
