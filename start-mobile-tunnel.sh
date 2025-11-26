#!/bin/bash

# 宠物诊所移动端 Tunnel 模式启动脚本
# 使用此脚本可以在 VPN 环境下通过 tunnel 让手机访问

echo "🐕 宠物诊所移动应用启动脚本 (Tunnel 模式)"
echo "============================================"
echo ""
echo "📡 Tunnel 模式特点："
echo "  ✅ 不需要电脑和手机在同一 WiFi"
echo "  ✅ 适合开启 VPN 的情况"
echo "  ✅ 通过 Expo 服务器中转"
echo "  ⚠️  首次启动可能需要登录 Expo 账号"
echo ""

cd petclinic-mobile

# 检查是否已安装依赖
if [ ! -d "node_modules" ]; then
    echo "📦 首次运行，正在安装依赖..."
    npm install
else
    echo "✅ 依赖已安装"
fi

echo ""
echo "🚀 正在启动 Expo Tunnel 模式..."
echo "   (如果提示登录，可以按 Ctrl+C 取消，然后先运行 'npx expo login')"
echo ""

npm run start:tunnel
