# 📱 Flutter Android APP 发布指南

## 🎯 目标：生成 APK 文件，直接安装到手机

---

## 📋 前置准备

### 1️⃣ 确保 Flutter 已正确安装

```bash
# 检查 Flutter 版本
flutter --version

# 检查环境
flutter doctor
```

如果显示 ❌ 错误，需要先装 Flutter SDK 和 Android SDK：
- 🔗 Flutter 官网：https://flutter.dev/docs/get-started/install/windows
- 🔗 Android Studio：https://developer.android.com/studio

### 2️⃣ 检查 Android 环境

```bash
# 查看连接的设备
flutter devices

# 如果有设备列表说明环境 OK
```

---

## 🚀 方法一：直接构建 APK（推荐 - 个人使用）

### 第一步：构建 APK

```bash
cd d:\AI\tongzhuangshuiAPP\flutter_app

# 构建发布版 APK（推荐）
flutter build apk --release

# 或者构建调试版 APK（快速，但不能上线）
flutter build apk
```

✅ 成功后会输出：
```
✓ Built build/app/outputs/apk/release/app-release.apk (XX MB)
```

### 第二步：找到 APK 文件

APK 文件位置：
```
d:\AI\tongzhuangshuiAPP\flutter_app\build\app\outputs\apk\release\app-release.apk
```

### 第三步：安装到手机

#### 📱 方法 1：通过 USB 连接（最简单）

1. 用 USB 线连接手机到电脑
2. 在手机上启用 **USB 调试**（设置 → 开发者选项 → USB 调试）
3. 运行命令：
   ```bash
   flutter install build/app/outputs/apk/release/app-release.apk
   ```

#### 📱 方法 2：通过文件传输

1. 将 APK 文件复制到手机（QQ、微信、邮件等）
2. 在手机上打开文件管理器，找到 APK 文件
3. 点击安装（手机会提示安装来源权限，选择允许）

#### 📱 方法 3：通过电子邮件

1. 将 APK 文件发送到自己的邮箱
2. 在手机上下载并安装

---

## 🚀 方法二：生成 AAB（app bundle）+ 分割 APK

如果想要更小的 APK 文件，可以生成 AAB：

```bash
flutter build appbundle --release
```

生成的文件在：
```
build/app/outputs/bundle/release/app-release.aab
```

（但 AAB 主要用于上传到 Google Play Store，个人使用推荐用 APK）

---

## 🎨 在发布前，你可能需要调整

### 1️⃣ 修改应用名称

编辑 `android/app/build.gradle`：
```gradle
android {
    ...
    defaultConfig {
        applicationId "com.example.water_delivery"  // 改成你的包名
        minSdkVersion 21
        targetSdkVersion 33
        versionCode 1
        versionName "1.0.0"
    }
}
```

编辑 `android/app/src/main/AndroidManifest.xml`：
```xml
<application
    android:label="桶装水配送"  <!-- 改成你的应用名称 -->
    ...
>
```

### 2️⃣ 修改应用图标（可选）

替换这些文件夹中的图标：
```
android/app/src/main/res/mipmap-*/
```

### 3️⃣ 修改包名（可选，高级）

```bash
flutter pub run change_app_package_name:main com.yourcompany.water_delivery
```

---

## 📊 APK 文件大小

| 版本 | 大小 | 适合场景 |
|------|------|---------|
| 调试版 (debug) | ~50-100 MB | 开发测试 |
| 发布版 (release) | ~15-30 MB | 正式使用 ✅ |

---

## ⚠️ 常见问题

### ❌ 问题 1：构建失败 - `ANDROID_SDK_ROOT is not defined`

**解决**：
```bash
# 设置 Android SDK 路径
flutter config --android-sdk "C:\Android\Sdk"

# 或手动设置环境变量
setx ANDROID_SDK_ROOT "C:\Android\Sdk"
```

### ❌ 问题 2：`flutter doctor` 显示缺少 Android SDK

**解决**：用 Android Studio 下载 SDK：
1. 打开 Android Studio
2. Tools → SDK Manager
3. 下载 SDK Platform 和 Build Tools

### ❌ 问题 3：安装失败 - `Installation failed`

**解决**：
```bash
# 卸载旧版本
adb uninstall com.example.water_delivery

# 重新安装
flutter install
```

### ❌ 问题 4：APK 无法在手机上打开

**原因**：可能是手机系统版本过低  
**解决**：
1. 检查手机系统版本（需要 Android 5.1+）
2. 修改 `android/app/build.gradle` 中的 `minSdkVersion` 为更低版本
3. 重新构建 APK

---

## 🎯 快速命令速记

```bash
# 进入项目目录
cd d:\AI\tongzhuangshuiAPP\flutter_app

# 获取依赖
flutter pub get

# 运行测试（连接设备）
flutter run

# 构建发布版 APK
flutter build apk --release

# 安装到设备
flutter install

# 清理构建
flutter clean
```

---

## 📱 安装后如何使用

1. 在手机上打开应用
2. 使用账号登录：
   - 账号：13800000000
   - 密码：123456
3. 选择身份（送水工 / 管理员）
4. 开始使用

---

## 🔄 更新应用

如果要更新应用到新版本：

1. 修改 `pubspec.yaml` 中的版本号：
   ```yaml
   version: 1.0.1+2
   ```

2. 重新构建：
   ```bash
   flutter build apk --release
   ```

3. 新 APK 会覆盖旧版本，直接安装即可

---

## 💡 签名和发布密钥（高级）

个人使用不需要配置，系统会自动使用默认密钥。

如果要自定义签名密钥：
```bash
# 生成密钥
keytool -genkey -v -keystore ~/.android/key.jks -keyalg RSA -keysize 2048 -validity 10000

# 配置 gradle.properties
```

详见：https://flutter.dev/docs/deployment/android#signing-the-app

---

## 📚 完整的 Flutter 官方文档

- 🔗 Android 部署：https://flutter.dev/docs/deployment/android
- 🔗 发布检查清单：https://flutter.dev/docs/deployment/checklist

---

最后更新：2026-03-18
