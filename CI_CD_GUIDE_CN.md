# CI/CD Pipeline 使用指南和工作原理详解

## 📋 目录
1. [快速开始](#快速开始)
2. [工作流程概述](#工作流程概述)
3. [详细配置解读](#详细配置解读)
4. [工作原理深度分析](#工作原理深度分析)
5. [YAML 编写规则和最佳实践](#yaml-编写规则和最佳实践)
6. [故障排查](#故障排查)

---

## 快速开始

### 第一步：推送代码到 main 分支

```bash
cd /home/hugo/projects/TEST/pet-clinic-project
git add .
git commit -m "Add GitHub Actions CI/CD workflow"
git push origin main
```

一旦代码被推送到 `main` 分支，GitHub Actions 会自动检测到 `.github/workflows/ci-build.yml` 文件，并触发工作流程。

### 第二步：查看工作流程执行结果

1. 打开你的 GitHub 仓库页面
2. 点击 **"Actions"** 选项卡
3. 你会看到最新的工作流程执行记录
4. 点击具体的 workflow run 来查看详细的构建日志

### 第三步：检查构建状态

- ✅ **绿色对勾**：构建成功
- ❌ **红色叉号**：构建失败，点击查看错误日志

---

## 工作流程概述

### 触发条件（Trigger）

```yaml
on:
  push:
    branches:
      - main
```

**含义：** 当代码被推送到 `main` 分支时，自动触发工作流程。

**为什么这样设计：**
- 确保每次代码合并到主分支时都会进行自动化测试和构建
- 防止有问题的代码被部署到生产环境

---

## 详细配置解读

### 完整的 `ci-build.yml` 文件结构

```
├─ name: CI Build                                    # 工作流程名称
├─ on: push to main                                 # 触发条件
├─ jobs:                                            # 定义所有的工作
│  ├─ build-backend:                               # 后端构建任务
│  │  ├─ runs-on: ubuntu-latest                    # 运行环境
│  │  └─ steps:                                    # 执行步骤
│  │     ├─ Checkout code                          # 步骤1：检出代码
│  │     ├─ Set up JDK 21                          # 步骤2：安装Java环境
│  │     ├─ Cache Maven dependencies                # 步骤3：缓存依赖
│  │     └─ Build backend with Maven               # 步骤4：执行构建
│  │
│  └─ build-frontend:                              # 前端构建任务
│     ├─ runs-on: ubuntu-latest                    # 运行环境
│     └─ steps:                                    # 执行步骤
│        ├─ Checkout code                          # 步骤1：检出代码
│        ├─ Set up Node.js 20.x                    # 步骤2：安装Node.js
│        ├─ Cache NPM dependencies                  # 步骤3：缓存依赖
│        ├─ Install dependencies                   # 步骤4：安装npm包
│        └─ Build frontend                         # 步骤5：执行构建
```

### 后端构建任务详解（build-backend）

#### 1. **检出代码**
```yaml
- name: Checkout code
  uses: actions/checkout@v4
```
- **作用**：从 GitHub 仓库克隆最新代码到 CI/CD 环境
- **为什么必须**：GitHub Actions 需要获取你的源代码才能进行构建

#### 2. **设置 Java 环境**
```yaml
- name: Set up JDK 21
  uses: actions/setup-java@v4
  with:
    java-version: '21'
    distribution: 'temurin'
```
- **作用**：在 Ubuntu 虚拟机上安装 Java 21 SDK
- **参数说明**：
  - `java-version: '21'` - 指定 Java 版本为 21（与项目 pom.xml 一致）
  - `distribution: 'temurin'` - 使用 Eclipse Temurin 作为 JDK 发行版
- **为什么这样选择**：pet-clinic-backend 的 pom.xml 要求 Java 21，Temurin 是稳定的开源 JDK 发行版

#### 3. **缓存 Maven 依赖**
```yaml
- name: Cache Maven dependencies
  uses: actions/cache@v4
  with:
    path: ~/.m2/repository
    key: ${{ runner.os }}-maven-${{ hashFiles('**/pom.xml') }}
    restore-keys: |
      ${{ runner.os }}-maven-
```
- **作用**：将 Maven 下载的依赖缓存在 GitHub Actions 的缓存存储中
- **参数详解**：
  - `path: ~/.m2/repository` - Maven 依赖的本地存储位置
  - `key` - 缓存的唯一标识符（基于操作系统和 pom.xml 内容哈希）
  - 如果 pom.xml 没有改变，会复用上次的缓存，大大加快构建速度
- **性能提升**：
  - 首次构建：下载所有依赖（约 5-10 分钟）
  - 后续构建：使用缓存的依赖（约 1-2 分钟）

#### 4. **执行 Maven 构建**
```yaml
- name: Build backend with Maven
  run: mvn -B package --file petclinic-backend/pom.xml
```
- **命令说明**：
  - `mvn` - Maven 命令
  - `-B` - Batch mode（批处理模式，不显示交互式提示）
  - `package` - Maven 生命周期阶段，包括编译、测试、打包
  - `--file petclinic-backend/pom.xml` - 指定 pom.xml 文件位置
- **执行过程**：
  1. 编译 Java 源代码
  2. 运行单元测试
  3. 生成 JAR 包
  4. 保存到 `petclinic-backend/target/` 目录

### 前端构建任务详解（build-frontend）

#### 1. **检出代码**
```yaml
- name: Checkout code
  uses: actions/checkout@v4
```
- 同后端，获取最新的源代码

#### 2. **设置 Node.js 环境**
```yaml
- name: Set up Node.js 20.x
  uses: actions/setup-node@v4
  with:
    node-version: '20.x'
```
- **作用**：安装 Node.js 20.x 运行环境和 npm
- **为什么选择 20.x**：
  - 与 package.json 兼容性最好
  - 是 LTS（长期支持）版本，稳定可靠

#### 3. **缓存 NPM 依赖**
```yaml
- name: Cache NPM dependencies
  uses: actions/cache@v4
  with:
    path: petclinic-frontend/node_modules
    key: ${{ runner.os }}-npm-${{ hashFiles('petclinic-frontend/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-npm-
```
- **作用**：缓存 node_modules 目录，避免重复下载
- **缓存 key**：基于 package-lock.json 的哈希值
- **优势**：npm 包很多时缓存效果显著

#### 4. **安装依赖**
```yaml
- name: Install dependencies
  run: npm install
  working-directory: petclinic-frontend
```
- **`working-directory`**：指定在 petclinic-frontend 目录下执行命令
- **作用**：安装 package.json 中定义的所有依赖包

#### 5. **构建前端应用**
```yaml
- name: Build frontend
  run: npm run build
  working-directory: petclinic-frontend
```
- **作用**：执行 package.json 中定义的 build 脚本
- **构建过程**：
  - Vite 打包源代码
  - 生成优化后的生产资源
  - 输出到 `dist/` 目录

---

## 工作原理深度分析

### 执行流程时间线

```
┌─────────────────────────────────────────────────────────────┐
│                       用户推送代码到 main 分支                  │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────────┐
│        GitHub Actions 检测到 push 事件和 ci-build.yml          │
└──────────────────────┬──────────────────────────────────────┘
                       │
         ┌─────────────┴─────────────┐
         │                           │
         ▼                           ▼
┌──────────────────────┐   ┌──────────────────────┐
│  后端构建任务开始      │   │  前端构建任务开始      │
│  build-backend      │   │  build-frontend     │
└──────┬───────────────┘   └──────┬───────────────┘
       │ 并行执行                  │ 并行执行
       │                          │
       ▼                          ▼
┌──────────────────────┐   ┌──────────────────────┐
│ 1. 检出代码           │   │ 1. 检出代码           │
│ 2. 安装 JDK 21       │   │ 2. 安装 Node.js 20   │
│ 3. 缓存/恢复依赖      │   │ 3. 缓存/恢复依赖      │
│ 4. 编译测试打包       │   │ 4. 安装 npm 包       │
│    (mvn package)    │   │ 5. 构建前端          │
│                     │   │    (vite build)     │
└──────┬───────────────┘   └──────┬───────────────┘
       │                          │
       ▼                          ▼
  ✅ 生成 JAR           ✅ 生成 dist/
       │                          │
       └─────────────┬────────────┘
                     │
                     ▼
        ✅ 工作流程完成（全部成功）
           或
        ❌ 工作流程失败（任一任务失败）
```

### 关键特性：并行执行（Parallel Execution）

**后端和前端任务同时运行：**
- 后端可能需要 3-5 分钟
- 前端可能需要 2-3 分钟
- **总耗时** = 较长的那个任务（约 5 分钟）
- 而不是 3 + 2 = 5 分钟的串行执行

这大大提高了 CI/CD 的效率！

---

## YAML 编写规则和最佳实践

### 1. **YAML 基本语法规则**

#### ✅ 正确示例
```yaml
name: CI Build                    # 键值对用冒号分隔
on:                               # 键名后跟冒号
  push:                           # 嵌套使用缩进（2或4个空格）
    branches:                     # 保持一致的缩进
      - main                      # 列表项用 - 开头
```

#### ❌ 错误示例
```yaml
name: CI Build
on:                               # ❌ 缩进不一致
 push:                            # ❌ 混用不同数量的空格
    branches:                     # ❌ 更多不规范的缩进
      - main
```

### 2. **jobs 的设计原则**

```yaml
jobs:
  build-backend:                  # 任务ID（唯一标识）
    runs-on: ubuntu-latest        # 运行环境
    steps:                        # 步骤列表
      - name: Step description    # 步骤名称（可选但推荐）
        uses: action@version      # GitHub Action 引用
        # 或
        run: command              # 直接运行命令
```

**设计原则：**
- 每个 job 应该有清晰的职责（后端、前端、测试等）
- 使用 `runs-on: ubuntu-latest` 确保兼容性
- 使用有意义的 job ID 和 step names

### 3. **缓存策略**

```yaml
- uses: actions/cache@v4
  with:
    path: ~/.m2/repository                    # 缓存路径
    key: ${{ runner.os }}-maven-${{ hashFiles('**/pom.xml') }}
    restore-keys: |                           # 回退键（顺序重要）
      ${{ runner.os }}-maven-
```

**缓存键匹配逻辑：**
1. 首先尝试完全匹配 `key`
2. 如果没有，按顺序尝试 `restore-keys`
3. 如果都没有匹配，创建新缓存

**最佳实践：**
- 使用 `hashFiles()` 根据文件内容生成 hash
- 当依赖配置文件（pom.xml、package.json）改变时，自动创建新缓存
- 提供多个 restore-keys 作为备选方案

### 4. **环境变量和上下文**

```yaml
key: ${{ runner.os }}-maven-${{ hashFiles('**/pom.xml') }}
     ↓                      ↓
   上下文变量           内置函数
```

**常用的上下文变量：**
- `${{ runner.os }}` - 操作系统（Linux、Windows、macOS）
- `${{ github.ref }}` - Git 分支引用
- `${{ github.sha }}` - 提交的 SHA 哈希值

**常用的内置函数：**
- `hashFiles('path')` - 计算文件内容的 hash
- `contains(string, substring)` - 字符串包含判断

### 5. **Action 版本选择**

```yaml
uses: actions/checkout@v4          # ✅ 推荐：明确指定主版本
uses: actions/checkout@main        # ❌ 不推荐：可能变动
uses: actions/checkout@v4.0.0      # ⚠️ 可选：锁定具体版本
```

**建议：**
- 使用 `@v4` 这样的主版本号
- 这样能获得向后兼容的补丁更新
- 避免不兼容的重大版本变更导致的问题

### 6. **错误处理和条件**

```yaml
- name: Build
  run: mvn -B package
  if: success()                     # 仅在前置步骤成功时执行
  continue-on-error: false          # 此步骤失败时停止工作流

- name: Upload artifacts
  if: always()                      # 无论成功失败都执行
```

**常用条件：**
- `if: success()` - 前置步骤都成功
- `if: failure()` - 前置步骤有失败
- `if: always()` - 总是执行
- `if: contains(github.ref, 'main')` - 条件判断

---

## 故障排查

### 问题1：Maven 构建失败 ❌

**症状：** `BUILD FAILURE` 错误

**检查步骤：**
```bash
# 1. 在本地尝试构建
cd petclinic-backend
mvn -B package

# 2. 查看详细错误日志
mvn -X -B package    # -X 开启调试模式

# 3. 清除本地缓存后重试
mvn clean package
```

**常见原因：**
- Java 版本不匹配（检查 pom.xml 中的 `<java.version>`)
- 依赖无法下载（网络问题或仓库配置）
- 测试失败（运行 `mvn test` 查看具体失败）

### 问题2：NPM 安装失败 ❌

**症状：** `npm ERR!` 错误

**检查步骤：**
```bash
# 1. 在本地尝试安装
cd petclinic-frontend
npm install

# 2. 清除缓存
npm cache clean --force
npm install

# 3. 检查 Node 版本
node --version
npm --version
```

**常见原因：**
- Node.js 版本不兼容
- package-lock.json 损坏
- 依赖版本冲突

### 问题3：缓存命中率低 🔄

**症状：** 每次构建都很慢

**解决方案：**
```yaml
# 检查缓存键的生成
key: ${{ runner.os }}-maven-${{ hashFiles('**/pom.xml') }}

# 确保 pom.xml 路径正确
# 确保 hashFiles() 能找到文件
```

**优化建议：**
- 验证 `hashFiles()` 能匹配到正确的配置文件
- 检查 GitHub Actions 的 Caches 选项卡看缓存大小
- 如果缓存过大（>5GB），可能被自动清除

### 问题4：工作流程没有触发 ⏸️

**症状：** 推送代码后，Actions 标签页没有新的运行

**检查步骤：**
```bash
# 1. 确认文件在正确位置
ls -la .github/workflows/ci-build.yml

# 2. 检查 YAML 语法
# 在线工具：https://www.yamllint.com/

# 3. 确认触发条件
# ci-build.yml 中的 branches: [main] 与当前分支一致

# 4. 检查推送是否成功
git log --oneline -5    # 查看最近的提交
```

**常见原因：**
- YAML 文件语法错误（Actions 会直接忽略）
- 推送的分支不是 main
- 文件没有正确提交到 GitHub

---

## 监控和优化建议

### 📊 性能监控

在 GitHub 仓库的 "Actions" 标签页，你可以：
1. 查看每个工作流程的执行时间
2. 查看哪个步骤耗时最长
3. 查看缓存的命中率

### ⚡ 优化技巧

```yaml
# 1. 并行执行相关任务
jobs:
  backend:
    runs-on: ubuntu-latest
  frontend:
    runs-on: ubuntu-latest
  # 这两个任务会同时运行

# 2. 使用更小的容器镜像
runs-on: ubuntu-latest    # ✅ 标准 Ubuntu
runs-on: ubuntu-22.04     # ✅ 指定具体版本可能更快

# 3. 只在必要时才运行
if: contains(github.event.head_commit.message, '[ci]')

# 4. 使用矩阵策略测试多个配置
strategy:
  matrix:
    java-version: [17, 21]
```

---

## 总结

### ✅ 这个 ci-build.yml 为什么能完成 CI/CD 任务？

1. **自动化：** 无需手动运行构建，每次 push 自动执行
2. **并行性：** 后端和前端同时构建，提高效率
3. **依赖缓存：** 加快构建速度，降低外网依赖
4. **标准化：** 所有环境使用相同的配置，避免"我的机器上可以"问题
5. **可见性：** GitHub Actions 界面清晰展示构建过程和结果
6. **可靠性：** 构建失败时自动通知，及时发现问题

### 🎯 下一步行动

1. 推送这个文件到 GitHub
2. 进入 Actions 标签页观察构建过程
3. 根据构建结果优化配置
4. 考虑添加测试、部署等更多 steps
