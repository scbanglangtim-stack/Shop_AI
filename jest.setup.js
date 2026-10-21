// jest.setup.js
// Giả lập (Mock) các Native Modules cho Jest (Chương 11 - Phần 11.6 & Bước 6b)

// AsyncStorage (Chương 6 & 11)
const mockAsyncStorage = {
  getItem: jest.fn((key) => Promise.resolve(null)),
  setItem: jest.fn((key, value) => Promise.resolve(null)),
  removeItem: jest.fn((key) => Promise.resolve(null)),
  mergeItem: jest.fn((key, value) => Promise.resolve(null)),
  clear: jest.fn(() => Promise.resolve(null)),
  getAllKeys: jest.fn(() => Promise.resolve([])),
  multiGet: jest.fn((keys) => Promise.resolve([])),
  multiSet: jest.fn((kvPairs) => Promise.resolve(null)),
  multiRemove: jest.fn((keys) => Promise.resolve(null)),
  multiMerge: jest.fn((kvPairs) => Promise.resolve(null)),
};
jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

// Firebase App & Crashlytics (Chương 10)
jest.mock('@react-native-firebase/app', () => ({
  initializeApp: jest.fn(),
  app: jest.fn(() => ({})),
}), { virtual: true });

jest.mock('@react-native-firebase/crashlytics', () => () => ({
  log: jest.fn(),
  recordError: jest.fn(),
  setUserId: jest.fn(),
  setAttributes: jest.fn(),
  crash: jest.fn(),
  sendUnsentReports: jest.fn(),
  setCrashlyticsCollectionEnabled: jest.fn(),
}), { virtual: true });

// expo-secure-store (Chương 8)
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(() => Promise.resolve(null)),
  setItemAsync: jest.fn(() => Promise.resolve()),
  deleteItemAsync: jest.fn(() => Promise.resolve()),
}), { virtual: true });

// expo-updates (Chương 10)
jest.mock('expo-updates', () => ({
  checkForUpdateAsync: jest.fn(() => Promise.resolve({ isAvailable: false })),
  fetchUpdateAsync: jest.fn(),
  reloadAsync: jest.fn(),
}), { virtual: true });

// Vision Camera (Chương 7)
jest.mock('react-native-vision-camera', () => ({
  Camera: 'Camera',
  useCameraDevice: jest.fn(() => ({ id: 'back' })),
  useCodeScanner: jest.fn(),
  CameraPermissionStatus: 'granted',
}), { virtual: true });

// Geolocation
jest.mock('@react-native-community/geolocation', () => ({
  getCurrentPosition: jest.fn(),
  watchPosition: jest.fn(),
  clearWatch: jest.fn(),
  stopObserving: jest.fn(),
}), { virtual: true });

// Safe Area Context
jest.mock(
  'react-native-safe-area-context',
  () => require('react-native-safe-area-context/jest/mock')
);

// React Redux
jest.mock('react-redux', () => ({
  Provider: ({ children }) => children,
  useSelector: jest.fn(),
  useDispatch: () => jest.fn(),
}));
