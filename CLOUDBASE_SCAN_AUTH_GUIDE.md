# 腾讯云 CloudBase 扫码授权指南

## 🎯 目标
用扫码方式（设备码）授权，然后自动编译 APK

---

## 📱 第一步：扫码授权（最安全，无需密码）

### 方式 1️⃣：用网页版直接授权（推荐）

1. **打开浏览器** 访问这个链接：
   ```
   https://console.cloud.tencent.com/tcb
   ```

2. **看到登录页面** 后，点击 **"扫码登录"**

3. **用手机微信** 打开相机，扫描页面上的二维码

4. **在手机上点击「授权」** 确认

5. **登录成功后** 你会看到你的 CloudBase 环境

---

### 方式 2️⃣：用命令行授权（高级用户）

如果你想用命令行，执行：

```bash
npm install -g @cloudbase/cli
cloudbase login --device
```

然后扫码授权。

---

## 🔧 第二步：准备上传文件

确保你已有这个文件：
```
d:\AI\tongzhuangshuiAPP\flutter_app_final.zip
```

如果没有，执行：
```powershell
cd d:\AI\tongzhuangshuiAPP
Compress-Archive -Path flutter_app -DestinationPath flutter_app_final.zip -Force
```

---

## 🚀 第三步：上传到 CloudBase 云构建

1. **登录腾讯云** https://console.cloud.tencent.com/tcb

2. **选择你的环境**（如果只有一个，自动选中）

3. **左侧菜单** → **构建与部署** → **云构建**

4. **点击「新建构建」** → **「上传本地代码」**

5. **选择文件** → 上传 `flutter_app_final.zip`

6. **粘贴下面的构建脚本**：

```bash
#!/bin/bash
set -e

echo "=========================================="
echo "Flutter APK 自动编译脚本"
echo "=========================================="

# 1. 解压项目
echo "[1/5] 解压 Flutter 项目..."
unzip -q flutter_app_final.zip
cd flutter_app

# 2. 检查 Flutter
echo "[2/5] 检查 Flutter 环境..."
flutter --version

# 3. 获取依赖
echo "[3/5] 获取 Flutter 依赖..."
flutter pub get

# 4. 编译 APK
echo "[4/5] 编译 Release APK..."
flutter build apk --release -v

# 5. 输出结果
echo "[5/5] 编译完成！"
echo ""
echo "APK 位置："
find . -name "app-release.apk" -type f
echo ""
echo "✅ 编译成功！"
```

7. **点击「开始构建」** → 等待 15-25 分钟

8. **编译完成后** → 点击「下载** → 获得 `app-release.apk`

---

## 📲 第四步：安装到手机

```bash
adb install app-release.apk
```

或者直接用 USB 连接手机，双击 APK 文件安装。

---

## 💡 快速检查清单

- [ ] 已打开 https://console.cloud.tencent.com/tcb
- [ ] 已用微信扫码授权
- [ ] 已看到自己的 CloudBase 环境
- [ ] 已上传 `flutter_app_final.zip`
- [ ] 已粘贴构建脚本
- [ ] 已点击「开始构建」
- [ ] 等待编译完成（15-25 分钟）

---

## 🆘 常见问题

**Q: 扫码后还是显示登录页面？**
A: 清除浏览器缓存（Ctrl+Shift+Delete），然后重新访问 https://console.cloud.tencent.com/tcb

**Q: 上传了 ZIP，但看不到项目代码？**
A: 检查 ZIP 文件是否正确：应该包含 `flutter_app/` 文件夹，ZIP 内有 `pubspec.yaml`

**Q: 编译失败了？**
A: 查看编译日志，常见原因：
- Flutter 版本不匹配（需要 3.16.0 以上）
- 依赖下载失败（网络问题）
- Android SDK 版本不对

---

## ✅ 完成后告诉我

当你看到这样的消息时，说明成功了：
```
✅ 编译成功！
APK 位置：
./build/app/outputs/flutter-apk/app-release.apk
```

然后告诉我 APK 已下载，我帮你后续处理！🎉
