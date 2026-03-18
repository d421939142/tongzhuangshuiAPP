# 🚀 腾讯云 CloudBase 云构建 APK 完整指南

## 📋 前置信息

| 项目 | 详情 |
|------|------|
| **项目文件** | `flutter_app_final.zip` |
| **位置** | `d:\AI\tongzhuangshuiAPP\flutter_app_final.zip` |
| **服务器 IP** | 43.138.207.105 |
| **服务器端口** | 3000 |

---

## 第一步：登录腾讯云 CloudBase

### ① 打开腾讯云控制台

在浏览器里访问：
```
https://console.cloud.tencent.com/tcb
```

用你的腾讯云账号登录（购买服务器的账号）

### ② 查看现有环境

登录后应该能看到你的云开发环境。如果还没创建过，点击 **"新建环境"** 创建一个

**环境名称示例**：`water-delivery-build`

---

## 第二步：进入云构建

### ① 点击左侧菜单

在 CloudBase 控制台，找左侧菜单：

```
构建与部署
  └─ 云构建 ← 点击这个
```

### ② 查看云构建页面

你应该看到：
- 📊 构建次数
- 🔨 新建构建按钮
- 📋 已有构建列表

---

## 第三步：创建构建配置

### ① 点击"新建构建"

### ② 选择代码来源

**选择"上传代码"或"Git 仓库"**

推荐选择 **"上传代码"**（快速）：
- 点击 **"选择文件"**
- 选择 `d:\AI\tongzhuangshuiAPP\flutter_app_final.zip`
- 上传

### ③ 选择构建环境

在"构建环境"选择：
- **系统**：Linux
- **运行时**：Node.js 16
- **内存**：2GB 或以上

### ④ 配置构建脚本

在"构建脚本"部分，粘贴以下内容（替换掉默认内容）：

```bash
#!/bin/bash

echo "========== Flutter APK 构建开始 =========="
echo "当前目录: $(pwd)"
echo "文件列表:"
ls -la

echo ""
echo "========== 1. 安装 Flutter SDK =========="
# 国内镜像
export PUB_HOSTED_URL=https://pub.flutter-io.cn
export FLUTTER_STORAGE_BASE_URL=https://storage.flutter-io.cn

# 下载 Flutter
curl -fsSL https://storage.flutter-io.cn/flutter_infra_release/releases/stable/linux/flutter_linux_3.19.0-stable.tar.xz -o flutter.tar.xz
tar -xf flutter.tar.xz
export PATH=$PATH:$(pwd)/flutter/bin

echo "Flutter 版本:"
flutter --version

echo ""
echo "========== 2. 安装 Android SDK =========="
# CloudBase 已预装 Android SDK，检查即可
echo "Java 版本:"
java -version

echo ""
echo "========== 3. 进入项目目录 =========="
# 假设 ZIP 解压后目录结构
if [ -d "flutter_app" ]; then
  cd flutter_app
elif [ -d "app" ]; then
  cd app
else
  # 列出所有目录找 pubspec.yaml
  find . -name "pubspec.yaml" -type f
  cd $(find . -name "pubspec.yaml" -type f | head -1 | xargs dirname)
fi

pwd
ls -la

echo ""
echo "========== 4. 获取依赖 =========="
flutter pub get

echo ""
echo "========== 5. 构建 APK =========="
flutter build apk --release -v

echo ""
echo "========== 6. 验证 APK =========="
if [ -f "build/app/outputs/flutter-apk/app-release.apk" ]; then
  echo "✅ APK 构建成功！"
  ls -lh build/app/outputs/flutter-apk/app-release.apk
else
  echo "❌ APK 未找到，构建可能失败"
  find . -name "*.apk" -type f
fi
```

### ⑤ 配置输出目录

**输出路径**设置为：
```
build/app/outputs/flutter-apk/
```

这样构建完成后的 APK 会保存到这个目录

---

## 第四步：开始构建

### ① 检查配置

确认以下信息正确：
- ✅ 代码来源：正确的 ZIP 文件
- ✅ 构建脚本：已粘贴
- ✅ 输出目录：`build/app/outputs/flutter-apk/`

### ② 点击"开始构建"

点击右下角的 **"开始构建"** 按钮

### ③ 等待构建完成

你会看到实时构建日志：

```
========== Flutter APK 构建开始 ==========
========== 1. 安装 Flutter SDK ==========
✅ Flutter 版本: Flutter 3.19.0
========== 2. 安装 Android SDK ==========
✅ Java 版本: openjdk version "11.0.x"
========== 3. 进入项目目录 ==========
========== 4. 获取依赖 ==========
Running "flutter pub get" in flutter_app...
========== 5. 构建 APK ==========
Building APK...
✅ APK 构建成功！
```

