# 环境变量配置指南

## 步骤 1: 创建 .env 文件

在项目根目录创建 `.env` 文件，内容如下：

```bash
# Supabase 配置
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-public-key

# 其他配置
NODE_ENV=development
```

## 步骤 2: 安装 dotenv 包

```bash
npm install dotenv
# 或者
pnpm add dotenv
```

## 步骤 3: 更新测试脚本

修改 `test-supabase.js` 文件，在开头添加：

```javascript
require('dotenv').config();
```

## 步骤 4: 设置环境变量

### 方法 A: 直接在终端设置（临时）

```bash
# macOS/Linux
export SUPABASE_URL="https://your-project-id.supabase.co"
export SUPABASE_ANON_KEY="your-anon-public-key"

# Windows (PowerShell)
$env:SUPABASE_URL="https://your-project-id.supabase.co"
$env:SUPABASE_ANON_KEY="your-anon-public-key"

# Windows (CMD)
set SUPABASE_URL=https://your-project-id.supabase.co
set SUPABASE_ANON_KEY=your-anon-public-key
```

### 方法 B: 使用 .env 文件（推荐）

1. 创建 `.env` 文件
2. 安装 dotenv 包
3. 在脚本中加载环境变量

## 步骤 5: 验证配置

运行测试命令：

```bash
npm run test
# 或者
pnpm run test
```

## 注意事项

1. **不要提交 .env 文件到 Git**
   - 将 `.env` 添加到 `.gitignore`
   - 保护敏感信息

2. **生产环境配置**
   - 在 Netlify 中设置环境变量
   - 不要在生产环境使用 .env 文件

3. **Node.js 版本**
   - 建议使用 Node.js 20 或更高版本
   - 当前版本会显示警告但不影响功能
