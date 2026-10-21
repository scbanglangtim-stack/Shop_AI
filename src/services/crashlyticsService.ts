// src/services/crashlyticsService.ts
// Bọc dịch vụ Firebase Crashlytics an toàn cho môi trường Dev & Production (Chương 10)
import { getCrashlytics, Crashlytics } from '@react-native-firebase/crashlytics';
import { ENABLE_CRASHLYTICS } from '@constants/env';

let crashlyticsInstance: Crashlytics | null = null;

const getSafeCrashlytics = (): Crashlytics | null => {
  if (!crashlyticsInstance) {
    try {
      crashlyticsInstance = getCrashlytics();
    } catch (e) {
      // In dev or when Firebase native isn't initialized yet
      return null;
    }
  }
  return crashlyticsInstance;
};

export const logCrashlytics = (message: string) => {
  try {
    const inst = getSafeCrashlytics();
    if (ENABLE_CRASHLYTICS && inst) {
      inst.log(message);
    } else {
      console.log(`[Crashlytics Log]: ${message}`);
    }
  } catch (e) {
    console.warn('[Crashlytics] log failed:', e);
  }
};

export const recordCrashlyticsError = (error: Error, jsErrorName?: string) => {
  try {
    const inst = getSafeCrashlytics();
    if (ENABLE_CRASHLYTICS && inst) {
      if (jsErrorName) {
        inst.recordError(error, jsErrorName);
      } else {
        inst.recordError(error);
      }
    } else {
      console.warn(`[Crashlytics Non-Fatal Dev]: ${jsErrorName ?? 'Error'} - ${error.message}`);
    }
  } catch (e) {
    console.warn('[Crashlytics] recordError failed:', e);
  }
};

export const setCrashlyticsAttributes = (attributes: { [key: string]: string }) => {
  try {
    const inst = getSafeCrashlytics();
    if (ENABLE_CRASHLYTICS && inst) {
      inst.setAttributes(attributes);
    } else {
      console.log('[Crashlytics Attributes Dev]:', attributes);
    }
  } catch (e) {
    console.warn('[Crashlytics] setAttributes failed:', e);
  }
};

export const triggerTestCrash = () => {
  if (__DEV__) {
    try {
      const inst = getSafeCrashlytics();
      if (inst) {
        inst.log('Dev nhấn giữ vào version text để test crash...');
        inst.setUserId('dev_tester_999');
        inst.crash();
        return;
      }
    } catch (e) {
      // fallback
    }
    console.error('[Crashlytics Simulated Crash triggered by Developer in __DEV__]');
    throw new Error('Test Crashlytics Crash triggered by Developer in __DEV__');
  }
};

export default getSafeCrashlytics;
