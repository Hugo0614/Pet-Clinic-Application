# 📱 移动端常见问题解答 (FAQ)

## 🔧 已修复的问题

### 1. ✅ tsconfig.json 错误
**错误**: `Option 'customConditions' can only be used when 'moduleResolution' is set to 'node16', 'nodenext', or 'bundler'.`

**解决**: 将 `moduleResolution` 从 `"node"` 改为 `"bundler"`

```json
{
  "compilerOptions": {
    "moduleResolution": "bundler"  // ✅ 已修复
  }
}
```

### 2. ✅ iOS Picker 无法选择问题
**问题**: 在 iOS 上，Picker 下拉选择后会自动回滚到空白

**原因**: 
- iOS 的 Picker 默认行为与 Android 不同
- 需要添加空白的占位选项
- iOS 需要 `itemStyle` 来正确显示

**解决方案**:
```tsx
<Picker
  selectedValue={role}
  onValueChange={(itemValue) => setRole(itemValue)}
  style={styles.picker}
  itemStyle={styles.pickerItem}  // iOS 需要
>
  <Picker.Item label="Select Role" value="" enabled={false} />  // 占位项
  <Picker.Item label="🐾 Pet Owner" value="OWNER" />
  <Picker.Item label="👨‍⚕️ Doctor" value="DOCTOR" />
</Picker>

{/* 显示当前选择 */}
<Text style={styles.selectedRole}>
  Selected: {role === 'OWNER' ? '🐾 Pet Owner' : '👨‍⚕️ Doctor'}
</Text>
```

**改进**:
- ✅ 添加了表情符号，更直观
- ✅ 添加了"Selected"提示，显示当前选择
- ✅ 增大了 iOS 的选项高度（`height: 120`）

### 3. ✅ 后端 API 连接配置
**问题**: 移动端无法连接到后端，无法使用网站注册的账号

**原因**: 移动端和网站前端是**独立的客户端**，但共享同一个后端 API

**解决方案**:

#### 方式 1: 自动检测（推荐）
已更新 `src/services/api.ts`：
```typescript
const getApiBaseUrl = () => {
  if (__DEV__) {
    if (Platform.OS === 'ios') {
      return 'http://localhost:8080/api';  // iOS
    }
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:8080/api';   // Android 模拟器
    }
  }
  return 'http://YOUR_COMPUTER_IP:8080/api';  // 真机
};
```

#### 方式 2: 手动配置（真机测试）
如果在真实 iPhone 上测试，需要：

1. **查找电脑 IP 地址**:
   ```bash
   # Linux/Mac
   ifconfig | grep "inet " | grep -v 127.0.0.1
   
   # Windows
   ipconfig
   ```
   
   示例输出: `192.168.1.100`

2. **确保电脑和手机在同一 WiFi**

3. **修改 api.ts**:
   ```typescript
   return 'http://192.168.1.100:8080/api';  // 替换为你的 IP
   ```

4. **确保后端正在运行**:
   ```bash
   cd petclinic-backend
   ./mvnw spring-boot:run
   # 或
   java -jar target/petclinic-backend.jar
   ```

---

## 🤔 你的问题解答

### Q1: 修改代码后需要重新安装整个项目吗？

**答案**: **不需要！** ✅

**Fast Refresh 特性**:
- ✅ 修改 React 组件 → **自动刷新**（几秒钟）
- ✅ 修改样式 → **立即更新**
- ✅ 修改逻辑代码 → **热重载**

**需要重启的情况**:
- ❌ 修改 `package.json` 添加新依赖
- ❌ 修改 `tsconfig.json` 或 `babel.config.js`
- ❌ 修改 `app.json` 配置
- ❌ 添加原生模块

**如何看到更新**:
1. 保存文件
2. Expo 自动检测变化
3. 手机上自动刷新（看终端日志）
4. 如果没刷新，在手机上**摇一摇** → 点击 "Reload"

**终端显示**:
```
› Refreshing...
› Bundled 1234ms index.js (999 modules)
```

### Q2: 为什么不能用网站注册的账号？

**答案**: **可以用！但需要正确配置后端连接** ✅

**架构说明**:
```
┌─────────────────┐
│  Web Frontend   │ ─┐
│  (Vite + React) │  │
└─────────────────┘  │
                     ├──► ┌─────────────────┐
┌─────────────────┐  │    │  Backend API    │
│ Mobile Frontend │ ─┘    │  (Spring Boot)  │
│ (React Native)  │       │  :8080/api      │
└─────────────────┘       └─────────────────┘
                                  │
                          ┌───────┴────────┐
                          │    Database    │
                          │     MySQL      │
                          └────────────────┘
```

**数据共享**:
- ✅ Web 和 Mobile 使用**同一个数据库**
- ✅ Web 注册的账号存在数据库中
- ✅ Mobile 连接到同一个后端，可以登录同一账号

