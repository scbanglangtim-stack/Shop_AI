// src/screens/AIChatScreen.tsx
// Màn hình Trợ lý Mua Sắm AI & Chăm Sóc Khách Hàng ShopAI Store
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ShopButton from '@components/ShopButton';
import { COLORS, SIZES } from '@constants/theme';
import { AI_GREETING, AI_SUGGESTIONS } from '@constants/aiPrompt';
import { askShopAI, toFriendlyError, type ChatTurn } from '@services/geminiService';
import { useTheme } from '@contexts/ThemeContext';

type Message = {
  id: string;
  text: string;
  isBot: boolean;
  status?: 'sent' | 'error';
};

export default function AIChatScreen() {
  const { colors, isDark } = useTheme();
  const [messages, setMessages] = useState<Message[]>([
    { id: 'greeting', text: AI_GREETING, isBot: true, status: 'sent' },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const listRef = useRef<FlatList<Message>>(null);
  const lastQuestionRef = useRef<string>('');

  const scrollToEnd = useCallback(() => {
    setTimeout(() => {
      listRef.current?.scrollToEnd({ animated: true });
    }, 120);
  }, []);

  // Lắng nghe sự kiện bàn phím hiện để tự động cuộn FlatList lên, ô nhập luôn sát ngay trên bàn phím
  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => {
        scrollToEnd();
      }
    );
    return () => showSub.remove();
  }, [scrollToEnd]);

  /** Dựng lịch sử hội thoại */
  const buildHistory = useCallback((list: Message[]): ChatTurn[] => {
    return list
      .filter((m) => m.id !== 'greeting' && m.status !== 'error')
      .map((m) => ({
        role: m.isBot ? ('model' as const) : ('user' as const),
        parts: [{ text: m.text }],
      }));
  }, []);

  /** Lõi gửi tin */
  const send = useCallback(
    async (question: string, historySource: Message[]) => {
      lastQuestionRef.current = question;
      setIsTyping(true);
      scrollToEnd();

      try {
        const reply = await askShopAI(question, buildHistory(historySource));
        setMessages((prev) => [
          ...prev,
          { id: `bot-${Date.now()}`, text: reply, isBot: true, status: 'sent' },
        ]);
      } catch (error) {
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            text: toFriendlyError(error),
            isBot: true,
            status: 'error',
          },
        ]);
      } finally {
        setIsTyping(false);
        scrollToEnd();
      }
    },
    [buildHistory, scrollToEnd],
  );

  const handleSend = useCallback(
    (overrideText?: string) => {
      const text = (overrideText ?? inputText).trim();
      if (!text || isTyping) return;

      const userMsg: Message = {
        id: `user-${Date.now()}`,
        text,
        isBot: false,
        status: 'sent',
      };
      const next = [...messages, userMsg];

      setMessages(next);
      setInputText('');
      send(text, next);
    },
    [inputText, isTyping, messages, send],
  );

  /** Nút Thử lại khi gặp lỗi */
  const handleRetry = useCallback(() => {
    if (isTyping || !lastQuestionRef.current) return;
    const cleaned = messages.filter((m) => m.status !== 'error');
    setMessages(cleaned);
    send(lastQuestionRef.current, cleaned);
  }, [isTyping, messages, send]);

  const renderItem = ({ item }: { item: Message }) => {
    const isBot = item.isBot;
    return (
      <View>
        <View
          style={[
            styles.bubble,
            isBot
              ? [styles.botBubble, { backgroundColor: isDark ? '#2C2C2E' : '#F0F2F5' }]
              : [styles.userBubble, { backgroundColor: colors.primary }],
            item.status === 'error' && styles.errorBubble,
          ]}
        >
          <Text
            selectable
            style={{
              color: isBot ? (isDark ? '#FFFFFF' : '#1C1C1E') : '#FFFFFF',
              fontSize: 14,
              lineHeight: 20,
            }}
          >
            {item.text}
          </Text>
        </View>

        {item.status === 'error' && (
          <Pressable onPress={handleRetry} style={styles.retryBtn}>
            <Text style={[styles.retryText, { color: colors.primary }]}>🔄 Thử lại</Text>
          </Pressable>
        )}
      </View>
    );
  };

  /** Trạng thái gợi ý cho người mua sắm */
  const renderSuggestions = () => (
    <View style={styles.suggestBox}>
      <Text style={[styles.suggestTitle, { color: colors.textLight }]}>
        💡 Gợi ý câu hỏi dành cho quý khách:
      </Text>
      <View style={styles.chipRow}>
        {AI_SUGGESTIONS.map((s) => (
          <Pressable
            key={s}
            style={[
              styles.chip,
              {
                backgroundColor: isDark ? '#3A1C20' : '#FFF1F0',
                borderColor: colors.primary,
              },
            ]}
            onPress={() => handleSend(s)}
            disabled={isTyping}
          >
            <Text style={[styles.chipText, { color: colors.primary }]}>{s}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );

  const canSend = inputText.trim().length > 0 && !isTyping;

  const handleResetChat = () => {
    setMessages([{ id: 'greeting', text: AI_GREETING, isBot: true, status: 'sent' }]);
    setInputText('');
  };

  const handleVoiceInput = (sampleText: string) => {
    setInputText(sampleText);
    setTimeout(scrollToEnd, 100);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: colors.background }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: isDark ? colors.border : '#F0F0F0' }]}>
          <View style={styles.headerLeft}>
            <View style={styles.onlineDot} />
            <View>
              <Text style={[styles.headerTitle, { color: colors.text }]}>Trợ Lý Mua Sắm AI</Text>
              <Text style={[styles.headerSub, { color: colors.textLight }]}>
                {isTyping ? 'Đang soạn câu trả lời...' : 'Trực tuyến • Tư vấn sản phẩm & đặt hàng 24/7'}
              </Text>
            </View>
          </View>
          <Pressable
            onPress={handleResetChat}
            style={[styles.resetBtn, { backgroundColor: isDark ? '#333' : '#F5F5F5' }]}
          >
            <Text style={[styles.resetBtnText, { color: colors.text }]}>🔄 Làm mới</Text>
          </Pressable>
        </View>

        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: SIZES.padding, flexGrow: 1 }}
          onContentSizeChange={scrollToEnd}
          keyboardShouldPersistTaps="handled"
          ListFooterComponent={
            <>
              {messages.length <= 1 && renderSuggestions()}
              {isTyping && (
                <View
                  style={[
                    styles.bubble,
                    styles.botBubble,
                    styles.typingBubble,
                    { backgroundColor: isDark ? '#2C2C2E' : '#F0F2F5' },
                  ]}
                >
                  <ActivityIndicator size="small" color={colors.primary} />
                  <Text style={[styles.typingText, { color: colors.textLight }]}>  Trợ lý đang soạn câu trả lời...</Text>
                </View>
              )}
            </>
          }
        />

        {/* Khung nhập tin nhắn - Nhảy ngay lên trên sát bàn phím khi gõ */}
        <View style={[styles.inputArea, { backgroundColor: colors.surface, borderTopColor: isDark ? colors.border : '#F0F0F0' }]}>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: isDark ? '#2C2C2E' : '#F0F2F5',
                color: isDark ? '#FFFFFF' : '#111111',
                borderColor: isDark ? '#3A3A3C' : '#E8E8E8',
              },
            ]}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Hỏi tư vấn sản phẩm, đặt hàng, phí ship..."
            placeholderTextColor={isDark ? '#8E8E93' : '#888888'}
            selectionColor={colors.primary}
            maxLength={500}
            editable={!isTyping}
            multiline
            onFocus={() => {
              setTimeout(scrollToEnd, 150);
            }}
            onSubmitEditing={() => handleSend()}
          />

          {/* Nút gợi ý câu hỏi mua sắm */}
          <Pressable
            style={[
              styles.voiceBtn,
              {
                backgroundColor: isDark ? '#3A1C20' : '#FFF2E8',
                borderColor: isDark ? colors.primary : '#FFBB96',
              },
            ]}
            onPress={() => {
              const voiceSamples = [
                'Tư vấn điện thoại pin trâu, chụp ảnh đẹp',
                'Làm thế nào để mua hàng và thanh toán?',
                'Cách quét mã vạch sản phẩm bằng camera?',
                'Phí ship giao hàng tính theo GPS thế nào?',
                'Chính sách đổi trả & bảo hành của ShopAI?',
              ];
              const random = voiceSamples[Math.floor(Math.random() * voiceSamples.length)];
              handleVoiceInput(random);
            }}
          >
            <Text style={styles.voiceBtnText}>🎙️</Text>
          </Pressable>

          <ShopButton
            title="Gửi"
            onPress={() => handleSend()}
            isLoading={isTyping}
            disabled={!canSend}
            style={{ width: 75, height: 42, opacity: canSend ? 1 : 0.5 }}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  onlineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#52c41a',
  },
  headerTitle: { fontSize: 16, fontWeight: 'bold' },
  headerSub: { fontSize: 11, marginTop: 2 },
  resetBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  resetBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },

  bubble: { padding: 14, borderRadius: 18, marginBottom: 10, maxWidth: '85%' },
  botBubble: {
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  userBubble: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  errorBubble: {
    backgroundColor: '#FFE0E0',
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  typingBubble: { flexDirection: 'row', alignItems: 'center' },
  typingText: { fontSize: 13 },

  retryBtn: { alignSelf: 'flex-start', marginBottom: 12, paddingHorizontal: 4 },
  retryText: { fontWeight: 'bold', fontSize: 13 },

  suggestBox: { marginTop: 8, marginBottom: 16 },
  suggestTitle: { fontSize: 13, marginBottom: 8, fontWeight: '700' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipText: { fontSize: 12, fontWeight: '600' },

  inputArea: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    borderTopWidth: 1,
    gap: 8,
    paddingBottom: Platform.OS === 'android' ? 10 : 12,
  },
  input: {
    flex: 1,
    minHeight: 42,
    maxHeight: 100,
    borderRadius: 21,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 14,
    borderWidth: 1,
  },
  voiceBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  voiceBtnText: {
    fontSize: 18,
  },
});
