# 桶装水配送管理系统

一个完整的桶装水配送管理解决方案，包含：
- 📱 **Flutter Android APP**（送水工端 + 管理员端）
- 💻 **React Web 管理后台**
- ☁️ **Node.js 后端服务**

## 项目结构

```
tongzhuangshuiAPP/
├── flutter_app/          # Flutter Android APP
│   ├── lib/
│   │   ├── main.dart
│   │   ├── config/       # 配置文件
│   │   ├── services/     # 服务层
│   │   ├── models/       # 数据模型
│   │   ├── pages/        # 页面
│   │   └── widgets/      # 自定义组件
│   └── pubspec.yaml
│
├── backend/              # Node.js 后端
│   ├── src/
│   │   ├── index.js      # 主服务文件
│   │   └── routes/       # API 路由
│   │       ├── auth.js
│   │       ├── tasks.js
│   │       ├── customers.js
│   │       └── upload.js
│   ├── package.json
│   └── .env
│
└── web_admin/            # React 管理后台
    ├── src/
    │   ├── App.jsx
    │   ├── pages/        # 页面组件
    │   ├── components/   # 通用组件
    │   └── store/        # Zustand 状态管理
    ├── package.json
    └── vite.config.js
```

## 核心功能

### 📱 送水工 APP
- ✅ 任务列表与详情查看
- ✅ 任务接受与完成
- ✅ 拍照签收上传
- ✅ 空桶返回统计
- ✅ 客户水票充值
- ✅ 地址导航与 GPS 定位
- ✅ 离线缓存支持

### 👨‍💼 管理员 APP（简版）
- ✅ 实时看板（今日订单、销额）
- ✅ 工作通知推送
- ✅ 快速查询客户
- ✅ 简单审批功能

### 💻 Web 管理后台
- ✅ 客户管理（增删改查、档案建立）
- ✅ 水票统计（欠桶数、剩余水票）
- ✅ 任务发布（支持语音识别、客户编号快速下单）
- ✅ 订单统计与报表
- ✅ 批量导入导出客户资料
- ✅ 用水量统计（按天/月/年）
- ✅ 销量统计与分析
- ✅ 图片识别 OCR（识别纸质存票）

## 快速开始

### 前提条件
- Node.js >= 14
- Flutter >= 3.0
- MongoDB (可选，使用本地测试数据库)
- Android SDK (开发 Flutter APP)

### 1️⃣ 后端服务启动

```bash
cd backend

# 安装依赖
npm install

# 创建 .env 文件
cat > .env << EOF
PORT=3000
MONGODB_URI=mongodb://localhost:27017
JWT_SECRET=your-secret-key-here
EOF

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000/health 验证服务是否启动

### 2️⃣ Web 管理后台启动

```bash
cd web_admin

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 http://localhost:5173 进入管理后台

**演示账号**：
- 手机号：13800000000
- 密码：123456

### 3️⃣ Flutter APP 开发

```bash
cd flutter_app

# 获取依赖
flutter pub get

# 连接 Android 设备或启动模拟器
flutter devices

# 运行 APP
flutter run
```

## API 文档

### 认证接口

#### 登录
```
POST /api/auth/login
{
  "phone": "13800000000",
  "password": "123456"
}
```

响应：
```json
{
  "success": true,
  "token": "eyJhbGc...",
  "user": {
    "id": "user_123",
    "phone": "13800000000",
    "name": "张三",
    "role": "delivery"
  }
}
```

### 任务接口

#### 获取任务列表
```
GET /api/tasks?status=pending&deliveryId=user_123
Authorization: Bearer <token>
```

#### 创建任务（管理员）
```
POST /api/tasks
Authorization: Bearer <token>
{
  "customerId": "CUST-123",
  "customerName": "李四",
  "customerPhone": "13900000000",
  "address": "xx 小区 x 号楼 xx 室",
  "productBrand": "康师傅",
  "quantity": 2,
  "price": 39.8,
  "notes": "要求冰的"
}
```

#### 接受任务（送水工）
```
POST /api/tasks/:id/accept
Authorization: Bearer <token>
```

#### 完成任务（上传签收）
```
POST /api/tasks/:id/complete
Authorization: Bearer <token>
{
  "emptyBottles": 1,
  "photoUrl": "/uploads/photo_123.jpg",
  "notes": "客户已签收"
}
```

