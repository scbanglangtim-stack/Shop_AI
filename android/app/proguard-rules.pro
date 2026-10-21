# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# 1. Firebase Crashlytics & Symbolication (Chương 10)
-keepattributes SourceFile,LineNumberTable
-keep public class * extends java.lang.Exception
-keep class com.google.firebase.** { *; }

# 2. Android Keystore & Biometric Keystore (Chương 8)
-keep class androidx.biometric.** { *; }
-keep class androidx.security.crypto.** { *; }

# 3. React Native Vector Icons & Reanimated
-keep class com.swmansion.reanimated.** { *; }
