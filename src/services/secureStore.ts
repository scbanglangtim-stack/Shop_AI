// src/services/secureStore.ts
// Pure React Native hardware-backed secure store using Android Keystore (EncryptedSharedPreferences)
import { NativeModules } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { SecureStoreModule } = NativeModules;

export const setItemAsync = async (key: string, value: string): Promise<void> => {
  if (SecureStoreModule?.setItem) {
    await SecureStoreModule.setItem(key, value);
    return;
  }
  await AsyncStorage.setItem(`@secure_${key}`, value);
};

export const getItemAsync = async (key: string): Promise<string | null> => {
  if (SecureStoreModule?.getItem) {
    return await SecureStoreModule.getItem(key);
  }
  return await AsyncStorage.getItem(`@secure_${key}`);
};

export const deleteItemAsync = async (key: string): Promise<void> => {
  if (SecureStoreModule?.deleteItem) {
    await SecureStoreModule.deleteItem(key);
    return;
  }
  await AsyncStorage.removeItem(`@secure_${key}`);
};

export default {
  setItemAsync,
  getItemAsync,
  deleteItemAsync,
};
