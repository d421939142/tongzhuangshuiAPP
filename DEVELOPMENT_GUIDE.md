# 🚿 桶装水配送管理系统 - 完整开发指南

> 这是一个**生产级别**的桶装水配送管理解决方案，包含完整的前后端代码框架和数据库设计。

## 📋 项目概览

```
┌─────────────────────────────────────────────────────────┐
│         桶装水配送管理系统 - 技术架构图                  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  📱 客户端（多端）                                       │
│  ├─ Flutter Android APP（送水工）                       │
│  ├─ Flutter Android APP（管理员简版）                   │
│  └─ React Web 管理后台（PC 版）                         │
│                                                         │
│  ☁️ 后端服务（Node.js + Express）                       │
│  ├─ 用户认证（JWT）                                    │
│  ├─ 任务管理                                           │
│  ├─ 客户管理                                           │
│  ├─ 数据统计                                           │
│  └─ 文件上传（签收照片）                               │
│                                                         │
│  🗄️ 数据库（MongoDB）                                   │
│  ├─ Users（用户）                                       │
│  ├─ Customers（客户）                                   │
│  ├─ Tasks（任务）                                       │
│  ├─ Orders（订单）                                      │
│  └─ Tickets（水票）                                     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## 🛠️ 技术选型

| 层级 | 技术 | 说明 |
|------|------|------|
| **前端 - 送水工APP** | Flutter | 跨平台移动开发，一套代码生成 iOS/Android |
| **前端 - 管理后台** | React 18 | 现代化 Web UI，Ant Design 企业级组件 |
| **后端** | Node.js + Express | 轻量级、高效的 API 服务 |
| **数据库** | MongoDB | 灵活的文档型数据库，适合业务迭代 |
| **认证** | JWT | 无状态身份验证，支持分布式部署 |
| **文件存储** | 本地/对象存储 | 拍照签收上传，可扩展为 S3/OSS |
| **构建工具** | Vite + Gradle | 快速的开发体验和打包 |

## 📁 项目结构详解

### 后端结构

```
backend/
├── src/
│   ├── index.js                    # 主服务入口（Express 应用初始化）
│   ├── routes/
│   │   ├── auth.js                 # 认证路由（登录、注册、修改密码）
│   │   ├── tasks.js                # 任务路由（CRUD、状态管理）
│   │   ├── customers.js            # 客户路由（CRUD、水票、欠桶）
│   │   └── upload.js               # 文件上传路由
│   ├── middleware/
│   │   ├── auth.js                 # JWT 验证中间件
│   │   └── errorHandler.js         # 全局错误处理
│   └── models/                     # 数据模型（可选，当前用 MongoDB 直连）
├── uploads/                        # 上传文件存储目录
├── .env                            # 环境变量
└── package.json
```

### 前端 Flutter 结构

```
flutter_app/
├── lib/
│   ├── main.dart                   # 应用入口
│   ├── config/
│   │   ├── app_config.dart         # 应用配置（API URL、超时时间）
│   │   ├── routes.dart             # 路由定义
│   │   └── theme.dart              # UI 主题（颜色、字体）
│   ├── services/
│   │   ├── auth_service.dart       # 认证服务（登录、token 管理）
│   │   ├── api_service.dart        # HTTP 请求服务（Dio）
│   │   ├── location_service.dart   # GPS 定位服务
│   │   └── db_service.dart         # 本地数据库（SQLite）
│   ├── models/
│   │   ├── task_model.dart         # 任务模型
│   │   ├── customer_model.dart     # 客户模型
│   │   └── user_model.dart         # 用户模型
│   ├── pages/
│   │   ├── auth/
│   │   │   └── login_page.dart     # 登录页
│   │   ├── delivery/
│   │   │   ├── home_page.dart      # 送水工首页
│   │   │   ├── task_list_page.dart # 任务列表
│   │   │   ├── task_detail_page.dart # 任务详情
│   │   │   └── checkin_page.dart   # 签收页面
│   │   └── admin/
│   │       └── dashboard_page.dart # 管理员看板
│   ├── widgets/
│   │   ├── task_card.dart          # 任务卡片
│   │   ├── customer_selector.dart  # 客户选择器
│   │   └── photo_uploader.dart     # 照片上传器
│   └── utils/
│       ├── validators.dart         # 验证工具
│       └── helpers.dart            # 通用辅助函数
└── pubspec.yaml
```

### 前端 React 结构

```
web_admin/
├── src/
│   ├── App.jsx                     # 路由入口
│   ├── main.jsx                    # 应用初始化
│   ├── pages/
│   │   ├── LoginPage.jsx           # 登录页
│   │   ├── DashboardPage.jsx       # 仪表板
│   │   ├── CustomersPage.jsx       # 客户管理
│   │   ├── TasksPage.jsx           # 任务管理
│   │   └── StatsPage.jsx           # 统计分析
│   ├── components/
│   │   ├── Layout.jsx              # 主布局
│   │   ├── Header.jsx              # 顶部导航
│   │   ├── Sidebar.jsx             # 侧边栏
│   │   └── Table/                  # 数据表格
│   ├── store/
│   │   ├── authStore.js            # 认证状态（Zustand）
│   │   ├── customerStore.js        # 客户状态
│   │   └── taskStore.js            # 任务状态
│   ├── api/
│   │   └── client.js               # Axios 实例配置
│   ├── styles/
│   │   └── globals.css             # 全局样式
│   └── utils/
│       ├── request.js              # HTTP 请求工具
│       └── formatters.js           # 数据格式化
├── public/
├── vite.config.js
├── index.html
└── package.json
```

## 🚀 快速开始（5 分钟）

### 前置要求

```bash
# 检查环境
node --version      # >= 14.0.0
npm --version       # >= 6.0.0
flutter --version   # >= 3.0.0（仅需要开发 Flutter APP）
```

### 步骤 1️⃣ - 启动后端服务（3000 端口）

```bash
cd backend

