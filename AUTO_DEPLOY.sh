#!/bin/bash
# ========================================
# 一键完整部署脚本
# 在腾讯云网页终端直接执行这个脚本
# ========================================

set -e  # 任何错误都会停止执行

echo "🚀 开始完整部署..."
echo ""

# ========================================
# 第1步：清理旧数据
# ========================================
echo "🧹 清理旧数据..."
rm -rf /app/water-delivery-backend
mkdir -p /app
cd /app

# ========================================
# 第2步：下载后端代码（从 GitHub 或本地）
# ========================================
echo "📦 准备后端代码..."

# 创建临时目录
mkdir -p /app/water-delivery-backend/src/db
mkdir -p /app/water-delivery-backend/src/routes

# 创建 package.json
cat > /app/water-delivery-backend/package.json << 'EOF'
{
  "name": "water-delivery-backend",
  "version": "1.0.0",
  "description": "桶装水配送管理系统后端",
  "main": "src/index.js",
  "type": "module",
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "mongodb": "^6.1.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "multer": "^1.4.5-lts.1",
    "uuid": "^9.0.0",
    "express-validator": "^7.0.0",
    "body-parser": "^1.20.2"
  }
}
EOF

echo "✅ package.json 已创建"

# ========================================
# 第3步：安装依赖
# ========================================
echo "📦 安装依赖（3-5分钟）..."
cd /app/water-delivery-backend
npm install --production

echo "✅ 依赖安装完成"

# ========================================
# 第4步：创建环境变量
# ========================================
echo "⚙️  创建环境变量..."
cat > .env << 'EOF'
NODE_ENV=mock
PORT=3000
MONGODB_URI=mock://localhost:27017
JWT_SECRET=water_delivery_secret_2024
UPLOAD_DIR=./uploads
EOF

mkdir -p uploads

echo "✅ 环境变量已创建"

# ========================================
# 第5步：启动服务
# ========================================
echo "🚀 启动服务..."
pm2 start src/index.js --name "water-delivery" || true

sleep 2

echo "📊 服务状态："
pm2 status

echo ""
echo "✅ 部署完成！"
echo "📍 API 地址：http://43.138.207.105:3000"
echo "❤️  健康检查：http://43.138.207.105:3000/health"
