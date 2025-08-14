---
title: "Supabase 项目设置详细指南"
date: 2023-06-23
description: "详细的 Supabase 项目创建和配置指南，包含截图和步骤说明"
tags:
  - Supabase
  - 设置指南
  - 配置教程
  - 数据库
categories:
  - 教程
---

{{< callout type="info" emoji="🔧" >}}
**本指南将详细说明如何创建 Supabase 项目并获取必要的配置信息。**
{{< /callout >}}

## 步骤 1: 创建 Supabase 账户

### 1.1 访问 Supabase 官网
1. 打开浏览器，访问 [supabase.com](https://supabase.com)
2. 点击右上角的 "Start your project" 按钮

### 1.2 选择登录方式
- **推荐使用 GitHub 登录**（最简单）
- 也可以使用 Google 账户登录
- 或者使用邮箱注册新账户

### 1.3 授权访问
- 如果使用 GitHub 登录，需要授权 Supabase 访问您的 GitHub 账户
- 点击 "Authorize Supabase" 按钮

## 步骤 2: 创建新项目

### 2.1 进入项目创建页面
登录后，您会看到 Supabase 控制台：
1. 点击 "New Project" 按钮
2. 或者点击 "Create a new project" 链接

### 2.2 选择组织
- 如果是第一次使用，会提示创建组织
- 输入组织名称（如：`My Organization`）
- 点击 "Create organization"

### 2.3 填写项目信息
在项目创建表单中填写以下信息：

```
项目名称: hugo-comments-demo
数据库密码: [设置一个强密码，至少8位]
地区: [选择离您最近的地区]
定价计划: Free tier (免费计划)
```

**重要提示：**
- 项目名称必须是唯一的
- 数据库密码要记住，后续可能需要用到
- 地区选择会影响访问速度

### 2.4 创建项目
点击 "Create new project" 按钮，等待项目创建完成（通常需要 1-2 分钟）。

## 步骤 3: 获取项目配置信息

### 3.1 进入项目设置
项目创建完成后：
1. 在项目列表中点击您刚创建的项目
2. 进入项目控制台

### 3.2 找到 API 设置
在左侧导航栏中：
1. 点击 "Settings"（设置）
2. 在设置菜单中点击 "API"

### 3.3 复制配置信息
在 API 设置页面，您会看到以下信息：

#### Project URL
```
https://[your-project-id].supabase.co
```
- 这是您的项目 URL
- 格式类似：`https://dsrzlugtzanbzwzagakd.supabase.co`

#### API Keys
在 "Project API keys" 部分，您会看到两个密钥：

**anon public** (推荐用于前端)
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
- 这是公开的匿名密钥
- 可以安全地在前端代码中使用
- 用于客户端访问

**service_role secret** (仅用于后端)
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
- 这是服务端密钥
- 具有完整的管理权限
- 只能在服务器端使用，不要暴露给前端

### 3.4 复制配置信息
复制以下信息到安全的地方：
- **Project URL**
- **anon public** 密钥

## 步骤 4: 配置环境变量

### 4.1 创建环境变量文件
在项目根目录创建 `.env` 文件：

```bash
# .env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-public-key
```

### 4.2 更新 Hugo 配置
编辑 `hugo.yaml` 文件：

```yaml
params:
  supabase:
    url: "https://your-project-id.supabase.co"
    anonKey: "your-anon-public-key"
```

## 步骤 5: 初始化数据库

### 5.1 进入 SQL 编辑器
在 Supabase 控制台中：
1. 点击左侧导航栏的 "SQL Editor"
2. 点击 "New query" 创建新查询

### 5.2 运行初始化脚本
复制以下 SQL 脚本并粘贴到编辑器中：

```sql
-- 创建评论表
CREATE TABLE IF NOT EXISTS comments (
  id SERIAL PRIMARY KEY,
  post_id TEXT NOT NULL,
  post_title TEXT NOT NULL,
  author TEXT NOT NULL,
  email TEXT NOT NULL,
  content TEXT NOT NULL,
  user_agent TEXT,
  ip_address TEXT,
  status TEXT DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'spam', 'deleted')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建访问日志表
CREATE TABLE IF NOT EXISTS access_logs (
  id SERIAL PRIMARY KEY,
  action TEXT NOT NULL,
  post_id TEXT,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_status ON comments(status);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at);

-- 启用行级安全
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_logs ENABLE ROW LEVEL SECURITY;

-- 创建策略
CREATE POLICY "Allow public read approved comments" ON comments
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Allow public insert comments" ON comments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public insert access logs" ON access_logs
  FOR INSERT WITH CHECK (true);
```

### 5.3 执行脚本
点击 "Run" 按钮执行脚本，等待执行完成。

## 步骤 6: 验证配置

### 6.1 检查表创建
在左侧导航栏中：
1. 点击 "Table Editor"
2. 确认 `comments` 和 `access_logs` 表已创建

### 6.2 测试连接
可以使用以下代码测试连接：

```javascript
// 测试 Supabase 连接
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  'https://your-project-id.supabase.co',
  'your-anon-key'
)

// 测试查询
async function testConnection() {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .limit(1)
  
  if (error) {
    console.error('连接失败:', error)
  } else {
    console.log('连接成功:', data)
  }
}

testConnection()
```

## 常见问题解决

### 问题 1: 找不到 API 设置
**解决方案：**
1. 确保您已经登录到正确的项目
2. 在左侧导航栏中查找 "Settings"
3. 如果看不到 Settings，可能需要等待项目完全创建完成

### 问题 2: API 密钥不显示
**解决方案：**
1. 刷新页面
2. 检查项目状态是否正常
3. 联系 Supabase 支持

### 问题 3: 数据库连接失败
**解决方案：**
1. 检查 Project URL 是否正确
2. 确认 anon public 密钥是否正确复制
3. 检查网络连接
4. 确认项目地区设置

### 问题 4: 表创建失败
**解决方案：**
1. 检查 SQL 语法是否正确
2. 确认您有足够的权限
3. 尝试分步执行 SQL 语句

## 安全注意事项

### 1. 密钥安全
- **anon public** 密钥可以安全地在前端使用
- **service_role** 密钥只能在服务器端使用
- 不要将密钥提交到公开的代码仓库

### 2. 环境变量
- 使用 `.env` 文件存储敏感信息
- 将 `.env` 添加到 `.gitignore`
- 在生产环境中使用环境变量

### 3. 数据库安全
- 启用行级安全 (RLS)
- 创建适当的访问策略
- 定期备份数据

## 下一步

配置完成后，您可以：

1. **测试评论系统**：访问演示页面测试功能
2. **自定义样式**：修改评论组件的样式
3. **添加功能**：实现评论审核、邮件通知等
4. **部署上线**：将项目部署到生产环境

## 获取帮助

如果遇到问题：

1. **查看文档**：[Supabase 官方文档](https://supabase.com/docs)
2. **社区支持**：[Supabase Discord](https://discord.supabase.com)
3. **GitHub Issues**：[Supabase GitHub](https://github.com/supabase/supabase)

---

{{< callout type="success" emoji="✅" >}}
**恭喜！** 现在您已经成功配置了 Supabase 项目，可以开始使用评论系统了。
{{< /callout >}}