# 复制环境变量文件
cp .env.example .env

# 或手动创建 .env
cat > .env << 'EOF'
PORT=3000
MONGODB_URI=mongodb://localhost:27017
JWT_SECRET=your-super-secret-key-change-in-production
NODE_ENV=development
EOF

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 或使用 nodemon 自动重启
npx nodemon src/index.js
```

✅ 服务启动成功提示：
```
✅ MongoDB 连接成功
🚀 服务器启动在 http://localhost:3000
```

### 步骤 2️⃣ - 启动 Web 管理后台（5173 端口）

```bash
cd web_admin

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

✅ 访问 http://localhost:5173 进入后台

**演示账号**：
- 手机号：13800000000
- 密码：123456

### 步骤 3️⃣ - 运行 Flutter APP（可选）

```bash
cd flutter_app

# 获取依赖
flutter pub get

# 运行应用
flutter run

# 或指定设备
flutter run -d <device-id>
```

## 📊 数据库初始化

### 自动初始化（推荐）

后端启动时会自动创建数据库和索引：

```javascript
// src/index.js 中的 connectDB() 函数自动执行：
// - 创建 users 集合（phone 唯一索引）
// - 创建 customers 集合（phone 唯一索引）
// - 创建 tasks 集合（createdAt 排序索引）
```

### 手动初始化（如需要）

```bash
# 连接 MongoDB
mongo

# 切换数据库
use water_delivery

# 创建集合
db.createCollection("users")
db.createCollection("customers")
db.createCollection("tasks")

# 创建索引
db.users.createIndex({ phone: 1 }, { unique: true })
db.customers.createIndex({ phone: 1 }, { unique: true })
db.tasks.createIndex({ createdAt: -1 })
```

### 插入演示数据

```bash
# 进入 MongoDB shell
mongo

use water_delivery

# 插入测试用户
db.users.insertOne({
  phone: "13800000000",
  passwordHash: "$2a$10$...",  # bcrypt hash of "123456"
  name: "管理员",
  role: "admin",
  createdAt: new Date(),
  status: "active"
})

db.users.insertOne({
  phone: "13900000000",
  passwordHash: "$2a$10$...",  # bcrypt hash of "123456"
  name: "送水工",
  role: "delivery",
  createdAt: new Date(),
  status: "active"
})
```

## 🔌 API 端点速查

### 认证

```bash
# 登录
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"13800000000","password":"123456"}'

# 响应
{
  "success": true,
  "token": "eyJhbGc...",
  "user": { "id": "...", "phone": "...", "role": "admin" }
}
```

### 任务管理

```bash
# 获取任务列表
curl http://localhost:3000/api/tasks \
  -H "Authorization: Bearer <token>"

# 创建任务（管理员）
curl -X POST http://localhost:3000/api/tasks \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "李四",
    "customerPhone": "13900000001",
    "address": "xx 小区 x 号楼",
    "productBrand": "康师傅",
    "quantity": 2,
    "price": 39.8
  }'

# 接受任务（送水工）
curl -X POST http://localhost:3000/api/tasks/:id/accept \
  -H "Authorization: Bearer <token>"

# 完成任务
curl -X POST http://localhost:3000/api/tasks/:id/complete \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "emptyBottles": 1,
    "photoUrl": "/uploads/photo.jpg",
    "notes": "已送达"
  }'
```

