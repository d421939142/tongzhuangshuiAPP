#!/bin/bash
# ============================================
# 桶装水配送APP - 腾讯云服务器一键部署脚本
# 适用：Ubuntu 20.04 / 22.04 (腾讯云轻量服务器)
# ============================================

echo "🚀 开始部署桶装水配送APP后端..."

# 1. 更新系统
apt-get update -y

# 2. 安装 Node.js 18
echo "📦 安装 Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# 3. 安装 PM2 (进程守护)
echo "📦 安装 PM2..."
npm install -g pm2

# 4. 进入项目目录
cd /app/water-delivery-backend

# 5. 安装依赖
echo "📦 安装项目依赖..."
npm install --production

# 6. 启动服务 (Mock 模式，无需 MongoDB)
echo "🎭 启动 Mock 模式..."
pm2 start src/index.js --name "water-delivery" --env mock

# 7. 设置开机自启
pm2 startup
pm2 save

echo "✅ 部署完成！"
echo "📍 API地址: http://$(curl -s ifconfig.me):3000"
echo "❤️  健康检查: http://$(curl -s ifconfig.me):3000/health"
