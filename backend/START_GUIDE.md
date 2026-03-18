# 🛠️ 后端启动指南

## 问题：后端需要 MongoDB

你看到的后端依赖了 MongoDB，需要先启动数据库才能运行服务器。

---

## ✅ 解决方案

### **方案 A：快速测试模式（推荐 - 5 分钟）**

使用内存数据库，无需安装 MongoDB：

```bash
cd d:\AI\tongzhuangshuiAPP\backend

# 启动 mock 模式
npm run dev:mock
```

这会启动一个带有 **模拟数据** 的服务器，完全可以正常使用，适合测试。

---

### **方案 B：使用本地 MongoDB（正式模式）**

如果要持久化数据，需要安装 MongoDB：

#### 🔗 Step 1：下载 MongoDB

访问：https://www.mongodb.com/try/download/community

选择你的系统（Windows），下载安装程序。

#### 📦 Step 2：安装

1. 双击安装程序
2. 选择"Complete"安装
3. 勾选"Install MongoDB Compass"（可视化工具）
4. 完成安装

MongoDB 会自动启动，监听 `mongodb://localhost:27017`

#### 🚀 Step 3：启动后端

```bash
cd d:\AI\tongzhuangshuiAPP\backend
npm run dev
```

✅ 成功后会输出：
```
✓ MongoDB 连接成功
🚀 服务器启动在 http://localhost:3000
```

---

## 📊 对比

| 方案 | 优点 | 缺点 | 何时选择 |
|------|------|------|---------|
| **Mock 模式** | 快速、无需安装、模拟数据充分 | 重启后数据清空 | ✅ **个人测试** |
| **MongoDB** | 数据持久化、正式环境 | 需要装数据库、占用内存 | 正式部署 |

---

## 🚀 快速开始（5 分钟）

```bash
# 方案 A：快速模式（无需 MongoDB）
cd d:\AI\tongzhuangshuiAPP\backend
npm run dev:mock

# 终端会输出：
# 🚀 服务器启动在 http://localhost:3000 (Mock Mode)
```

然后在另一个终端启动前端：
```bash
cd d:\AI\tongzhuangshuiAPP\web_admin
npm run dev
```

打开浏览器：http://localhost:5173

登录账号：
- 手机号：13800000000
- 密码：123456

---

## 🔧 如果选择 MongoDB 方案

### Windows 快速安装

```bash
# 用 Chocolatey（如果已装）
choco install mongodb-community

# 或者手动下载：
https://www.mongodb.com/try/download/community
```

### 启动 MongoDB 服务

```bash
# Windows - 用管理员打开 PowerShell

# 检查服务是否运行
Get-Service MongoDB

# 如果没有运行
Start-Service MongoDB

# 启动后端
cd d:\AI\tongzhuangshuiAPP\backend
npm run dev
```

### 验证连接

打开 MongoDB Compass（安装时自动装的）：
- 连接到：`mongodb://localhost:27017`
- 看到 `water_delivery` 数据库就说明连接成功

---

## ❓ 常见问题

### ❌ `Error: connect ECONNREFUSED 127.0.0.1:27017`

**原因**：MongoDB 没有启动  
**解决**：
```bash
# Windows
net start MongoDB

# 或到服务管理器启动 MongoDB 服务
```

### ❌ `Port 3000 already in use`

**原因**：端口被占用  
**解决**：
```bash
# 查找占用端口的进程
netstat -ano | findstr :3000

# 杀死进程（替换 PID）
taskkill /PID <PID> /F

# 改用其他端口
PORT=3001 npm run dev
```

### ❌ `Cannot find module 'mongodb'`

**原因**：依赖未安装  
**解决**：
```bash
cd d:\AI\tongzhuangshuiAPP\backend
npm install
```

---

## 📚 推荐步骤

### 如果你是初学者或只想快速测试

1. ✅ 用 **Mock 模式** 测试
2. 启动后端 + 前端 + App
3. 熟悉功能流程

### 如果要正式使用

1. 安装 MongoDB
2. 配置数据库连接
3. 启动后端（正式模式）
4. 部署前端和 App

---

## 🎯 下次启动（简化版）

如果选择 Mock 模式：
```bash
# 后端 - 无需任何准备
cd backend && npm run dev:mock

# 前端
cd web_admin && npm run dev

# App
cd flutter_app && flutter run
```

**就这么简单！** 🚀

---

最后更新：2026-03-18
