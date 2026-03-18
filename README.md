# 桶装水APP - 微信小程序

## 项目简介

基于微信云开发（CloudBase）的桶装水配送小程序，支持用户端下单和商家管理后台。

## 功能清单

### 用户端
- ✅ 首页：商品展示、快速入口、一键续购、购物车悬浮按钮
- ✅ 商品列表：分类筛选、搜索、加入购物车
- ✅ 下单：选择地址、配送时间、备注、提交订单
- ✅ 收货地址：增删改、设为默认
- ✅ 历史订单：状态筛选（待接单/配送中/已完成）、取消订单、一键续购
- ✅ 订单详情：配送信息、商品清单、操作按钮
- ✅ 个人中心：用户信息、订单统计、快捷功能入口

### 管理员后台（商家）
- ✅ 管理首页：今日营收、订单统计、快捷入口
- ✅ 订单管理：接单/拒绝、开始配送、确认送达
- ✅ 商品管理：添加/编辑商品、上下架
- ✅ 管理员权限：基于 `admins` 集合控制

## 云函数

| 函数名 | 功能 |
|-------|------|
| `getUserInfo` | 获取用户openid、管理员身份 |
| `createOrder` | 创建订单（含订单号生成） |
| `updateOrderStatus` | 更新订单状态（含权限+流转校验） |
| `getAdminStats` | 获取今日营收/订单统计 |
| `setDefaultAddress` | 设置默认收货地址 |

## 数据库集合

| 集合名 | 说明 |
|-------|------|
| `goods` | 商品信息：name, price, spec, category, imageUrl, status, sortOrder |
| `orders` | 订单：orderNo, items, address, status, totalAmount, deliveryTime |
| `addresses` | 收货地址：name, phone, province, city, district, detail, isDefault |
| `admins` | 管理员表：openid（手动添加管理员openid） |

## 快速开始

### 1. 在腾讯云创建CloudBase环境
前往 [CloudBase控制台](https://tcb.cloud.tencent.com/) 创建环境，记录环境ID。

### 2. 配置环境ID
打开 `miniprogram/app.js`，将 `your-env-id` 替换为你的实际环境ID：
```js
envId: 'your-env-id'
```

### 3. 用微信开发者工具打开项目
- 打开微信开发者工具
- 导入项目，选择本目录（包含 `project.config.json`）
- 如有AppID，填入真实AppID；否则使用测试号

### 4. 部署云函数
在微信开发者工具中，右键每个云函数目录 → "上传并部署（云端安装依赖）"

### 5. 添加管理员
在CloudBase控制台，手动向 `admins` 集合添加一条记录：
```json
{ "openid": "你的微信openid" }
```
（openid可通过调用 `getUserInfo` 云函数获取）

### 6. 添加商品
通过管理员后台 → 商品管理 → 添加商品

## 技术栈

- 微信小程序原生框架
- 腾讯云 CloudBase（云开发）
- wx-server-sdk 2.6.3

## 设计风格

Organic/Natural 水感主题：
- 主色 `#0EA5E9`（天空蓝）
- 深色 `#0C4A6E`（深海蓝）
- 背景 `#F0F9FF`（极浅蓝白）
- CTA `#F59E0B`（琥珀黄）