**预计时间**：15-25 分钟

### ④ 查看构建状态

- 🟢 **成功** - APK 已生成，可以下载
- 🔴 **失败** - 查看日志找出错误原因

---

## 第五步：下载 APK

### ① 构建完成后

在构建记录中找到你的构建任务

### ② 点击下载

点击 **"下载"** 或 **"查看文件"** 按钮

### ③ 获取 APK

下载文件通常是：
- `app-release.apk`（大小 30-50MB）

---

## 第六步：验证 APK

### ① 检查文件

```powershell
# 在 PowerShell 里检查
cd Downloads
ls app-release.apk
(Get-Item app-release.apk).Length  # 查看大小
```

### ② 签名验证

```powershell
# 验证 APK 签名
keytool -printcert -jarfile app-release.apk
```

---

## 第七步：安装到手机

### 方式一：USB 直连（推荐）

```powershell
# 连接手机，开启 USB 调试
adb devices  # 列出设备

# 安装 APK
adb install app-release.apk

# 看到 "Success" 就说明安装完了
```

### 方式二：微信传输

1. 把 APK 拖到微信里发给手机
2. 手机打开文件，点击安装

### 方式三：分享链接

1. 上传到云盘
2. 手机扫码下载

---

## 🧪 测试应用

### ① 打开应用

手机上找到 **"桶装水配送"** 应用

### ② 登录测试

使用测试账号：

| 账号 | 密码 |
|------|------|
| `13800000000` | `123456` |
| `admin` | `admin123` |

### ③ 检查功能

- ✅ 能否成功登录
- ✅ 能否看到任务列表
- ✅ 能否修改任务状态
- ✅ 网络连接是否正常（应该连接到 43.138.207.105）

---

## ⚠️ 常见问题处理

### Q1: 构建失败 - "找不到 pubspec.yaml"

**原因**：ZIP 文件解压后目录结构不对

**解决**：
1. 检查 `flutter_app_final.zip` 的内部结构
2. 确保 `pubspec.yaml` 在 `flutter_app/` 目录里

### Q2: 构建失败 - "Gradle 编译错误"

**原因**：通常是依赖下载失败或版本不兼容

**解决**：
1. 检查 `pubspec.yaml` 的 Flutter 版本
2. 更新依赖：`flutter pub upgrade`
3. 重新构建

### Q3: 构建失败 - "内存不足"

**原因**：2GB 内存可能不够

**解决**：
1. 联系腾讯云支持升级环境内存到 4GB
2. 或者用本地编译方式

### Q4: APK 太大（超过 100MB）

**原因**：包含了调试符号或未压缩资源

**解决**：
1. 在构建脚本添加：`--split-per-abi`
2. 这样会生成多个针对不同 CPU 的 APK，文件更小

### Q5: 下载的 APK 无法安装

**原因**：可能是签名问题或 Android 版本不兼容

**解决**：
1. 检查手机 Android 版本（需要 5.0 或以上）
2. 尝试卸载旧版本后重新安装
3. 在"设置 → 应用 → 权限"里给予安装权限

---

## 📊 构建时间参考

| 阶段 | 时间 |
|------|------|
| 上传代码 | 1-2 分钟 |
| 下载 Flutter SDK | 3-5 分钟 |
| 获取依赖 | 3-5 分钟 |
| 编译代码 | 5-8 分钟 |
| 生成 APK | 2-3 分钟 |
| **总计** | **15-25 分钟** |

---

## ✅ 构建成功的标志

```
========== 6. 验证 APK ==========
✅ APK 构建成功！
-rw-r--r-- 1 root root 45M Mar 18 15:30 app-release.apk
```

看到这个就说明完全成功了！🎉

---

## 🔗 有用的链接

- **腾讯云 CloudBase 文档**：https://cloud.tencent.com/document/product/876
- **Flutter 官方文档**：https://flutter.dev/docs
- **腾讯云 APK 构建指南**：https://cloud.tencent.com/document/product/876/39571

---

## 📱 下一步

APK 安装成功后：

1. **邀请朋友测试** - 看看 APP 是否好用
2. **收集反馈** - 记录问题
3. **发布到应用商店** - Google Play Store（需要开发者账号）
4. **继续迭代** - 更新功能

---

**祝你构建顺利！有问题随时告诉我！** 🚀
