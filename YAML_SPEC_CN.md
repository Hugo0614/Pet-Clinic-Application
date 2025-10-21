# GitHub Actions YAML 编写规范和要求

## 📚 目录

1. [YAML 基础语法](#yaml-基础语法)
2. [GitHub Actions 特定规则](#github-actions-特定规则)
3. [ci-build.yml 完整规范解析](#ci-buildyml-完整规范解析)
4. [常见错误和修复](#常见错误和修复)
5. [最佳实践](#最佳实践)

---

## YAML 基础语法

### 1. 键值对（Key-Value Pairs）

```yaml
# 基本格式：键: 值
name: CI Build
timeout-minutes: 30
```

**规则：**
- ✅ 冒号后必须跟空格：`key: value`
- ❌ 错误：`key:value` 或 `key :value`

### 2. 缩进和嵌套（Indentation）

```yaml
# 嵌套关系用缩进表示
jobs:                    # 第一级
  build-backend:         # 第二级（缩进 2 个空格）
    runs-on: ubuntu-latest  # 第三级（缩进 4 个空格）
```

**规则：**
- ✅ 使用空格缩进（2 个或 4 个）
- ❌ 不能使用 Tab 字符（会导致解析错误）
- ❌ 缩进必须一致（混用会出错）

### 3. 列表（Lists）

```yaml
# 列表用 - 开头
branches:
  - main              # 列表项 1
  - develop           # 列表项 2
  - staging           # 列表项 3

# 也可以在同一行
colors: [red, green, blue]
```

**规则：**
- 列表项用 `-` 开头，后跟空格
- 列表项必须在同一缩进级别

### 4. 字符串（Strings）

```yaml
# 简单字符串
name: CI Build

# 引号字符串（特殊字符需要）
message: "Build: ${{ github.sha }}"
path: "C:\\Users\\Documents"

# 多行字符串（保留换行）
script: |
  echo "Line 1"
  echo "Line 2"
  echo "Line 3"

# 多行字符串（去除换行）
script: >
  This is a long
  text that spans
  multiple lines
```

**规则：**
- 简单字符串无需引号
- 包含特殊字符的字符串用双引号
- 多行文本用 `|` 或 `>`

### 5. 注释（Comments）

```yaml
# 这是一个注释
name: CI Build  # 行内注释

# ❌ 错误：注释内无法使用
name: CI Build # with ${{ variable }} ← 变量不会被解析
```

**规则：**
- 注释用 `#` 开头
- 行内注释也支持，但变量不会被解析

---

## GitHub Actions 特定规则

### 1. 顶级键（Top-level Keys）

每个 workflow 文件必须包含以下顶级键：

```yaml
name: CI Build                    # 工作流程名称（必需）
on: push                          # 触发事件（必需）
jobs:                             # 任务定义（必需）
  job-id:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Hello"

# 可选顶级键
env:                              # 全局环境变量
  NODE_ENV: production

concurrency:                       # 并发控制
  group: build
  cancel-in-progress: true
```

### 2. on（触发事件）的写法

```yaml
# 单个事件
on: push

# 多个事件
on:
  - push
  - pull_request

# 事件配置
on:
  push:
    branches:
      - main           # 仅 main 分支触发
    paths:
      - 'src/**'       # 仅当 src 目录有改动

  pull_request:
    branches:
      - main           # 仅针对 main 的 PR

  schedule:
    - cron: '0 0 * * *'  # 定时触发（每天午夜）
```

**最佳实践：**
- 精确指定触发分支，避免不必要的构建
- 使用 `paths` 过滤器，仅在相关文件改动时触发

### 3. jobs（任务定义）

```yaml
jobs:
  job-id:                           # 唯一 ID（必需）
    name: 任务显示名称              # 显示名称（可选）
    runs-on: ubuntu-latest          # 运行环境（必需）
    if: condition                   # 条件执行（可选）
    timeout-minutes: 30             # 超时时间（可选）
    concurrency: group-name         # 并发组（可选）
    
    outputs:                        # 输出数据供其他 Job 使用
      result: ${{ steps.build.outputs.result }}
    
    steps:                          # 执行步骤（必需）
      - run: echo "Hello"
```

### 4. steps（步骤定义）

```yaml
steps:
  - name: 步骤名称                  # 步骤名称（可选但推荐）
    id: my-step                     # 步骤 ID（可选，用于引用输出）
    
    # 二选一：
    uses: owner/repo@v1             # 使用 GitHub Action
    # 或
    run: npm install                # 直接运行命令
    
    if: success()                   # 条件执行
    continue-on-error: false        # 错误处理
    timeout-minutes: 10             # 步骤超时
    shell: bash                     # 指定 Shell
    working-directory: ./src        # 工作目录
    
    env:                            # 步骤级环境变量
      DEBUG: true
    
    with:                           # Action 参数
      java-version: '21'
```

---

## ci-build.yml 完整规范解析

### 完整文件结构

```yaml
# ============================================================================
# 1. 工作流程名称
# ============================================================================
name: CI Build

# ============================================================================
# 2. 触发条件（何时运行此工作流程）
# ============================================================================
on:
  push:
    branches:
      - main                # ← 仅当推送到 main 分支时触发

# ============================================================================
# 3. 定义所有的任务
# ============================================================================
jobs:
  # ─────────────────────────────────────────────────────────────────────────
  # Job 1: 后端构建
  # ─────────────────────────────────────────────────────────────────────────
  build-backend:
    runs-on: ubuntu-latest  # 在最新的 Ubuntu 环境运行
    
    steps:
      # Step 1: 检出源代码
      - name: Checkout code
        uses: actions/checkout@v4  # GitHub 官方 Action
        
      # Step 2: 安装 Java 环境
      - name: Set up JDK 21
        uses: actions/setup-java@v4
        with:
          java-version: '21'        # JDK 版本（与 pom.xml 的 <java.version> 一致）
          distribution: 'temurin'   # JDK 发行版（Eclipse Temurin）
          
      # Step 3: 缓存 Maven 依赖（加快后续构建）
      - name: Cache Maven dependencies
        uses: actions/cache@v4
        with:
          # 缓存的目录路径
          path: ~/.m2/repository
          
          # 缓存键（当 pom.xml 改变时自动创建新缓存）
          key: ${{ runner.os }}-maven-${{ hashFiles('**/pom.xml') }}
          
          # 回退键（缓存不命中时按顺序尝试）
          restore-keys: |
            ${{ runner.os }}-maven-
            
      # Step 4: 构建后端应用
      - name: Build backend with Maven
        run: mvn -B package --file petclinic-backend/pom.xml
        # mvn: Maven 命令
        # -B: Batch mode（批处理模式）
        # package: Maven 生命周期阶段
        # --file: 指定 pom.xml 文件

  # ─────────────────────────────────────────────────────────────────────────
  # Job 2: 前端构建
  # ─────────────────────────────────────────────────────────────────────────
  build-frontend:
    runs-on: ubuntu-latest  # 在最新的 Ubuntu 环境运行
    
    steps:
      # Step 1: 检出源代码
      - name: Checkout code
        uses: actions/checkout@v4
        
      # Step 2: 安装 Node.js 环境
      - name: Set up Node.js 20.x
        uses: actions/setup-node@v4
        with:
          node-version: '20.x'      # Node.js LTS 版本
          
      # Step 3: 缓存 NPM 依赖（加快后续构建）
      - name: Cache NPM dependencies
        uses: actions/cache@v4
        with:
          # 缓存的目录路径
          path: petclinic-frontend/node_modules
          
          # 缓存键（基于 package-lock.json）
          key: ${{ runner.os }}-npm-${{ hashFiles('petclinic-frontend/package-lock.json') }}
          
          # 回退键
          restore-keys: |
            ${{ runner.os }}-npm-
            
      # Step 4: 安装 NPM 依赖
      - name: Install dependencies
        run: npm install
        working-directory: petclinic-frontend  # 在此目录下执行
        
      # Step 5: 构建前端应用
      - name: Build frontend
        run: npm run build
        working-directory: petclinic-frontend
```

---

## 常见错误和修复

### ❌ 错误 1: 缩进不一致

```yaml
# ❌ 错误示例
jobs:
  build-backend:
   runs-on: ubuntu-latest    # 1 个空格（错误）
      steps:                 # 6 个空格（错误）
        - run: echo "test"
```

**错误信息：**
```
mapping values are not allowed in this context
```

**✅ 正确修复：**
```yaml
jobs:
  build-backend:
    runs-on: ubuntu-latest   # 2 个空格
    steps:                   # 2 个空格
      - run: echo "test"     # 4 个空格
```

### ❌ 错误 2: 冒号后缺少空格

```yaml
# ❌ 错误示例
name:CI Build              # 冒号后无空格
on:push                    # 冒号后无空格
```

**错误信息：**
```
mapping values are not allowed in this context
```

**✅ 正确修复：**
```yaml
name: CI Build             # 冒号后有空格
on: push                   # 冒号后有空格
```

### ❌ 错误 3: 使用 Tab 缩进

```yaml
# ❌ 错误示例（Tab 字符无法在此显示，但会导致错误）
jobs:
→ build-backend:          # Tab 键缩进
→→ runs-on: ubuntu-latest
```

**✅ 正确修复：**
```yaml
jobs:
  build-backend:          # 2 个空格
    runs-on: ubuntu-latest # 4 个空格
```

### ❌ 错误 4: 引号使用错误

```yaml
# ❌ 错误示例
- name: 'Install dependencies'
  run: npm install'        # 多余的引号
```

**✅ 正确修复：**
```yaml
- name: Install dependencies  # 不需要引号
  run: npm install             # 不需要引号
```

### ❌ 错误 5: 多行字符串语法错误

```yaml
# ❌ 错误示例
restore-keys: |
  ${{ runner.os }}-maven-
${{ runner.os }}-npm-      # 缩进错误，不属于列表
```

**✅ 正确修复：**
```yaml
restore-keys: |
  ${{ runner.os }}-maven-
  ${{ runner.os }}-npm-    # 正确缩进
```

---

## 最佳实践

### 1. 命名规范

```yaml
# ✅ 好的命名
jobs:
  build-backend:          # 小写 + 连字符
  build-frontend:         # 清晰表达职责
  
steps:
  - name: Checkout code           # 动词开头 + 清晰描述
  - name: Set up JDK 21           # 包含版本号
  - name: Cache Maven dependencies # 说明缓存什么
```

```yaml
# ❌ 不好的命名
jobs:
  job1:                  # 不清晰
  MyBuildJob:            # 混用大小写
  backend_build:         # 使用下划线
```

### 2. 注释使用

```yaml
# ✅ 好的注释
on:
  push:
    branches:
      - main             # 仅在 main 分支触发，避免不必要的构建

jobs:
  build-backend:         # 后端构建任务（约 30 秒）
    runs-on: ubuntu-latest
    steps:
      - name: Cache Maven dependencies  # 使用缓存加快构建
        uses: actions/cache@v4
```

```yaml
# ❌ 不必要的注释
name: CI Build  # 设置工作流程名称为 CI Build
on:             # 设置触发事件
  push:         # 当推送时
    branches:   # 在以下分支
      - main    # main 分支
```

### 3. 条件执行

```yaml
# ✅ 合理使用条件
- name: Upload artifact
  if: success()  # 仅在前置步骤成功时上传

- name: Notify on failure
  if: failure()  # 仅在有步骤失败时通知

- name: Deploy to production
  if: startsWith(github.ref, 'refs/tags/')  # 仅在标签发布时
```

### 4. 环境变量

```yaml
# ✅ 环境变量的组织
env:  # 全局环境变量
  NODE_ENV: production
  DEBUG: false

jobs:
  build-backend:
    env:  # Job 级环境变量
      MAVEN_OPTS: -Xmx2g
    steps:
      - run: npm install
        env:  # Step 级环境变量
          CI: true
```

### 5. 文件组织

```
.github/
└── workflows/
    ├── ci-build.yml       # 主构建工作流
    ├── ci-test.yml        # 测试工作流
    ├── deploy-prod.yml    # 生产部署工作流
    └── README.md          # workflows 文档
```

### 6. 版本固定

```yaml
# ✅ 推荐做法
uses: actions/checkout@v4              # 主版本（自动获得补丁更新）
uses: actions/setup-java@v4            # 稳定 Action 用主版本
uses: codecov/codecov-action@v3

# ⚠️ 不推荐
uses: actions/checkout@main            # 浮动版本，可能不稳定
uses: actions/checkout@v4.1.0          # 过度指定，无法获得补丁更新
uses: third-party/action@master        # 不可信的第三方开发分支
```

---

## 验证 YAML 文件

### 在线验证工具

1. **YAML Lint** - https://www.yamllint.com/
2. **GitHub Actions 验证** - 直接推送到 GitHub，Actions 会验证

### 本地验证

```bash
# 使用 Python 验证 YAML 语法
python3 -c "import yaml; yaml.safe_load(open('.github/workflows/ci-build.yml'))"

# 输出
# 如果没有错误，脚本会无输出
# 有错误时会显示具体错误信息
```

### GitHub Actions 语法检查

```bash
# 使用 GitHub 官方 CLI
gh workflow list                    # 列出所有工作流
gh workflow view ci-build.yml       # 查看工作流详情

# 检查 workflow 状态
gh run list                         # 列出所有运行
gh run view <run-id>                # 查看特定运行详情
```

---

## 📋 检查清单

在提交 workflow 文件前，检查以下事项：

- [ ] 文件位置正确：`.github/workflows/ci-build.yml`
- [ ] YAML 缩进一致（2 个空格）
- [ ] 没有使用 Tab 字符
- [ ] 冒号后都有空格
- [ ] 任务 ID 和步骤名称清晰有意义
- [ ] 使用了官方 Actions（actions/checkout、actions/setup-java 等）
- [ ] 缓存键基于相关文件 hash（hashFiles）
- [ ] 在线工具验证了 YAML 语法
- [ ] 本地 Git 能识别该文件
- [ ] 推送到 GitHub 后在 Actions 标签页看到工作流

---

## 总结

### YAML 编写的核心要求

✅ **格式** - 正确的缩进和空格
✅ **结构** - 清晰的键值对和嵌套关系
✅ **命名** - 有意义的 job 和 step 名称
✅ **可维护性** - 好的注释和组织
✅ **验证** - 通过工具验证语法正确性

### 下一步

1. 验证你的 `ci-build.yml` 使用在线工具
2. 推送到 GitHub 并观察执行过程
3. 根据需要添加更多 steps（测试、部署、通知等）
4. 参考 GitHub Actions 官方文档进行高级配置
