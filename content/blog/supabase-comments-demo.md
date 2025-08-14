---
title: "Supabase 评论系统演示"
date: 2023-06-23
description: "演示 Hugo 内置短代码 + Supabase 评论系统的完整功能"
tags:
  - Hugo
  - Supabase
  - 评论系统
  - 演示
categories:
  - 技术演示
---

{{< callout type="info" emoji="🚀" >}}
**欢迎！** 这个页面演示了 Hugo 内置短代码 + Supabase 评论系统的完整功能。
{{< /callout >}}

## 功能特性

### ✨ 核心功能
- **实时评论**: 用户可以在文章下方发表评论
- **表单验证**: 自动验证用户输入的数据
- **垃圾评论过滤**: 自动识别和过滤垃圾评论
- **响应式设计**: 支持各种设备屏幕

### 🔧 技术实现
- **前端**: Hugo 内置短代码系统
- **后端**: Netlify Functions + Supabase
- **数据库**: PostgreSQL (Supabase)
- **部署**: Netlify

## 技术架构

### 前端组件
- **评论表单**: 用户输入姓名、邮箱和评论内容
- **评论列表**: 显示已批准的评论
- **实时更新**: 提交评论后自动刷新列表
- **错误处理**: 友好的错误提示

### 后端 API
- **添加评论**: `/.netlify/functions/add-comment`
- **获取评论**: `/.netlify/functions/get-comments`

### 数据库结构
```sql
-- 评论表
CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  post_id TEXT NOT NULL,
  post_title TEXT NOT NULL,
  author TEXT NOT NULL,
  email TEXT NOT NULL,
  content TEXT NOT NULL,
  user_agent TEXT,
  ip_address TEXT,
  status TEXT DEFAULT 'approved',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 访问日志表
CREATE TABLE access_logs (
  id SERIAL PRIMARY KEY,
  action TEXT NOT NULL,
  post_id TEXT,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 使用方法

### 在文章中添加评论功能

只需要在文章的 Markdown 文件中添加以下代码：

```markdown
{{< comments-supabase >}}
```

### 配置 Supabase

1. **创建 Supabase 项目**
   - 访问 [supabase.com](https://supabase.com)
   - 创建新项目
   - 获取项目 URL 和匿名密钥

2. **配置环境变量**
   ```bash
   # .env 文件
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   ```

3. **更新 Hugo 配置**
   ```yaml
   # hugo.yaml
   params:
     supabase:
       url: "https://your-project.supabase.co"
       anonKey: "your-anon-key"
   ```

## 安全特性

### 数据验证
- **必填字段检查**: 姓名、邮箱、内容都是必填的
- **邮箱格式验证**: 使用正则表达式验证邮箱格式
- **内容长度限制**: 评论内容 5-1000 字符
- **XSS 防护**: 自动转义 HTML 内容

### 垃圾评论过滤
系统会自动检查以下内容：
- 包含商业关键词（buy, sell, cheap, discount 等）
- 包含链接（http://, https://, www.）
- 内容过短（少于 5 个字符）
- 重复内容

### 访问日志
- **IP 记录**: 记录评论者 IP 地址
- **用户代理**: 记录浏览器信息
- **操作日志**: 记录所有评论操作

## 性能优化

### 缓存策略
- **API 缓存**: 评论列表缓存 5 分钟
- **CDN 缓存**: 静态资源使用 CDN
- **数据库索引**: 优化查询性能

### 响应式设计
- **移动端适配**: 支持各种屏幕尺寸
- **加载状态**: 友好的加载提示
- **错误处理**: 优雅的错误提示

## 扩展功能

### 可以添加的新功能
1. **用户系统**: 用户注册、登录、个人资料
2. **评论回复**: 支持评论的嵌套回复
3. **评论点赞**: 用户可以对评论点赞
4. **邮件通知**: 新评论时发送邮件通知
5. **评论订阅**: 用户订阅文章评论更新
6. **富文本编辑器**: 支持 Markdown 或富文本
7. **图片上传**: 支持在评论中上传图片
8. **表情符号**: 支持 emoji 表情
9. **评论搜索**: 搜索评论内容
10. **评论导出**: 导出评论数据

### 高级功能
1. **评论审核工作流**: 多级审核流程
2. **评论质量评分**: 基于内容的自动评分
3. **用户信誉系统**: 基于评论质量的用户信誉
4. **评论推荐**: 推荐相关评论
5. **评论分析**: 评论情感分析、关键词提取

## 部署说明

### 本地开发
1. 启动 Hugo 服务器：`hugo server`
2. 访问演示页面：`http://localhost:1313/blog/supabase-comments-demo/`
3. 测试评论功能

### 生产部署
1. 配置 Supabase 项目
2. 设置 Netlify 环境变量
3. 部署到 Netlify
4. 配置域名和 SSL

## 测试评论

请在下方发表您的评论来测试系统功能！

---

{{< comments-supabase >}}
