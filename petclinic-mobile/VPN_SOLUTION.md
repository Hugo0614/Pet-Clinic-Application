# 🔧 VPN 环境下的移动端开发解决方案

## 问题描述

在中国大陆开发 React Native/Expo 应用时遇到的常见问题：
- ❌ 不开 VPN：无法访问 `api.expo.dev`，Metro Bundler 无法启动
- ❌ 开 VPN：电脑和手机不在同一网络，无法扫码连接
- 😭 进退两难！

## ✅ 推荐解决方案

### 方案 1：使用 Expo Tunnel 模式（最佳方案）

**原理**: Expo 通过云端服务器中转，绕过局域网限制

#### 使用方法

```bash
# 方法 A: 使用新创建的脚本
./start-mobile-tunnel.sh

# 方法 B: 手动命令
cd petclinic-mobile
npm run start:tunnel
```

#### 首次使用需要登录

如果提示需要 Expo 账号：

```bash
# 1. 注册/登录 Expo 账号
npx expo login

# 2. 输入邮箱和密码（或使用 GitHub 登录）

# 3. 登录成功后重新启动
npm run start:tunnel
```

#### 优点
- ✅ **不需要同一 WiFi**
- ✅ **VPN 可以一直开着**
- ✅ **手机可以在任何网络环境**
- ✅ **扫码即可连接**

#### 缺点
- ⚠️ 首次需要 Expo 账号（免费）
- ⚠️ 速度比 LAN 模式稍慢（但可接受）

---

### 方案 2：分步操作（开关 VPN）

适合不想注册 Expo 账号的情况：

#### 步骤

**Step 1: 开 VPN，安装依赖**
```bash
# 开启 VPN
cd petclinic-mobile
npm install  # 或 yarn install
```

**Step 2: 关 VPN，启动服务器**
```bash
# 关闭 VPN
npm start
# 保持电脑和手机在同一 WiFi
```

**Step 3: 扫码连接**
- 用 Expo Go 扫码
- 首次加载 JavaScript bundle（需要时间）

**Step 4: 后续开发**
- Metro Bundler 会缓存依赖
- 只要不重启，后续修改代码会自动刷新
- 不需要重新访问 `api.expo.dev`

#### 优点
- ✅ 不需要 Expo 账号
- ✅ LAN 模式速度快

#### 缺点
- ⚠️ 每次重启都需要关闭 VPN
- ⚠️ 必须同一 WiFi

---

### 方案 3：使用 Android Studio 模拟器（无需手机）

如果你不想用真机测试，可以使用模拟器：

#### Android 模拟器（推荐）

```bash
# 1. 安装 Android Studio
# 下载：https://developer.android.com/studio

# 2. 在 Android Studio 中创建虚拟设备 (AVD)
#    - 推荐：Pixel 5, Android 13

# 3. 启动模拟器

# 4. 运行项目
cd petclinic-mobile
npm run android
```

**优点**:
- ✅ 不需要真机
- ✅ 不需要关心网络问题
- ✅ 调试方便

**缺点**:
- 占用资源较大
- 需要下载 Android Studio

---

### 方案 4：使用 VS Code 扩展预览

安装移动端预览扩展：

```bash
# 在 VS Code 中安装
code --install-extension msjsdiag.vscode-react-native
code --install-extension expo.vscode-expo-tools
```

**局限性**: 
- ⚠️ 只能预览 UI，无法测试原生功能
- ⚠️ 不如真机/模拟器准确

---

## 🎯 我的推荐顺序

### 如果可以用真机
1. **方案 1（Tunnel 模式）** ⭐⭐⭐⭐⭐
   - 最方便，一劳永逸
   - 注册 Expo 账号只需 1 分钟

2. **方案 2（开关 VPN）** ⭐⭐⭐
   - 不想注册账号的替代方案
   - 速度更快

### 如果没有 iPhone 或不方便
3. **方案 3（Android 模拟器）** ⭐⭐⭐⭐
   - 适合 Linux/Windows 用户
   - 开发体验很好

---

## 📝 关于依赖版本警告

你看到的警告：
```
@react-native-picker/picker@2.11.4 - expected version: 2.7.5
typescript@5.9.3 - expected version: ~5.3.3
```

**是否需要修复？**

**答案**: **暂时不需要** ✅

**原因**:
1. 这是 Expo 的兼容性建议，不是强制要求
2. 当前版本**更新**（2.11.4 > 2.7.5），功能更多
3. TypeScript 5.9.3 向下兼容 5.3.3
4. 应用可以正常运行

**何时需要修复**:
- ❌ 如果遇到奇怪的 bug
- ❌ 如果某些功能无法使用
- ❌ 如果准备发布生产版本

**如何修复**（如果真的需要）:
```bash
npm install @react-native-picker/picker@2.7.5 typescript@~5.3.3 --save-exact
```

---

## 🚀 快速开始（推荐流程）

### 第一次启动

```bash
# 1. 开启 VPN，安装依赖（已完成）
cd petclinic-mobile
npm install

# 2. 使用 Tunnel 模式启动
./start-mobile-tunnel.sh

# 3. 如果提示登录，注册/登录 Expo
npx expo login

# 4. 用 iPhone 上的 Expo Go 扫码
```

### 后续开发

```bash
# 每次都用 Tunnel 模式即可
./start-mobile-tunnel.sh

# VPN 可以一直开着，不影响
```

---

## 💡 其他技巧

### 技巧 1: 离线开发

如果你已经成功连接过一次：
```bash
# Metro Bundler 会缓存 JavaScript bundle
# 后续修改代码会通过 WebSocket 热更新
# 不需要重新访问 Expo API
```

### 技巧 2: 使用手机热点

如果实在不行：
1. 手机开启热点
2. 电脑连接手机热点
3. 关闭 VPN
4. 使用 LAN 模式：`npm start`

### 技巧 3: 配置代理

为 npm 配置代理（高级用户）：
```bash
npm config set proxy http://proxy-server:port
npm config set https-proxy http://proxy-server:port
```

---

## 📞 常见问题

### Q: Tunnel 模式很慢怎么办？
A: 首次加载会慢，后续会快很多。或者使用方案 2（开关 VPN）。

### Q: 提示 "Unable to resolve module"？
A: 清除缓存：
```bash
npx expo start --clear
```

### Q: Expo Go 无法连接？
A: 
1. 确保手机和电脑都能访问互联网
2. 检查防火墙是否阻止
3. 尝试重启 Expo Go app

### Q: 不想用 Expo，想用纯 React Native？
A: 需要 eject，但会失去 Expo 的便利性，不推荐新手这样做。

---

## ✅ 总结

**最佳方案**: 使用 `./start-mobile-tunnel.sh` + Expo Go

这样你可以：
- ✅ VPN 一直开着
- ✅ 随时随地开发
- ✅ 手机在任何网络都能访问
- ✅ 扫码即用，方便快捷

**一句话**: Tunnel 模式就是为你这种情况设计的！🎉
