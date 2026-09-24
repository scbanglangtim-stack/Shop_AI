import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Linking, PermissionsAndroid, Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

export type Coords = { latitude: number; longitude: number };

type LocationState = {
  coords: Coords | null;
  loading: boolean;
  error: string | null;
};

/**
 * Xin quyền vị trí.
 * - Android: phải tự gọi PermissionsAndroid (thư viện này không tự xin).
 * - iOS: thư viện tự bung Pop-up dựa trên Info.plist, nên ta chỉ cần trả về true.
 */
const requestLocationPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'ios') {
    Geolocation.requestAuthorization();
    return true;
  }

  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'ShopAI cần quyền vị trí',
        message: 'Cho phép ShopAI biết vị trí để tính chính xác phí giao hàng tới nhà bạn.',
        buttonPositive: 'Cho phép',
        buttonNegative: 'Để sau',
      },
    );

    if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      Alert.alert(
        'Quyền vị trí đã bị chặn',
        'Bạn đã chọn "Không hỏi lại". Hãy vào Cài đặt > ShopAI > Quyền > Vị trí để bật lại.',
        [
          { text: 'Để sau', style: 'cancel' },
          { text: 'Mở Cài đặt', onPress: () => Linking.openSettings() },
        ],
      );
      return false;
    }

    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (e) {
    console.log('[Location] Lỗi xin quyền:', e);
    return false;
  }
};

export const useCurrentLocation = () => {
  const [state, setState] = useState<LocationState>({
    coords: null,
    loading: true,
    error: null,
  });

  const isFetchingRef = useRef(false);

  const fetchLocation = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    setState((s) => ({ ...s, loading: true, error: null }));

    const ok = await requestLocationPermission();
    if (!ok) {
      isFetchingRef.current = false;
      setState({ coords: null, loading: false, error: 'Chưa được cấp quyền vị trí' });
      return;
    }

    Geolocation.getCurrentPosition(
      (position) => {
        isFetchingRef.current = false;
        setState({
          coords: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
          loading: false,
          error: null,
        });
      },
      (err) => {
        isFetchingRef.current = false;
        const messages: Record<number, string> = {
          1: 'Bạn đã từ chối quyền vị trí',
          2: 'Không bắt được tín hiệu GPS',
          3: 'Quá thời gian chờ GPS (thử ra ngoài trời)',
        };
        setState({
          coords: null,
          loading: false,
          error: messages[err.code] ?? 'Không lấy được vị trí',
        });
      },
      {
        enableHighAccuracy: false, // false = nhanh & tiết kiệm pin
        timeout: 15000,            // Timeout 15s
        maximumAge: 60000,         // Cache 60s
      },
    );
  }, []);

  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);

  return { ...state, refresh: fetchLocation };
};
