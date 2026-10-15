package com.shopai

import android.content.SharedPreferences
import androidx.security.crypto.EncryptedSharedPreferences
import androidx.security.crypto.MasterKey
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class SecureStoreModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String = "SecureStoreModule"

  private val sharedPreferences: SharedPreferences by lazy {
    val masterKey = MasterKey.Builder(reactApplicationContext)
      .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
      .build()

    EncryptedSharedPreferences.create(
      reactApplicationContext,
      "ShopAISecureStore",
      masterKey,
      EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
      EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
    )
  }

  @ReactMethod
  fun setItem(key: String, value: String, promise: Promise) {
    try {
      sharedPreferences.edit().putString(key, value).apply()
      promise.resolve(true)
    } catch (e: Exception) {
      promise.reject("E_SECURE_STORE_SET", e.message, e)
    }
  }

  @ReactMethod
  fun getItem(key: String, promise: Promise) {
    try {
      val value = sharedPreferences.getString(key, null)
      promise.resolve(value)
    } catch (e: Exception) {
      promise.reject("E_SECURE_STORE_GET", e.message, e)
    }
  }

  @ReactMethod
  fun deleteItem(key: String, promise: Promise) {
    try {
      sharedPreferences.edit().remove(key).apply()
      promise.resolve(true)
    } catch (e: Exception) {
      promise.reject("E_SECURE_STORE_DELETE", e.message, e)
    }
  }
}
