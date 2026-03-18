# 桶装水管理系统 - Web 管理后台

## 📋 快速开始

### 1️⃣ 安装依赖
```bash
cd web_admin
npm install
```

### 2️⃣ 启动开发服务器
```bash
npm run dev
```

✅ 成功启动后，会在控制台输出：
```
  VITE v5.0.0  ready in 123 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

### 3️⃣ 打开浏览器

在浏览器中打开：**http://localhost:5173**

### 4️⃣ 登录

**演示账号**（需要后端运行）：
- 手机号：13800000000
- 密码：123456

---

## 🔧 故障排除

### ❌ 问题：无法启动或提示找不到文件

**解决方案**：
1. 确保已经安装了 Node.js（v16+）
   ```bash
   node --version
   ```

2. 删除 node_modules 和 package-lock.json，重新安装
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. 确保端口 5173 未被占用

### ❌ 问题：登录失败

**解决方案**：
确保后端服务正在运行（在另一个终端）：
```bash
cd backend
npm run dev
```

### ❌ 问题：页面显示空白

**解决方案**：
1. 打开浏览器开发者工具（F12）查看控制台错误
2. 检查网络标签页看 API 调用是否失败
3. 确保 Vite 服务已正确启动

---

## 📁 项目结构

```
web_admin/
├── index.html          # 主 HTML 入口
├── vite.config.js      # Vite 配置
├── package.json        # 项目配置
├── src/
│   ├── main.jsx        # React 主入口
│   ├── App.jsx         # 路由主组件
│   ├── index.css       # 全局样式
│   ├── components/
│   │   └── Layout.jsx  # 布局组件
│   ├── pages/
│   │   ├── LoginPage.jsx        # 登录页面
│   │   ├── DashboardPage.jsx    # 仪表板（首页）
│   │   ├── CustomersPage.jsx    # 客户管理
│   │   ├── TasksPage.jsx        # 任务管理
│   │   └── StatsPage.jsx        # 统计报表
│   └── store/
│       └── authStore.js         # 认证状态管理
```

---

## 🚀 构建生产版本

```bash
npm run build
```

生成的文件在 `dist/` 目录中，可以直接部署。

---

## 💡 主要功能

- ✅ **用户认证** - 登录/登出
- ✅ **仪表板** - 实时数据统计和图表
- ✅ **客户管理** - 增删改查客户信息
- ✅ **任务管理** - 创建和管理配送任务
- ✅ **统计报表** - 销量和用水量分析

---

## 🛠️ 环境要求

- Node.js v16+
- npm v8+
- 现代浏览器（Chrome/Edge/Safari）

---

## 📞 需要帮助？

查看完整的开发指南：`../DEVELOPMENT_GUIDE.md`
