#!/bin/bash

# 停止宠物诊所移动端和后端服务

echo "🛑 停止宠物诊所服务"
echo "===================="

# 停止后端（端口 8080）
if lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "🔧 停止后端服务..."
    PID=$(lsof -t -i:8080)
    kill $PID 2>/dev/null
    echo "✅ 后端已停止"
else
    echo "ℹ️  后端未运行"
fi

# 停止 tmux 会话
if command -v tmux &> /dev/null; then
    if tmux has-session -t petclinic-backend 2>/dev/null; then
        tmux kill-session -t petclinic-backend
        echo "✅ tmux 会话已停止"
    fi
fi

# 停止 Metro Bundler（端口 8081/8082）
for port in 8081 8082; do
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "📱 停止 Metro Bundler (端口 $port)..."
        PID=$(lsof -t -i:$port)
        kill $PID 2>/dev/null
        echo "✅ Metro Bundler 已停止"
    fi
done

# 清理 PID 文件
if [ -f "backend.pid" ]; then
    rm backend.pid
fi

echo ""
echo "✅ 所有服务已停止"
