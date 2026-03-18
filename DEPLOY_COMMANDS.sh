#!/bin/bash
# ==========================================
# 完整部署脚本 - 复制所有命令逐条执行
# ==========================================

echo "🚀 开始部署..."

# =====================================
# 第1步：安装 Node.js 18
# =====================================
echo "📦 第1步：安装 Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo bash -
sudo apt-get update
sudo apt-get install -y nodejs

# 验证
echo "检查 Node.js 版本："
node -v
npm -v

# =====================================
# 第2步：安装 PM2
# =====================================
echo "📦 第2步：安装 PM2..."
sudo npm install -g pm2
sudo npm install -g pm2-logrotate

# 验证
echo "检查 PM2 版本："
pm2 -v

# =====================================
# 第3步：准备项目目录
# =====================================
echo "📁 第3步：准备项目目录..."
sudo mkdir -p /app
sudo chown ubuntu:ubuntu /app
cd /app

# =====================================
# 第4步：检查后端代码是否存在
# =====================================
echo "🔍 第4步：检查后端代码..."
if [ -d "/app/water-delivery-backend" ]; then
    echo "✅ 后端代码已存在"
else
    echo "❌ 后端代码不存在，请先上传！"
    exit 1
fi

cd /app/water-delivery-backend

# =====================================
# 第5步：安装依赖
# =====================================
echo "📦 第5步：安装项目依赖（可能需要3-5分钟）..."
npm install --production

# =====================================
# 第6步：创建环境变量文件
# =====================================
echo "⚙️  第6步：创建环境变量..."
cat > .env << 'EOF'
NODE_ENV=mock
PORT=3000
MONGODB_URI=mock://localhost:27017
JWT_SECRET=water_delivery_secret_2024
UPLOAD_DIR=./uploads
EOF

# 验证环境变量
echo "环境变量内容："
cat .env

# =====================================
# 第7步：创建上传目录
# =====================================
echo "📁 第7步：创建上传目录..."
mkdir -p uploads
ls -la uploads/

# =====================================
# 第8步：用 PM2 启动服务
# =====================================
echo "🚀 第8步：启动服务..."
pm2 start src/index.js --name "water-delivery"

# 等待2秒让服务启动
sleep 2

# 查看状态
echo "📊 服务状态："
pm2 status

# 查看日志
echo "📋 最近的日志："
pm2 logs water-delivery --lines 10

# =====================================
# 第9步：设置开机自启
# =====================================
echo "⚙️  第9步：设置开机自启..."
pm2 startup
pm2 save

echo ""
echo "✅ 部署完成！"
echo "📍 服务器地址：http://43.138.207.105:3000"
echo "❤️  健康检查：http://43.138.207.105:3000/health"
