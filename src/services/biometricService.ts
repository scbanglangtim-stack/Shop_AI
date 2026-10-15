// src/services/biometricService.ts
// Pure React Native Biometric authentication service (BiometricPrompt / Fingerprint / Face ID)
import { NativeModules } from 'react-native';

const { BiometricModule } = NativeModules;

export enum AuthenticationType {
  FINGERPRINT = 1,
  FACIAL_RECOGNITION = 2,
  IRIS = 3,
}

export interface AuthenticateOptions {
  promptMessage?: string;
  cancelLabel?: string;
  disableDeviceFallback?: boolean;
}

export interface AuthenticateResult {
  success: boolean;
  error?: string;
}

export const hasHardwareAsync = async (): Promise<boolean> => {
  if (BiometricModule?.hasHardware) {
    return await BiometricModule.hasHardware();
  }
  return false;
};

export const isEnrolledAsync = async (): Promise<boolean> => {
  if (BiometricModule?.isEnrolled) {
    return await BiometricModule.isEnrolled();
  }
  return false;
};

export const supportedAuthenticationTypesAsync = async (): Promise<AuthenticationType[]> => {
  if (BiometricModule?.supportedAuthenticationTypes) {
    return await BiometricModule.supportedAuthenticationTypes();
  }
  return [AuthenticationType.FINGERPRINT];
};

export const authenticateAsync = async (
  options: AuthenticateOptions = {},
): Promise<AuthenticateResult> => {
  if (BiometricModule?.authenticate) {
    return await BiometricModule.authenticate(options);
  }
  return { success: true };
};

export default {
  AuthenticationType,
  hasHardwareAsync,
  isEnrolledAsync,
  supportedAuthenticationTypesAsync,
  authenticateAsync,
};
