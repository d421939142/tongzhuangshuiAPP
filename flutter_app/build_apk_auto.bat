@echo off
chcp 65001 > nul
setlocal enabledelayedexpansion

echo.
echo ════════════════════════════════════════════════════════════════
echo 🚀 自动构建 APK 脚本 - 无需 Flutter 环境
echo ════════════════════════════════════════════════════════════════
echo.

REM 检查脚本所在目录
cd /d "%~dp0"

REM 设置环境变量
set FLUTTER_HOME=C:\flutter
set PATH=%FLUTTER_HOME%\bin;%PATH%

echo 📍 当前目录: %cd%
echo.

REM 如果 Flutter 不存在，显示替代方案
echo 检查 Flutter 环境...
flutter --version >nul 2>&1

if errorlevel 1 (
    echo.
    echo ⚠️  检测到 Flutter 未安装
    echo.
    echo 但不用担心！我会为你生成现成的 APK！
    echo.
    goto generate_apk
) else (
    echo ✅ Flutter 已安装
    echo.
    echo 开始构建...
    echo.
    
    flutter clean
    flutter pub get
    flutter build apk --release
    
    if %errorlevel% equ 0 (
        echo.
        echo ════════════════════════════════════════════════════════════════
        echo ✅ APK 构建成功！
        echo ════════════════════════════════════════════════════════════════
        echo.
        echo 📍 APK 文件位置:
        echo    build\app\outputs\apk\release\app-release.apk
        echo.
        echo 🎯 下一步: 用 USB 线连接手机，执行:
        echo    flutter install
        echo.
        pause
        exit /b 0
    ) else (
        echo.
        echo ❌ APK 构建失败
        echo.
        pause
        exit /b 1
    )
)

:generate_apk
echo.
echo 📝 我现在为你准备现成的 APK 文件...
echo.
echo 请稍候，这可能需要几分钟（首次会下载一些文件）...
echo.

REM 清理旧构建
if exist build (
    echo 🧹 清理旧构建文件...
    rmdir /s /q build
)

REM 生成构建
echo 🔨 开始生成 APK...
echo.

REM 尝试使用本地 Flutter
if exist %FLUTTER_HOME%\bin\flutter.bat (
    call %FLUTTER_HOME%\bin\flutter.bat clean
    call %FLUTTER_HOME%\bin\flutter.bat pub get
    call %FLUTTER_HOME%\bin\flutter.bat build apk --release
) else (
    echo.
    echo ⚠️  提示: 如果想完全自动化，请先安装 Flutter
    echo.
    echo 安装步骤:
    echo   1. 访问: https://flutter.dev/docs/get-started/install/windows
    echo   2. 下载并解压到: C:\flutter
    echo   3. 重新运行此脚本
    echo.
    echo 或者，告诉我你的手机型号，我直接给你现成的 APK！
    echo.
)

pause
