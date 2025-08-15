# Hugo + Supabase 评论系统部署指南

## 概述

本指南将帮助您部署一个完整的 Hugo + Supabase 评论系统，包括前端静态网站和后端数据库。

## 前置要求

- [Hugo](https://gohugo.io/installation/) (推荐最新版本)
- [Node.js](https://nodejs.org/) (16+ 版本)
- [Git](https://git-scm.com/)
- [Netlify CLI](https://docs.netlify.com/cli/get-started/) (可选)

## 步骤 1: 设置 Supabase 项目

### 1.1 创建 Supabase 项目

1. 访问 [supabase.com](https://supabase.com)
2. 点击 "Start your project"
3. 使用 GitHub 登录
4. 点击 "New Project"
5. 选择组织
6. 输入项目名称（如：`hugo-comments`）
7. 设置数据库密码
8. 选择地区（推荐选择离您最近的地区）
9. 点击 "Create new project"

### 1.2 初始化数据库

1. 在 Supabase 控制台中，进入 "SQL Editor"
2. 复制 `supabase/init.sql` 文件的内容
3. 粘贴到 SQL 编辑器中
4. 点击 "Run" 执行脚本

### 1.3 获取项目配置

1. 在 Supabase 控制台中，进入 "Settings" > "API"
2. 复制以下信息：
   - **Project URL**: `https://your-project.supabase.co`
   - **anon public**: `your-anon-key`

## 步骤 2: 配置本地环境

### 2.1 安装依赖

```bash
# 安装 Node.js 依赖
npm install

# 或者使用 yarn
yarn install
```

### 2.2 配置环境变量

创建 `.env` 文件：

```bash
# .env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

### 2.3 更新 Hugo 配置

编辑 `hugo.yaml` 文件，更新 Supabase 配置：

```yaml
params:
  supabase:
    url: "https://your-project.supabase.co"
    anonKey: "your-anon-key"
```

## 步骤 3: 本地测试

### 3.1 启动开发服务器

```bash
# 启动 Hugo 开发服务器
npm run dev

# 或者直接使用 Hugo
hugo server
```

### 3.2 测试评论功能

1. 访问 `http://localhost:1313/blog/supabase-comments-demo/`
2. 尝试发表评论
3. 检查评论是否正确保存到 Supabase

## 步骤 4: 部署到 Netlify

### 4.1 准备部署

```bash
# 构建生产版本
npm run build

# 或者直接使用 Hugo
hugo --gc --minify
```

### 4.2 部署方式一：通过 Netlify UI

1. 访问 [netlify.com](https://netlify.com)
2. 点击 "New site from Git"
3. 连接您的 GitHub 仓库
4. 配置构建设置：
   - **Build command**: `hugo --gc --minify`
   - **Publish directory**: `public`
5. 点击 "Deploy site"

### 4.2 部署方式二：通过 Netlify CLI

```bash
# 安装 Netlify CLI
npm install -g netlify-cli

# 登录 Netlify
netlify login

# 初始化项目
netlify init

# 部署
netlify deploy --prod
```

### 4.3 配置环境变量

在 Netlify 控制台中：

1. 进入 "Site settings" > "Environment variables"
2. 添加以下环境变量：
   - `SUPABASE_URL`: `https://your-project.supabase.co`
   - `SUPABASE_ANON_KEY`: `your-anon-key`

## 步骤 5: 配置域名和 SSL

### 5.1 自定义域名

1. 在 Netlify 控制台中，进入 "Domain settings"
2. 点击 "Add custom domain"
3. 输入您的域名
4. 按照提示配置 DNS 记录

### 5.2 SSL 证书

Netlify 会自动为您的域名提供免费的 SSL 证书。

## 步骤 6: 验证部署

### 6.1 功能测试

1. 访问您的网站
2. 进入评论演示页面
3. 测试评论功能：
   - 发表评论
   - 查看评论列表
   - 验证数据保存

### 6.2 数据库验证

1. 在 Supabase 控制台中，进入 "Table Editor"
2. 查看 `comments` 表
3. 确认评论数据正确保存

## 故障排除

### 常见问题

#### 1. 评论无法保存

**可能原因**：
- Supabase 配置错误
- 环境变量未正确设置
- 数据库权限问题

**解决方案**：
1. 检查 Supabase URL 和密钥
2. 验证环境变量设置
3. 检查数据库 RLS 策略

#### 2. 评论无法加载

**可能原因**：
- API 路由配置错误
- CORS 问题
- 网络连接问题

**解决方案**：
1. 检查 Netlify Functions 配置
2. 验证 CORS 设置
3. 检查浏览器控制台错误

#### 3. 构建失败

**可能原因**：
- Hugo 版本不兼容
- 依赖缺失
- 配置文件错误

**解决方案**：
1. 更新 Hugo 到最新版本
2. 重新安装依赖
3. 检查配置文件语法

### 调试技巧

#### 1. 查看 Netlify Functions 日志

```bash
# 查看实时日志
netlify functions:list
netlify functions:invoke add-comment --body '{"test": "data"}'
```

#### 2. 检查 Supabase 日志

1. 在 Supabase 控制台中，进入 "Logs"
2. 查看 API 请求和错误日志

#### 3. 浏览器调试

1. 打开浏览器开发者工具
2. 查看 Network 标签页
3. 检查 API 请求和响应

## 性能优化

### 1. 缓存策略

- 评论列表缓存 5 分钟
- 静态资源使用 CDN
- 数据库查询优化

### 2. 监控和分析

- 使用 Supabase Analytics 监控数据库性能
- 使用 Netlify Analytics 监控网站性能
- 设置错误监控和告警

## 安全考虑

### 1. 数据保护

- 启用 Supabase RLS
- 限制 API 访问频率
- 定期备份数据

### 2. 内容审核

- 实现评论审核流程
- 设置垃圾评论过滤
- 监控异常活动

## 扩展功能

### 1. 评论管理后台

- 创建管理界面
- 实现评论审核
- 添加统计分析

### 2. 用户系统

- 集成 Supabase Auth
- 实现用户注册登录
- 添加用户权限管理

### 3. 高级功能

- 评论回复功能
- 评论点赞功能
- 邮件通知系统

## 维护和更新

### 1. 定期维护

- 更新依赖包
- 清理旧日志
- 监控系统性能

### 2. 备份策略

- 定期备份数据库
- 备份网站文件
- 测试恢复流程

## 支持资源

- [Hugo 官方文档](https://gohugo.io/documentation/)
- [Supabase 文档](https://supabase.com/docs)
- [Netlify 文档](https://docs.netlify.com/)
- [项目 GitHub 仓库](https://github.com/InverseDesign/hugo-supabase-comments)

---

如有问题，请查看 [故障排除](#故障排除) 部分或提交 Issue。
