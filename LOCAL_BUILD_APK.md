# 🚀 本地编译 APK - 快速完成指南

## 📋 核心优势

相比云构建，本地编译的好处：
- ✅ 不需要登录腾讯云网页
- ✅ 完全免费，永久可用
- ✅ 一条命令快速完成
- ✅ 完整的编译日志，问题查找快

---

## 🔧 前置检查

你的电脑需要安装 Flutter SDK 和 Android SDK。

### 检查 Flutter 是否已安装

在 PowerShell 里执行：

```powershell
flutter --version
dart --version
```

如果看到版本号，说明已安装，可以直接跳到"编译 APK"部分。

如果显示"找不到命令"，需要先安装 Flutter。

---

## 📦 安装 Flutter（如果还没装）

### ① 下载 Flutter SDK（国内镜像）

国内镜像下载地址：https://flutter.cn/docs/development/tools/sdk/releases

选择 **Windows** 版本，下载最新的稳定版（Stable Channel）

### ② 解压到本地

例如解压到：`C:\flutter`

### ③ 添加到环境变量

1. 按 **Win + X**，选择 **"系统"**
2. 点击 **"关于"** → **"高级系统设置"**
3. 点击 **"环境变量"**
4. 在 **"系统变量"** 下，找到 **Path**，点击 **"编辑"**
5. 点击 **"新建"**，添加：`C:\flutter\bin`
6. 点击 **"确定"** 保存

### ④ 重启 PowerShell

关闭 PowerShell，重新打开一个新的

### ⑤ 验证安装

```powershell
flutter --version
```

看到版本号就说明安装成功了！

---

## 📝 配置国内镜像（加快下载）

在 PowerShell 里设置环境变量：

```powershell
# 设置国内镜像
$env:PUB_HOSTED_URL = "https://pub.flutter-io.cn"
$env:FLUTTER_STORAGE_BASE_URL = "https://storage.flutter-io.cn"

# 验证
echo $env:PUB_HOSTED_URL
echo $env:FLUTTER_STORAGE_BASE_URL
```

---

## 🔨 开始编译 APK

### ① 进入 Flutter 项目目录

```powershell
cd d:\AI\tongzhuangshuiAPP\flutter_app
pwd  # 确认目录
```

### ② 获取依赖

```powershell
flutter pub get
```

⏳ 这会花 2-3 分钟，耐心等待。看到 `packages got!` 就完成了。

### ③ 编译 APK（最重要的一步）

```powershell
flutter build apk --release
```

**这是核心命令！** 会花 15-25 分钟，请耐心等待。

编译过程会显示：
```
Building APK...
Running Gradle build...
✓ Built build\app\outputs\flutter-apk\app-release.apk (45.2 MB)
```

---

## ✅ 验证 APK 生成

### ① 检查文件是否存在

```powershell
ls .\build\app\outputs\flutter-apk\app-release.apk
```

应该看到类似输出：
```
Directory: D:\AI\tongzhuangshuiAPP\flutter_app\build\app\outputs\flutter-apk

Mode                 LastWriteTime         Length Name
----                 ---------------         ------ ----
-a---           3/18/2026  5:45 PM       47185923 app-release.apk
```

### ② 查看文件大小

```powershell
(Get-Item .\build\app\outputs\flutter-apk\app-release.apk).Length / 1MB
# 应该输出大约 40-50 MB
```

---

## 📱 安装到手机

### 方式一：USB 直连（最稳定）

#### 第一步：开启手机 USB 调试

1. 打开手机 **"设置"**
2. 找到 **"关于手机"**
3. 连续点击 **"版本号"** 7 次，直到提示"已开启开发者选项"
4. 返回设置，进入 **"开发者选项"**
5. 找到 **"USB 调试"**，开启

#### 第二步：用 USB 连接手机到电脑

#### 第三步：在 PowerShell 里安装

```powershell
# 进入 APK 所在目录
cd d:\AI\tongzhuangshuiAPP\flutter_app\build\app\outputs\flutter-apk

# 列出连接的设备
adb devices

# 应该看到你的手机设备编号
# 如果显示 "unauthorized"，在手机上点击"允许"

# 安装 APK
adb install app-release.apk

# 看到 "Success" 就说明安装完了！
```

### 方式二：微信传输（最简单）

1. 把 `app-release.apk` 拖到微信里
2. 发给你的手机或某个群聊
3. 在手机上点击打开，选择安装

---

## 🧪 测试应用

### ① 打开应用

在手机上找到 **"桶装水配送"** 应用，点击打开

### ② 使用测试账号登录

| 账号 | 密码 |
|------|------|
| `13800000000` | `123456` |
| `admin` | `admin123` |

### ③ 检查功能

- ✅ 能否成功登录
- ✅ 能否看到任务列表
- ✅ 能否修改任务状态
- ✅ 网络连接是否正常（应该连接到 43.138.207.105）

如果一切正常，🎉 **恭喜！你的 APP 已经完全部署成功了！**

---

## ⚠️ 常见错误及解决方案

### 错误 1: "找不到 flutter 命令"

**原因**：环境变量没有设置正确

**解决**：
1. 确认 Flutter 安装路径（例如 `C:\flutter`）
2. 重新添加到 PATH 环境变量
3. **关闭 PowerShell 重新打开**（环境变量需要重新加载）

### 错误 2: "Gradle build failed"

**原因**：通常是依赖下载失败或 Android SDK 问题

**解决**：
```powershell
# 清除构建缓存
flutter clean

# 重新获取依赖
flutter pub get

# 重新编译
flutter build apk --release
```

### 错误 3: "gradle-wrapper.jar not found"

**原因**：Gradle 文件下载不完整

**解决**：
```powershell
cd d:\AI\tongzhuangshuiAPP\flutter_app
flutter clean
flutter pub get
flutter build apk --release --verbose
```

加 `-v` 参数可以看到更详细的日志，帮助诊断问题。

### 错误 4: "adb: command not found"

**原因**：adb 工具没有在 PATH 里

**解决**：
```powershell
# 使用完整路径
& "C:\Program Files\Android\platform-tools\adb.exe" devices

# 或添加到 PATH
$env:Path += ";C:\Program Files\Android\platform-tools"
adb devices
```

---

## 📊 编译时间参考

| 阶段 | 时间 |
|------|------|
| `flutter pub get` | 2-3 分钟 |
| `flutter build apk` | 15-20 分钟 |
| **总计** | **17-23 分钟** |

> 💡 **第一次编译会比较长**，因为要下载 Android SDK 和构建工具。后续编译会快一些。

---

## ✨ 编译成功的标志

```
✓ Built build\app\outputs\flutter-apk\app-release.apk (45.2 MB)
```

看到这个就说明成功了！🎉

---

## 🔗 有用的链接

- **Flutter 官方文档**：https://flutter.dev/docs
- **Flutter 中文官网**：https://flutter.cn
- **Android Studio 下载**：https://developer.android.com/studio
- **ADB 文档**：https://developer.android.com/studio/command-line/adb

---

## 💡 下一步

APK 安装成功后：

1. **邀请朋友测试** - 看看 APP 是否好用
2. **收集反馈** - 记录问题并改进
3. **发布到应用商店** - Google Play Store（需要开发者账号 $25）
4. **继续迭代** - 更新功能和修复 bug

---

**祝你编译顺利！有任何问题随时告诉我！** 🚀
