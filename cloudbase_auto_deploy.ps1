#!/usr/bin/env powershell
# 腾讯云 CloudBase 自动化部署脚本（设备码扫码授权）

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "腾讯云 CloudBase APK 编译自动化部署" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 第一步：检查/安装 CloudBase CLI
Write-Host "[1/5] 检查 CloudBase CLI..." -ForegroundColor Yellow

try {
    $cliVersion = cloudbase --version 2>&1
    Write-Host "✅ CloudBase CLI 已安装：$cliVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ CloudBase CLI 未安装，正在安装..." -ForegroundColor Red
    npm install -g "@cloudbase/cli"
    Write-Host "✅ CloudBase CLI 安装完成" -ForegroundColor Green
}

# 第二步：设备码扫码登录
Write-Host ""
Write-Host "[2/5] 启动设备码扫码授权..." -ForegroundColor Yellow
Write-Host ""
Write-Host "请按照以下步骤操作：" -ForegroundColor Cyan
Write-Host "1️⃣ 下面会出现一个二维码" -ForegroundColor Gray
Write-Host "2️⃣ 用你的手机（已登录腾讯云账号的设备）打开微信、支付宝等应用" -ForegroundColor Gray
Write-Host "3️⃣ 扫描下面的二维码" -ForegroundColor Gray
Write-Host "4️⃣ 在手机上点击「授权」确认" -ForegroundColor Gray
Write-Host ""

# 启动设备码授权
$authOutput = cloudbase login --device 2>&1

Write-Host $authOutput -ForegroundColor Green

# 第三步：检查环境
Write-Host ""
Write-Host "[3/5] 列出你的 CloudBase 环境..." -ForegroundColor Yellow

$envList = cloudbase env list 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ 获取环境列表成功" -ForegroundColor Green
    Write-Host $envList
} else {
    Write-Host "❌ 获取环境列表失败，可能需要重新授权" -ForegroundColor Red
    Write-Host $envList
    exit 1
}

# 第四步：上传 Flutter 项目到云存储
Write-Host ""
Write-Host "[4/5] 准备上传 Flutter 项目..." -ForegroundColor Yellow

$zipPath = "D:\AI\tongzhuangshuiAPP\flutter_app_final.zip"

if (-not (Test-Path $zipPath)) {
    Write-Host "❌ 未找到 $zipPath" -ForegroundColor Red
    Write-Host "请确保已执行：Compress-Archive -Path flutter_app -DestinationPath flutter_app_final.zip" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ 找到 Flutter 项目压缩包：$zipPath" -ForegroundColor Green
Write-Host "文件大小：$((Get-Item $zipPath).Length / 1MB) MB" -ForegroundColor Gray

# 第五步：显示下一步操作
Write-Host ""
Write-Host "[5/5] 后续操作指南..." -ForegroundColor Yellow
Write-Host ""
Write-Host "现在你已经授权成功！接下来有两个选择：" -ForegroundColor Cyan
Write-Host ""
Write-Host "方案 A: 使用腾讯云 CloudBase 云构建（国内最快）" -ForegroundColor Green
Write-Host "  1. 访问：https://console.cloud.tencent.com/tcb" -ForegroundColor Gray
Write-Host "  2. 选择你的环境（已在上面显示）" -ForegroundColor Gray
Write-Host "  3. 左侧菜单 → 构建与部署 → 云构建" -ForegroundColor Gray
Write-Host "  4. 点击「新建构建」→ 上传 flutter_app_final.zip" -ForegroundColor Gray
Write-Host "  5. 等待 15-25 分钟即可获得 APK" -ForegroundColor Gray
Write-Host ""
Write-Host "方案 B: 本地编译（需要安装 Flutter）" -ForegroundColor Green
Write-Host "  1. 运行：flutter build apk --release" -ForegroundColor Gray
Write-Host "  2. APK 位置：flutter_app/build/app/outputs/flutter-apk/app-release.apk" -ForegroundColor Gray
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ 授权成功！请选择上面的方案 A 或 B 继续" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