### 客户管理

```bash
# 获取客户列表
curl http://localhost:3000/api/customers \
  -H "Authorization: Bearer <token>"

# 创建客户
curl -X POST http://localhost:3000/api/customers \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "李四",
    "phone": "13900000001",
    "type": "residential",
    "addresses": ["xx 小区 x 号楼"]
  }'

# 更新水票
curl -X POST http://localhost:3000/api/customers/:id/update-tickets \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"amount": 1, "operation": "add"}'

# 更新欠桶
curl -X POST http://localhost:3000/api/customers/:id/update-bottle-debt \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"amount": 1, "operation": "add"}'
```

## 🔐 安全建议

### 生产环境检查清单

- [ ] 修改 `JWT_SECRET` 为强密码
- [ ] 启用 HTTPS（使用 Let's Encrypt）
- [ ] 配置 CORS 白名单
- [ ] 启用数据库认证
- [ ] 设置 API 频率限制
- [ ] 实施日志记录与审计
- [ ] 定期数据备份
- [ ] 使用环境变量管理敏感信息

### 密码加密

```javascript
// 注册时
const passwordHash = await bcrypt.hash(password, 10);

// 验证时
const isValid = await bcrypt.compare(inputPassword, passwordHash);
```

## 🎨 UI 设计系统

### 色彩方案

```css
--primary-color: #0EA5E9;        /* 天空蓝 */
--primary-dark: #0C4A6E;         /* 深海蓝 */
--accent-color: #F59E0B;         /* 琥珀黄 */
--success-color: #10B981;        /* 成功绿 */
--warning-color: #F59E0B;        /* 警告黄 */
--error-color: #EF4444;          /* 错误红 */
--bg-color: #F0F9FF;             /* 极浅蓝 */
--text-color: #64748B;           /* 文字灰 */
```

### 排版

```
标题 H1: 32px, bold (#0C4A6E)
标题 H2: 24px, bold (#0C4A6E)
标题 H3: 18px, semibold (#0C4A6E)
正文: 16px, regular (#64748B)
辅助文字: 14px, regular (#94A3B8)
```

## 📦 部署指南

### Docker 部署

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY src ./src

EXPOSE 3000
CMD ["node", "src/index.js"]
```

```bash
# 构建镜像
docker build -t water-delivery-backend .

# 运行容器
docker run -d -p 3000:3000 \
  -e MONGODB_URI=mongodb://mongo:27017 \
  water-delivery-backend
```

### Vercel 部署（Web 前端）

```bash
cd web_admin
npm run build
vercel
```

### Heroku 部署（Node.js 后端）

```bash
cd backend
heroku create water-delivery-api
git push heroku main
heroku config:set MONGODB_URI=<your-mongodb-uri>
```

## 🐛 常见问题

**Q: MongoDB 连接失败？**
```
A: 检查 MONGODB_URI 是否正确，确保本地 MongoDB 服务启动
  brew services start mongodb-community  # macOS
  sudo service mongod start              # Linux
```

**Q: JWT token 过期怎么办？**
```
A: 实现 refresh token 机制，在 token 快过期时自动刷新
```

**Q: 如何上传大文件？**
```
A: 修改 multer 配置中的 fileSize 限制
```

**Q: 支持微信支付吗？**
```
A: 当前不支持，可在 tasks.js 中集成微信支付 API
```

## 📚 进阶功能开发

### 实时通知（Socket.io）

```javascript
// 后端
const io = require('socket.io')(server);
io.on('connection', (socket) => {
  socket.on('task-completed', (data) => {
    io.emit('notification', { msg: '任务完成', data });
  });
});
```

### 地理位置追踪

```dart
// Flutter
final geolocator = Geolocator();
Position position = await geolocator.getCurrentPosition();
```

### 语音识别

```javascript
// Web
const recognition = new webkitSpeechRecognition();
recognition.lang = 'zh-CN';
recognition.start();
```

### OCR 图片识别

```javascript
// 集成第三方 API
import Tesseract from 'tesseract.js';
const { data: { text } } = await Tesseract.recognize(imagePath);
```

## 📞 技术支持

- 📧 邮件：tech@company.com
- 💬 钉钉群：xxx
- 📖 Wiki：https://wiki.company.com

---

**最后更新**：2024-12-18  
**维护者**：水配送技术团队  
**版本**：v1.0.0
