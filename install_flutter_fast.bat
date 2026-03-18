@echo off
REM Flutter 快速安装脚本（Windows 批处理）

setlocal enabledelayedexpansion

echo.
echo ========================================
echo Flutter 快速安装（国内镜像）
echo ========================================
echo.

REM 第一步：检查 C:\flutter
if exist "C:\flutter" (
    echo ✓ Flutter 已存在
    goto :check_version
)

REM 第二步：下载
echo [1/3] 下载 Flutter...
echo 源：阿里云镜像（国内最快）
cd %TEMP%
powershell -Command "& {[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; (New-Object System.Net.WebClient).DownloadFile('https://mirrors.aliyun.com/flutter/flutter_windows_3.19.0-stable.zip', 'flutter.zip'); Write-Host 'Done'}"

if errorlevel 1 (
    echo ✗ 下载失败，尝试官方源...
    powershell -Command "& {[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; (New-Object System.Net.WebClient).DownloadFile('https://storage.googleapis.com/flutter_infra_release/releases/stable/windows/flutter_windows_3.19.0-stable.zip', 'flutter.zip'); Write-Host 'Done'}"
)

if not exist "flutter.zip" (
    echo ✗ 下载失败
    exit /b 1
)

echo ✓ 下载完成

REM 第三步：解压
echo [2/3] 解压到 C:\flutter...
powershell -Command "Expand-Archive -Path '!CD!\flutter.zip' -DestinationPath 'C:\' -Force"
del flutter.zip
echo ✓ 解压完成

REM 第四步：添加 PATH
echo [3/3] 配置环境变量...
setx PATH "C:\flutter\bin;%PATH%"
echo ✓ 环境变量已配置

:check_version
echo.
echo ========================================
echo 重启 PowerShell/CMD 后测试：
echo flutter --version
echo ========================================
echo.
pause
