# 🚀 完整部署指南：腾讯云服务器 + Android APK

## 📋 整体流程

```
第一步：部署后端到腾讯云服务器（30分钟）
第二步：修改APP的服务器地址
第三步：用 Codemagic 编译 Android APK（15分钟）
第四步：安装 APK 到手机，测试
```

---

## 第一步：购买腾讯云轻量服务器

### 推荐配置（测试用）
- **机型**：轻量应用服务器
- **CPU/内存**：1核2GB（约24元/月）
- **系统**：Ubuntu 22.04 LTS（**必须选 Ubuntu！**）
- **地域**：选离你最近的（上海/广州/北京）
- **带宽**：5Mbps 够用

### 购买后注意事项
1. 打开**防火墙**，放行以下端口：
   - `22`（SSH）
   - `3000`（后端API）
   - `80`（HTTP，备用）

**设置路径**：轻量服务器控制台 → 防火墙 → 添加规则 → 端口 3000，TCP，所有IP

---

## 第二步：连接服务器并部署后端

### 方式一：用腾讯云网页终端（最简单）
1. 进入轻量服务器控制台
2. 点击 **"登录"** → 选 **"VNC登录"** 或 **"WebShell"**
3. 直接在网页里敲命令

### 方式二：用 SSH 工具（推荐）
- Windows 推荐：**MobaXterm**（免费）或 **FinalShell**
- 连接信息：
  ```
  主机：你的服务器公网IP
  端口：22
  用户名：ubuntu
  密码：你设置的密码
  ```

### 部署命令（复制粘贴执行）

```bash
# 1. 安装 Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo bash -
sudo apt-get install -y nodejs

# 验证安装
node -v   # 应该显示 v18.x.x
npm -v    # 应该显示 9.x.x 或 10.x.x

# 2. 安装 PM2（进程守护，确保服务器重启后自动运行）
sudo npm install -g pm2

# 3. 创建项目目录
sudo mkdir -p /app
sudo chown ubuntu:ubuntu /app
cd /app
```

### 上传后端代码到服务器

**方式A：用 SFTP 上传（推荐）**
1. 用 FinalShell 或 MobaXterm 的文件管理器
2. 把本地 `d:\AI\tongzhuangshuiAPP\backend` 文件夹
3. 上传到服务器 `/app/water-delivery-backend/`

**方式B：用命令行上传**
```powershell
# 在你的 Windows 电脑上执行
scp -r d:\AI\tongzhuangshuiAPP\backend ubuntu@你的IP:/app/water-delivery-backend
```

### 启动后端服务

```bash
# 进入项目目录
cd /app/water-delivery-backend

# 安装依赖
npm install --production

# 创建环境变量文件（Mock模式，无需安装MongoDB）
cat > .env << 'EOF'
NODE_ENV=mock
PORT=3000
MONGODB_URI=mock://localhost:27017
JWT_SECRET=water_delivery_secret_2024_change_me
UPLOAD_DIR=./uploads
EOF

# 创建上传目录
mkdir -p uploads

# 用 PM2 启动服务
pm2 start src/index.js --name "water-delivery"

# 设置开机自启
pm2 startup
# ⚠️ 执行上面命令后会给你一行命令，复制粘贴执行！
pm2 save

# 查看服务状态
pm2 status
pm2 logs water-delivery
```

### 验证部署成功

在你的电脑浏览器访问：
```
http://你的服务器IP:3000/health
```

如果看到类似下面的内容，说明部署成功：
```json
{
  "status": "ok",
  "mode": "mock",
  "timestamp": "2024-xx-xx..."
}
```

---

## 第三步：修改 APP 的服务器地址

修改文件：`d:\AI\tongzhuangshuiAPP\flutter_app\lib\config\app_config.dart`

把第 4 行的 `YOUR_SERVER_IP` 改成你的腾讯云服务器公网IP：

```dart
// 修改前
static const String _serverIp = 'YOUR_SERVER_IP';

// 修改后（例子）
static const String _serverIp = '43.156.88.123';
```

---

## 第四步：编译 Android APK

### 使用 Codemagic（免费，最简单）

#### 1. 压缩项目
在你的 Windows 电脑上执行：
```powershell
cd d:\AI\tongzhuangshuiAPP
Compress-Archive -Path flutter_app -DestinationPath flutter_app_release.zip -Force
```

#### 2. 上传到 Codemagic 编译
1. 打开 https://codemagic.io
2. 注册账号（用 GitHub 或 Google）
3. 点 **"New application"**
4. 选 **"Flutter App"**
5. 选 **"Upload file"** → 上传 `flutter_app_release.zip`
6. 配置：
   - **Platform**: Android
   - **Build type**: Release APK
   - **Flutter version**: 3.x (选最新稳定版)
7. 点 **"Start new build"**
8. 等待约 10-15 分钟
9. 构建完成后，下载 `.apk` 文件

#### 3. 安装 APK 到手机
1. 把 APK 文件复制到手机（USB线 或 微信传输）
2. 手机上允许安装未知来源应用
3. 点击 APK 安装

---

## 第五步：测试应用

### 测试账号
| 角色 | 账号 | 密码 |
|------|------|------|
| 送水工 | `13800000000` | `123456` |
| 管理员 | `admin` | `admin123` |

### 测试功能清单
- [ ] 登录成功
- [ ] 查看任务列表
- [ ] 更新任务状态
- [ ] 管理员查看报表

---

## 常见问题

### Q: 手机连不上服务器？
**A**: 检查以下几点：
1. 腾讯云防火墙是否放行 3000 端口
2. APP 里的 IP 地址是否正确
3. 手机是否有网络连接

### Q: 服务启动后一会儿自动停止？
**A**: 用 PM2 查看日志：
```bash
pm2 logs water-delivery
```

### Q: 想要真实数据库（MongoDB）？
**A**: 可以：
1. 在腾讯云安装 MongoDB：
   ```bash
   sudo apt-get install -y mongodb
   sudo systemctl start mongodb
   sudo systemctl enable mongodb
   ```
2. 修改 `.env` 文件：
   ```
   NODE_ENV=production
   MONGODB_URI=mongodb://localhost:27017
   ```
3. 重启服务：`pm2 restart water-delivery`

---

## 📊 架构图

```
手机 (Android APK)
       ↓ HTTP请求
腾讯云服务器 (公网IP:3000)
  └── Node.js + Express
       └── Mock DB (内存) / MongoDB

访问流程：
手机APP → 腾讯云IP:3000 → 后端API → 数据库
```

---

## 快速命令备忘录

```bash
# 查看服务状态
pm2 status

# 重启服务
pm2 restart water-delivery

# 查看日志
pm2 logs water-delivery

# 停止服务
pm2 stop water-delivery

# 查看服务器公网IP
curl ifconfig.me
```
