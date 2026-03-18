#!/usr/bin/env powershell
# Flutter 快速安装脚本

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Flutter 自动安装脚本" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# 第一步：检查是否已安装
Write-Host ""
Write-Host "[1/4] 检查 Flutter 是否已安装..." -ForegroundColor Yellow

if (Test-Path "C:\flutter\bin\flutter.bat") {
    Write-Host "✅ Flutter 已安装于 C:\flutter" -ForegroundColor Green
    $flutterPath = "C:\flutter"
} else {
    Write-Host "❌ Flutter 未安装，开始下载..." -ForegroundColor Red
    
    # 第二步：下载 Flutter（国内镜像）
    Write-Host ""
    Write-Host "[2/4] 从国内镜像下载 Flutter..." -ForegroundColor Yellow
    
    $downloadUrl = "https://mirrors.aliyun.com/flutter/flutter_windows_3.19.0-stable.zip"
    $zipPath = "C:\flutter_windows.zip"
    
    Write-Host "下载地址: $downloadUrl" -ForegroundColor Gray
    
    try {
        # 使用国内镜像下载（更快）
        Invoke-WebRequest -Uri $downloadUrl -OutFile $zipPath -TimeoutSec 600
        Write-Host "✅ 下载完成" -ForegroundColor Green
    } catch {
        Write-Host "⚠️ 国内镜像下载失败，尝试官方源..." -ForegroundColor Yellow
        $downloadUrl = "https://storage.googleapis.com/flutter_infra_release/releases/stable/windows/flutter_windows_3.19.0-stable.zip"
        try {
            Invoke-WebRequest -Uri $downloadUrl -OutFile $zipPath -TimeoutSec 600
            Write-Host "✅ 从官方源下载完成" -ForegroundColor Green
        } catch {
            Write-Host "❌ 下载失败，请检查网络连接" -ForegroundColor Red
            exit 1
        }
    }
    
    # 第三步：解压
    Write-Host ""
    Write-Host "[3/4] 解压 Flutter..." -ForegroundColor Yellow
    
    if (Test-Path "C:\flutter") {
        Remove-Item -Path "C:\flutter" -Recurse -Force -ErrorAction SilentlyContinue
    }
    
    Expand-Archive -Path $zipPath -DestinationPath "C:\" -Force
    Remove-Item -Path $zipPath -Force
    
    Write-Host "✅ 解压完成" -ForegroundColor Green
    $flutterPath = "C:\flutter"
}

# 第四步：添加到环境变量
Write-Host ""
Write-Host "[4/4] 配置环境变量..." -ForegroundColor Yellow

$flutterBinPath = "$flutterPath\bin"
$dartBinPath = "$flutterPath\bin\cache\dart-sdk\bin"

$currentPath = [Environment]::GetEnvironmentVariable("Path", "Machine")

if ($currentPath -like "*$flutterBinPath*") {
    Write-Host "✅ Flutter 已在 PATH 中" -ForegroundColor Green
} else {
    Write-Host "添加 Flutter 到 PATH..." -ForegroundColor Gray
    [Environment]::SetEnvironmentVariable("Path", "$flutterBinPath;$currentPath", "Machine")
    Write-Host "✅ 环境变量已更新" -ForegroundColor Green
}

# 验证安装
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "验证安装..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

& "$flutterPath\bin\flutter.bat" --version

Write-Host ""
Write-Host "✅ Flutter 安装完成！" -ForegroundColor Green
Write-Host ""
Write-Host "接下来的步骤：" -ForegroundColor Cyan
Write-Host "1. 关闭所有 PowerShell 窗口" -ForegroundColor Gray
Write-Host "2. 重新打开新的 PowerShell" -ForegroundColor Gray
Write-Host "3. 执行: flutter --version" -ForegroundColor Gray
Write-Host ""
