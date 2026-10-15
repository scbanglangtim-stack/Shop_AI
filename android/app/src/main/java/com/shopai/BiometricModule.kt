package com.shopai

import androidx.biometric.BiometricManager
import androidx.biometric.BiometricPrompt
import androidx.core.content.ContextCompat
import androidx.fragment.app.FragmentActivity
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.UiThreadUtil

class BiometricModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String = "BiometricModule"

  @ReactMethod
  fun hasHardware(promise: Promise) {
    val biometricManager = BiometricManager.from(reactContext)
    val authenticators = BiometricManager.Authenticators.BIOMETRIC_STRONG or BiometricManager.Authenticators.BIOMETRIC_WEAK
    val canAuth = biometricManager.canAuthenticate(authenticators)
    val hasHw = canAuth != BiometricManager.BIOMETRIC_ERROR_NO_HARDWARE && canAuth != BiometricManager.BIOMETRIC_ERROR_HW_UNAVAILABLE
    promise.resolve(hasHw)
  }

  @ReactMethod
  fun isEnrolled(promise: Promise) {
    val biometricManager = BiometricManager.from(reactContext)
    val authenticators = BiometricManager.Authenticators.BIOMETRIC_STRONG or BiometricManager.Authenticators.BIOMETRIC_WEAK
    val canAuth = biometricManager.canAuthenticate(authenticators)
    promise.resolve(canAuth == BiometricManager.BIOMETRIC_SUCCESS)
  }

  @ReactMethod
  fun supportedAuthenticationTypes(promise: Promise) {
    val list = Arguments.createArray()
    val biometricManager = BiometricManager.from(reactContext)
    val authenticators = BiometricManager.Authenticators.BIOMETRIC_STRONG or BiometricManager.Authenticators.BIOMETRIC_WEAK
    if (biometricManager.canAuthenticate(authenticators) == BiometricManager.BIOMETRIC_SUCCESS) {
      list.pushInt(1) // FINGERPRINT
    }
    promise.resolve(list)
  }

  @ReactMethod
  fun authenticate(options: ReadableMap, promise: Promise) {
    val activity = reactApplicationContext.currentActivity as? FragmentActivity
    if (activity == null) {
      promise.reject("E_ACTIVITY_NOT_FOUND", "Current Activity is not a FragmentActivity")
      return
    }

    val promptMessage = if (options.hasKey("promptMessage")) options.getString("promptMessage") ?: "Xác thực sinh trắc học" else "Xác thực sinh trắc học"
    val cancelLabel = if (options.hasKey("cancelLabel")) options.getString("cancelLabel") ?: "Huỷ" else "Huỷ"

    UiThreadUtil.runOnUiThread {
      try {
        val executor = ContextCompat.getMainExecutor(activity)
        val callback = object : BiometricPrompt.AuthenticationCallback() {
          override fun onAuthenticationSucceeded(result: BiometricPrompt.AuthenticationResult) {
            super.onAuthenticationSucceeded(result)
            val response = Arguments.createMap().apply {
              putBoolean("success", true)
            }
            promise.resolve(response)
          }

          override fun onAuthenticationError(errorCode: Int, errString: CharSequence) {
            super.onAuthenticationError(errorCode, errString)
            val response = Arguments.createMap().apply {
              putBoolean("success", false)
              putString("error", errString.toString())
            }
            promise.resolve(response)
          }

          override fun onAuthenticationFailed() {
            super.onAuthenticationFailed()
          }
        }

        val promptInfo = BiometricPrompt.PromptInfo.Builder()
          .setTitle(promptMessage)
          .setNegativeButtonText(cancelLabel)
          .setAllowedAuthenticators(BiometricManager.Authenticators.BIOMETRIC_STRONG or BiometricManager.Authenticators.BIOMETRIC_WEAK)
          .build()

        val prompt = BiometricPrompt(activity, executor, callback)
        prompt.authenticate(promptInfo)
      } catch (e: Exception) {
        val response = Arguments.createMap().apply {
          putBoolean("success", false)
          putString("error", e.message)
        }
        promise.resolve(response)
      }
    }
  }
}
