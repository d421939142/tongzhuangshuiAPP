@echo off
REM Flutter 自动安装脚本（Windows）

echo ========================================
echo Flutter 自动安装脚本
echo ========================================

REM 检查是否已安装
if exist "C:\flutter" (
    echo ✅ Flutter 已存在在 C:\flutter
    goto END
)

echo.
echo 开始下载 Flutter SDK...
echo 这会花 2-5 分钟，取决于你的网速
echo.

REM 创建目录
if not exist "C:\flutter" mkdir C:\flutter
cd C:\flutter

REM 下载 Flutter（国内镜像）
echo 下载 Flutter...
powershell -Command "Invoke-WebRequest -Uri 'https://storage.flutter-io.cn/flutter_infra_release/releases/stable/windows/flutter_windows_3.19.0-stable.zip' -OutFile 'flutter.zip' -TimeoutSec 300"

if %errorlevel% neq 0 (
    echo ❌ 下载失败，请检查网络连接
    pause
    exit /b 1
)

echo.
echo 解压文件...
powershell -Command "Expand-Archive -Path 'flutter.zip' -DestinationPath '.' -Force"

echo.
echo 清理临时文件...
del flutter.zip

echo.
echo 配置环境变量...
REM 添加到 PATH
setx PATH "%PATH%;C:\flutter\bin"

echo.
echo ✅ Flutter 安装完成！
echo.
echo 请重启 PowerShell 或 CMD 后使用，然后执行：
echo   flutter --version
echo.

:END
pause
