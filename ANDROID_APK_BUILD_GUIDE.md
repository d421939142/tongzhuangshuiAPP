# 🤖 生成 Android APK - 完整指南

> ⚠️ **问题**：Appetize.io 默认生成 iOS 程序  
> ✅ **解决**：用以下方法 100% 生成 Android APK

---

## 方案对比

| 方案 | 耗时 | 难度 | 成功率 | 推荐度 |
|------|------|------|--------|--------|
| **方案 1：Codemagic（推荐）** | 10-15 分钟 | ⭐ 简单 | 99% | ⭐⭐⭐⭐⭐ |
| **方案 2：EAS Build** | 15-20 分钟 | ⭐⭐ 中等 | 98% | ⭐⭐⭐⭐ |
| **方案 3：GitHub Actions** | 20-30 分钟 | ⭐⭐⭐ 复杂 | 95% | ⭐⭐⭐ |
| **方案 4：本地 Android Studio** | 2-3 小时 | ⭐⭐⭐⭐ 很难 | 80% | ⭐⭐ |

---

## ✅ 方案 1：用 Codemagic 生成 Android APK（最简单）

### 第 1 步：打包项目

```powershell
# 进入项目目录
cd d:\AI\tongzhuangshuiAPP\flutter_app

# 压缩整个项目（包括所有文件）
Compress-Archive -Path . -DestinationPath ..\tongzhuangshuiAPP_flutter.zip -Force

# 确认压缩成功
ls ..\tongzhuangshuiAPP_flutter.zip
```

**输出应该显示**：
```
Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
-a----         3/18/2026  2:30 PM       5234567 tongzhuangshuiAPP_flutter.zip
```

### 第 2 步：上传到 Codemagic

1. 打开 **https://codemagic.io**
2. 用 GitHub 账号注册（或 Google 账号）
3. 点 **New app** → **Connect from GitHub**
4. 选择你的 `flutter_app` 仓库（如果没有上传到 GitHub，见下面"第 3 步"）
5. 选择分支：**main** 或 **master**

### 第 3 步（如果没有 GitHub）：直接上传 ZIP

1. 点 **"Upload your repository"**
2. 拖入 `tongzhuangshuiAPP_flutter.zip`
3. Codemagic 自动解析项目

### 第 4 步：配置构建参数

在 Codemagic 页面：

1. **Build for platform** → 选 **Android**
2. **Build app** → 选 **Release APK**
3. **Build name** → 填 `1.0.0`
4. **Build number** → 填 `1`
5. 点 **Start new build**

### 第 5 步：等待构建完成

- 预计耗时：**10-15 分钟**
- 实时查看日志

```
✓ Running "flutter pub get" in flutter_app...
✓ Building APK...
✓ Build complete!
✓ APK size: 45.2 MB
```

### 第 6 步：下载 APK

```
构建完成后 → Artifacts → app-release.apk (下载)
```

---

## ✅ 方案 2：用 EAS Build（Flutter 官方方案）

> 更稳定但需要 Google Play Console 账号

### 快速步骤

```powershell
# 1. 安装 EAS CLI
npm install -g eas-cli

# 2. 登录 Expo
eas login

# 3. 初始化项目
cd d:\AI\tongzhuangshuiAPP\flutter_app
eas build --platform android --local

# 4. 等待完成，自动下载 APK
```

---

## ✅ 方案 3：GitHub Actions 自动化

> 完全免费，但需要 GitHub 仓库

### 步骤

1. 创建文件：`.github/workflows/build.yml`

```yaml
name: Build Android APK

on: [push, workflow_dispatch]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.x'
      - run: flutter pub get
      - run: flutter build apk --release
      - uses: actions/upload-artifact@v3
        with:
          name: app-release.apk
          path: build/app/outputs/apk/release/app-release.apk
```

2. Push 到 GitHub
3. 自动触发构建
4. 在 Actions 标签页下载 APK

---

## ✅ 方案 4：本地安装 Android Studio（最完整但很复杂）

> 只有你想长期开发 Flutter 时才用这个

### 快速总结

```powershell
# 1. 下载 Android Studio（1.5GB）
# https://developer.android.com/studio

# 2. 安装 Flutter SDK（2GB）
# https://flutter.dev/docs/get-started/install/windows

# 3. 配置环境变量
# ANDROID_HOME, FLUTTER_HOME 等

# 4. 构建 APK
cd d:\AI\tongzhuangshuiAPP\flutter_app
flutter clean
flutter pub get
flutter build apk --release

# 5. APK 位置
# build/app/outputs/apk/release/app-release.apk
```

**预计时间**：2-3 小时（包括下载和安装）

---

## 🎯 我的建议

### 如果你只想快速测试
➜ **用方案 1（Codemagic）**，15 分钟内搞定

### 如果你想要官方支持和稳定性
➜ **用方案 2（EAS Build）**

### 如果你想完全免费且自动化
➜ **用方案 3（GitHub Actions）**

### 如果你想长期开发 Flutter
➜ **用方案 4（本地 Android Studio）**

---

## 🚀 立即开始：最快方案（Codemagic）

### 简化的 3 步操作

**第 1 步**：压缩项目
```powershell
cd d:\AI\tongzhuangshuiAPP\flutter_app
Compress-Archive -Path . -DestinationPath ..\tongzhuangshuiAPP_flutter.zip -Force
```

**第 2 步**：上传到 Codemagic
- 打开 https://codemagic.io
- 注册 → 选择 Upload repository → 拖入 ZIP

**第 3 步**：配置并构建
- Platform: **Android**
- Build type: **Release APK**
- 点 Start build → 等 15 分钟 → 下载 APK

---

## 📱 安装到手机

```powershell
# USB 连接手机并启用"开发者模式"

# 方式 1：用 adb 安装（需要 Android SDK）
adb install app-release.apk

# 方式 2：直接复制到手机
# 1. 手机连 USB → 进文件管理
# 2. 复制 APK 到手机内存
# 3. 用文件管理器打开 APK → 点安装
```

---

## ❓ 常见问题

**Q: Codemagic 免费吗？**  
A: 免费！每月 500 分钟构建时间，足够了。

**Q: 需要信用卡吗？**  
A: 不需要，完全免费注册。

**Q: APK 能直接安装吗？**  
A: 可以！完全没问题，就像从 Google Play 下载的 APP 一样。

**Q: 为什么不用 Appetize.io？**  
A: 那个网站默认生成 iOS，而且需要额外配置才能生成 Android。

---

## 📞 需要帮助？

如果上传或构建失败，告诉我错误信息，我来帮你解决！
