import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import { MockDB } from './db/mockdb.js';
import authRoutes from './routes/auth.js';
import taskRoutes from './routes/tasks.js';
import customerRoutes from './routes/customers.js';
import uploadRoutes from './routes/upload.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const IS_MOCK = process.env.NODE_ENV === 'mock' || process.env.MONGODB_URI === 'mock://localhost:27017';

// MongoDB 连接或 Mock 数据库
let db = null;
let client = null;

// 初始化数据库
async function connectDB() {
  try {
    if (IS_MOCK) {
      // 使用 Mock 模式
      db = new MockDB();
      console.log('✅ Mock 数据库已初始化 (内存模式)');
      console.log('📌 示例数据已加载');
      console.log('💾 提示：重启后数据会清空');
    } else {
      // 使用真实 MongoDB
      client = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017');
      await client.connect();
      db = client.db('water_delivery');
      console.log('✅ MongoDB 连接成功');
      
      // 创建索引
      await db.collection('users').createIndex({ phone: 1 }, { unique: true });
      await db.collection('customers').createIndex({ phone: 1 }, { unique: true });
      await db.collection('tasks').createIndex({ createdAt: -1 });
    }
  } catch (error) {
    console.error('❌ 数据库连接失败:', error);
    if (!IS_MOCK) {
      process.exit(1);
    }
  }
}

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 数据库中间件
app.use((req, res, next) => {
  req.db = db;
  next();
});

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/upload', uploadRoutes);

// 健康检查
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    mode: IS_MOCK ? 'mock' : 'production',
    timestamp: new Date()
  });
});

// 启动服务器
async function start() {
  await connectDB();
  
  app.listen(PORT, () => {
    const mode = IS_MOCK ? '🎭 Mock 模式' : '🔗 MongoDB 模式';
    console.log(`\n🚀 服务器启动成功`);
    console.log(`📍 服务器地址: http://localhost:${PORT}`);
    console.log(`🔧 运行模式: ${mode}`);
    console.log(`📚 API 文档: http://localhost:${PORT}/api`);
    console.log(`❤️  健康检查: http://localhost:${PORT}/health\n`);
  });
}

start().catch(err => {
  console.error('启动失败:', err);
  process.exit(1);
});

export { app, db };
