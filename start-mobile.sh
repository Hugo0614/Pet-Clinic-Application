#!/bin/bash

# 宠物诊所移动端 + 后端一键启动脚本（多终端版本）

echo "🐕 宠物诊所完整应用启动脚本"
echo "================================"
echo ""

# 加载环境变量
if [ -f ".env" ]; then
    echo "📋 加载环境变量..."
    export $(cat .env | grep -v '^#' | grep -v '^$' | xargs)
    echo "✅ 环境变量已加载"
else
    echo "⚠️  警告：未找到 .env 文件"
fi

echo ""
echo "📱 启动模式："
echo "1) 完整启动（后端 + 移动端）- 推荐，使用新终端窗口"
echo "2) 完整启动（后端 + 移动端）- 使用 tmux 多窗口"
echo "3) 仅启动后端"
echo "4) 仅启动移动端（Expo）"
echo "5) 仅启动移动端（Tunnel 模式）"
echo ""
read -p "请选择 (1-5): " choice

# 检查数据库
check_database() {
    echo "🔍 检查数据库..."
    if systemctl is-active --quiet mysql 2>/dev/null || \
       systemctl is-active --quiet mariadb 2>/dev/null || \
       docker ps 2>/dev/null | grep -q mysql; then
        echo "✅ 数据库正在运行"
        return 0
    else
        echo "❌ MySQL 未运行"
        echo "   启动: systemctl start mysql"
        echo "   或: docker-compose up -d"
        return 1
    fi
}

# 检查 Maven
check_maven() {
    if [ -f "./petclinic-backend/mvnw" ]; then
        MVN_CMD="./mvnw"
        echo "✅ 使用 Maven Wrapper"
    elif command -v mvn &> /dev/null; then
        MVN_CMD="mvn"
        echo "✅ 使用系统 Maven"
    else
        echo "❌ 未找到 Maven"
        return 1
    fi
    return 0
}

# 启动后端（新终端窗口）
start_backend_new_terminal() {
    echo "🔧 在新终端启动后端..."
    
    # 尝试不同的终端模拟器
    if command -v gnome-terminal &> /dev/null; then
        gnome-terminal --title="Pet Clinic Backend" -- bash -c "
            cd '$(pwd)/petclinic-backend'
            export \$(cat '$(pwd)/.env' 2>/dev/null | grep -v '^#' | grep -v '^\$' | xargs)
            echo '================================'
            echo '🚀 Pet Clinic Backend'
            echo '================================'
            echo ''
            $MVN_CMD spring-boot:run
            echo ''
            echo '后端已停止'
            read -p '按 Enter 关闭...'
        " 2>/dev/null &
        echo "✅ 后端终端已打开（gnome-terminal）"
    elif command -v xterm &> /dev/null; then
        xterm -title "Pet Clinic Backend" -e bash -c "
            cd '$(pwd)/petclinic-backend'
            export \$(cat '$(pwd)/.env' 2>/dev/null | grep -v '^#' | grep -v '^\$' | xargs)
            echo '🚀 Pet Clinic Backend'
            $MVN_CMD spring-boot:run
            read -p '按 Enter 关闭...'
        " &
        echo "✅ 后端终端已打开（xterm）"
    elif command -v konsole &> /dev/null; then
        konsole --new-tab -e bash -c "
            cd '$(pwd)/petclinic-backend'
            export \$(cat '$(pwd)/.env' 2>/dev/null | grep -v '^#' | grep -v '^\$' | xargs)
            $MVN_CMD spring-boot:run
            read -p '按 Enter 关闭...'
        " &
        echo "✅ 后端终端已打开（konsole）"
    else
        echo "❌ 未找到终端模拟器（gnome-terminal/xterm/konsole）"
        echo "   请安装: sudo apt install gnome-terminal"
        return 1
    fi
    return 0
}

# 启动后端（tmux）
start_backend_tmux() {
    echo "🔧 在 tmux 启动后端..."
    if ! command -v tmux &> /dev/null; then
        echo "❌ 未安装 tmux"
        return 1
    fi
    
    tmux new-session -d -s petclinic-backend "
        cd '$(pwd)/petclinic-backend'
        export \$(cat '$(pwd)/.env' 2>/dev/null | grep -v '^#' | grep -v '^\$' | xargs)
        $MVN_CMD spring-boot:run
    " 2>/dev/null
    
    if [ $? -eq 0 ]; then
        echo "✅ 后端已在 tmux 会话中启动"
        echo "   查看: tmux attach -t petclinic-backend"
        echo "   退出: Ctrl+B 然后按 D"
        return 0
    else
        echo "⚠️  tmux 会话可能已存在"
        echo "   停止旧会话: tmux kill-session -t petclinic-backend"
        return 1
    fi
}

# 启动后端（当前终端）
start_backend_current() {
    echo "🔧 启动后端（当前终端）..."
    cd petclinic-backend
    $MVN_CMD spring-boot:run
}

# 等待后端
wait_backend() {
    echo ""
    echo "⏳ 等待后端启动（最多 60 秒）..."
    for i in {1..30}; do
        if lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null 2>&1; then
            echo "✅ 后端已启动！"
            sleep 3
            return 0
        fi
        echo -n "."
        sleep 2
    done
    echo ""
    echo "⚠️  后端启动超时，继续启动移动端"
    return 1
}

# 启动移动端
start_mobile() {
    local mode=$1
    echo ""
    echo "📱 启动移动端..."
    cd petclinic-mobile
    
    if [ ! -d "node_modules" ]; then
        echo "📦 安装依赖..."
        npm install --legacy-peer-deps
    fi
    
    echo ""
    if [ "$mode" = "tunnel" ]; then
        echo "🚀 启动 Expo Tunnel 模式..."
        npm run start:tunnel
    else
        echo "🚀 启动 Expo..."
        npm start
    fi
}

# 主逻辑
case $choice in
    1)
        if ! check_database; then exit 1; fi
        if ! check_maven; then exit 1; fi
        if ! start_backend_new_terminal; then exit 1; fi
        wait_backend
        start_mobile "normal"
        ;;
    2)
        if ! check_database; then exit 1; fi
        if ! check_maven; then exit 1; fi
        if ! start_backend_tmux; then exit 1; fi
        wait_backend
        start_mobile "normal"
        ;;
    3)
        if ! check_database; then exit 1; fi
        if ! check_maven; then exit 1; fi
        start_backend_current
        ;;
    4)
        start_mobile "normal"
        ;;
    5)
        start_mobile "tunnel"
        ;;
    *)
        echo "❌ 无效选择"
        exit 1
        ;;
esac

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ 完成！"
if [ "$choice" -le 2 ]; then
    echo ""
    echo "📌 后端: http://localhost:8080"
    echo "📌 移动端: 扫描二维码"
    echo ""
    echo "停止服务:"
    echo "- 移动端: Ctrl+C"
    if [ "$choice" = "2" ]; then
        echo "- 后端: tmux kill-session -t petclinic-backend"
    else
        echo "- 后端: 关闭后端窗口"
    fi
fi
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