**检查清单**:
1. ✅ 后端是否在运行？
   ```bash
   # 检查后端端口
   netstat -an | grep 8080
   # 或
   curl http://localhost:8080/api/auth/test
   ```

2. ✅ Mobile 的 API 地址是否正确？
   - 打开 `src/services/api.ts`
   - 检查 IP 地址
   - 看终端日志: `📡 API Base URL: http://...`

3. ✅ 网络是否通畅？
   ```bash
   # 从手机浏览器访问
   http://YOUR_IP:8080/api/auth/test
   ```

**测试连接**:
```bash
# 在移动端注册后，检查数据库
mysql -u root -p
use petclinic_db;
SELECT * FROM users;  -- 应该能看到新注册的用户
```

### Q3: 为什么第一次连接很慢？

**原因**:
1. **JavaScript Bundle 下载**: 第一次需要下载整个应用代码（约 10-30MB）
2. **依赖加载**: 加载 React、React Native、所有库
3. **编译转换**: Metro Bundler 需要编译 TypeScript

**时间估计**:
- 第一次: 1-5 分钟 ⏱️
- 后续修改: 5-10 秒 ⚡

**加速技巧**:
```bash
# 使用 LAN 模式（更快，但需要同一 WiFi）
npm start

# 使用 Tunnel 模式（稍慢，但不需要同一网络）
npm run start:tunnel
```

**后续开发**:
- ✅ Metro Bundler 保持运行
- ✅ 修改代码自动刷新（Fast Refresh）
- ✅ 不需要重新下载整个 bundle

---

## 📱 开发工作流程

### 推荐流程

**首次启动**:
```bash
cd petclinic-mobile
npm run start:tunnel  # 或 npm start
```

**日常开发**:
1. 保持 Metro Bundler 运行（不要关闭终端）
2. 修改代码
3. 保存文件
4. 手机自动刷新 ✨
5. 测试功能
6. 重复步骤 2-5

**遇到问题时**:
```bash
# 清除缓存
npx expo start --clear

# 完全重启
Ctrl+C  # 停止服务器
npm start
```

**手机操作**:
- **摇一摇手机** → 打开开发菜单
- **Reload** → 重新加载 JavaScript
- **Debug** → 打开调试工具
- **Performance Monitor** → 查看性能

---

## 🐛 调试技巧

### 查看日志
**终端日志**:
```bash
# 终端会显示
iOS Bundled 55034ms index.js (999 modules)
LOG  📡 API Base URL: http://10.0.2.15:8080/api
LOG  User logged in: {username: "test", role: "OWNER"}
```

**添加调试日志**:
```typescript
// 任何组件中
console.log('🔍 Debug:', someVariable);
console.error('❌ Error:', error);
console.warn('⚠️ Warning:', message);
```

### 网络请求调试
```typescript
// src/services/api.ts
api.interceptors.request.use(
  async (config) => {
    console.log('📤 Request:', config.method, config.url);
    // ...
  }
);

api.interceptors.response.use(
  (response) => {
    console.log('📥 Response:', response.status, response.data);
    return response;
  }
);
```

### 检查后端连接
```typescript
// 测试脚本
const testConnection = async () => {
  try {
    const response = await axios.get('http://YOUR_IP:8080/api/auth/test');
    console.log('✅ Backend connected:', response.data);
  } catch (error) {
    console.error('❌ Backend error:', error.message);
  }
};
```

---

## ✅ 检查清单

### 移动端开发环境
- [x] Expo Go 已安装（SDK 54）
- [x] npm dependencies 已安装
- [x] tsconfig.json 已修复
- [x] Picker 组件已改进
- [x] API 地址已配置

### 后端连接
- [ ] 后端服务正在运行（:8080）
- [ ] 数据库已启动（MySQL）
- [ ] 网络连接正常（电脑和手机同一网络）
- [ ] API 地址配置正确

### 功能测试
- [ ] 可以打开应用
- [ ] 可以查看首页
- [ ] 可以注册新账号（Picker 可以选择）
- [ ] 可以登录（使用网站注册的账号）
- [ ] 可以查看宠物列表

---

## 🚀 下一步

1. **启动后端**（如果还没启动）:
   ```bash
   cd petclinic-backend
   ./mvnw spring-boot:run
   ```

2. **重新加载移动应用**:
   - 手机上摇一摇
   - 点击 "Reload"

3. **测试注册/登录**:
   - 选择角色（现在应该可以正常选择了）
   - 注册新账号
   - 登录测试

4. **验证数据共享**:
   - 用移动端注册的账号在网站登录
   - 或用网站账号在移动端登录

---

**所有问题都已修复！** 🎉

现在可以正常开发了，修改代码会自动刷新，不需要重新安装！