### 客户接口

#### 获取客户列表
```
GET /api/customers?type=residential&search=李四
Authorization: Bearer <token>
```

#### 创建客户（管理员）
```
POST /api/customers
Authorization: Bearer <token>
{
  "name": "李四",
  "phone": "13900000000",
  "type": "residential",
  "addresses": ["xx 小区 x 号楼 xx 室", "xx 公司 x 楼"]
}
```

#### 更新水票
```
POST /api/customers/:id/update-tickets
Authorization: Bearer <token>
{
  "amount": 1,
  "operation": "add"
}
```

#### 更新欠桶
```
POST /api/customers/:id/update-bottle-debt
Authorization: Bearer <token>
{
  "amount": 1,
  "operation": "add"
}
```

### 上传接口

#### 上传照片
```
POST /api/upload/photo
Authorization: Bearer <token>
Content-Type: multipart/form-data
File: photo.jpg
```

响应：
```json
{
  "success": true,
  "data": {
    "url": "/uploads/photo_123.jpg",
    "filename": "photo_123.jpg",
    "size": 204800
  }
}
```

## 数据库设计

### Users 集合
```javascript
{
  _id: ObjectId,
  phone: String,          // 唯一
  passwordHash: String,
  name: String,
  role: String,           // 'admin' | 'delivery'
  createdAt: Date,
  status: String,         // 'active' | 'inactive'
}
```

### Customers 集合
```javascript
{
  _id: ObjectId,
  customerId: String,     // 客户编号
  name: String,
  phone: String,          // 唯一
  type: String,           // 'residential' | 'commercial' | 'casual'
  status: String,         // 'active' | 'inactive'
  addresses: [String],    // 多地址
  defaultAddressId: String,
  bottleDebt: Number,     // 欠桶数
  tickets: Number,        // 剩余水票
  createdAt: Date,
  lastOrderAt: Date,
}
```

### Tasks 集合
```javascript
{
  _id: String,            // UUID
  customerId: String,
  customerName: String,
  customerPhone: String,
  address: String,
  productBrand: String,   // 水品牌
  quantity: Number,
  price: Number,
  status: String,         // 'pending' | 'accepted' | 'completed' | 'cancelled'
  deliveryId: String,
  createdAt: Date,
  acceptedAt: Date,
  completedAt: Date,
  emptyBottles: Number,   // 返回空桶数
  photoUrl: String,       // 签收照片
  notes: String,
}
```

## 高级功能开发指南

### 语音识别（Web 管理后台）
```javascript
// 使用 Web Speech API
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'zh-CN';
recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript;
  // 解析客户编号或其他信息
};
```

### 图片识别 OCR
建议集成第三方 API：
- 腾讯云 OCR
- 阿里云 OCR
- PaddleOCR

### 批量导入导出
使用 `xlsx` 库处理 Excel 文件

### 地图与导航
Flutter APP 推荐使用：
- `amap_flutter_map` (高德地图)
- `bmap_flutter` (百度地图)

## 环境变量配置

### Backend (.env)
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017
JWT_SECRET=your-super-secret-key
UPLOAD_DIR=./uploads
```

### Frontend (.env.local)
```
VITE_API_URL=http://localhost:3000/api
```

## 常见问题

**Q: 如何修改 API 基础 URL？**
A: 修改 `flutter_app/lib/config/app_config.dart` 中的 `apiBaseUrl`

**Q: 如何添加新的用户角色？**
A: 修改认证服务中的角色检查逻辑，并在相应页面中添加权限控制

**Q: 如何支持多语言？**
A: 使用 `flutter_localization` 包进行国际化处理

## 部署建议

### 后端部署
- 推荐使用 Docker + Kubernetes
- 使用 PM2 在生产环境保持进程运行
- 配置 MongoDB Atlas 云数据库

### Flutter APP 部署
- 生成签名 APK：`flutter build apk --release`
- 发布到 Google Play Store 或内部应用市场

### Web 管理后台部署
- 构建：`npm run build`
- 使用 Nginx 反向代理
- 配置 HTTPS 和 CORS

## 贡献指南

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License

---

**最后更新**：2024-12-18
**维护人**：水配送团队
