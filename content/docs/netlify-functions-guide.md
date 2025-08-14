---
title: "Netlify Functions 详解"
date: 2023-06-23
description: "了解 Netlify Functions 是什么、如何使用以及部署流程"
tags:
  - Netlify
  - Serverless
  - Functions
  - 部署
categories:
  - 技术文档
---

{{< callout type="info" emoji="🚀" >}}
**Netlify Functions** 是 Netlify 提供的无服务器函数服务，让静态网站也能拥有动态功能。
{{< /callout >}}

## 什么是 Netlify Functions？

### 基本概念

**Netlify Functions** 是基于 AWS Lambda 的无服务器函数服务，专门为静态网站设计。它允许您在静态网站中添加动态功能，而无需管理服务器。

### 核心特性

- **🔄 无服务器**：无需管理服务器，自动扩展
- **⚡ 快速响应**：冷启动时间短，响应迅速
- **🔗 无缝集成**：与 Netlify 静态网站完美集成
- **🌍 全球部署**：自动部署到全球边缘节点
- **💰 按需付费**：只在使用时付费

## 本地开发 vs 生产部署

### 本地开发环境

#### 使用 Netlify CLI 进行本地测试

```bash
# 安装 Netlify CLI
npm install -g netlify-cli

# 启动本地开发服务器
netlify dev
```

**本地开发的优势：**
- 🔧 **实时调试**：可以实时修改和测试函数
- 🐛 **错误追踪**：详细的错误信息和日志
- ⚡ **快速迭代**：无需部署即可测试
- 🔄 **热重载**：代码修改后自动重新加载

#### 本地开发流程

1. **启动开发服务器**
   ```bash
   netlify dev
   ```

2. **访问本地地址**
   ```
   http://localhost:8888
   ```

3. **测试 Functions**
   ```
   http://localhost:8888/.netlify/functions/your-function
   ```

### 生产部署环境

#### 自动部署流程

当您推送代码到 Git 仓库时，Netlify 会自动：

1. **检测 Functions 目录**
   ```toml
   [functions]
     directory = "netlify/functions"
   ```

2. **构建和部署 Functions**
   - 自动识别 JavaScript/TypeScript 文件
   - 构建函数代码
   - 部署到全球边缘节点

3. **设置环境变量**
   ```toml
   [functions.environment]
     SUPABASE_URL = "your-supabase-url"
     SUPABASE_ANON_KEY = "your-supabase-key"
   ```

#### 生产环境特性

- **🌍 全球 CDN**：自动分发到全球边缘节点
- **🔒 安全隔离**：每个函数运行在独立环境中
- **📊 监控日志**：提供详细的执行日志和监控
- **⚡ 自动扩展**：根据请求量自动扩展

## 项目中的 Functions 结构

### 目录结构

```
netlify/
└── functions/
    ├── add-comment.js      # 添加评论
    ├── get-comments.js     # 获取评论
    ├── test-connection.js  # 测试连接
    └── hello.js           # 测试函数
```

### 函数示例

#### 基本函数结构

```javascript
// netlify/functions/hello.js
exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      message: 'Hello from Netlify Functions!',
      timestamp: new Date().toISOString()
    })
  };
};
```

#### 评论系统函数

```javascript
// netlify/functions/add-comment.js
const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event, context) => {
  // CORS 处理
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      }
    };
  }

  try {
    // 处理评论数据
    const { post_id, author, content } = JSON.parse(event.body);
    
    // 返回成功响应
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        message: '评论发表成功！'
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: false,
        message: '服务器错误'
      })
    };
  }
};
```

## 环境变量配置

### 本地开发

使用 `.env` 文件：

```bash
# .env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

### 生产部署

在 `netlify.toml` 中配置：

```toml
[functions.environment]
  SUPABASE_URL = "https://your-project.supabase.co"
  SUPABASE_ANON_KEY = "your-anon-key"
```

### 通过 Netlify 控制台设置

1. 登录 Netlify 控制台
2. 进入项目设置
3. 在 "Environment variables" 中添加变量

## 调用 Functions

### 前端调用方式

```javascript
// 调用函数
const response = await fetch('/.netlify/functions/add-comment', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    post_id: '/blog/post-1/',
    author: '用户名',
    content: '评论内容'
  })
});

const result = await response.json();
```

### URL 路径规则

- **本地开发**：`http://localhost:8888/.netlify/functions/function-name`
- **生产环境**：`https://your-site.netlify.app/.netlify/functions/function-name`

## 部署流程

### 1. 开发阶段

```bash
# 本地开发
netlify dev

# 测试函数
curl http://localhost:8888/.netlify/functions/hello
```

### 2. 提交代码

```bash
git add .
git commit -m "Add comment system with Netlify Functions"
git push origin main
```

### 3. 自动部署

Netlify 自动检测并部署：
- 构建静态网站
- 部署 Functions
- 设置环境变量
- 配置重定向规则

### 4. 验证部署

```bash
# 检查生产环境函数
curl https://your-site.netlify.app/.netlify/functions/hello
```

## 监控和日志

### 查看函数日志

1. **Netlify 控制台**
   - 进入项目 → Functions
   - 查看执行日志和错误信息

2. **实时日志**
   ```bash
   netlify functions:list
   netlify functions:logs
   ```

### 性能监控

- **执行时间**：每次函数调用的耗时
- **内存使用**：函数运行时的内存消耗
- **调用次数**：函数被调用的频率
- **错误率**：函数执行失败的比例

## 最佳实践

### 1. 错误处理

```javascript
exports.handler = async (event, context) => {
  try {
    // 业务逻辑
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        success: false, 
        error: error.message 
      })
    };
  }
};
```

### 2. CORS 配置

```javascript
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
};
```

### 3. 环境变量验证

```javascript
const requiredEnvVars = ['SUPABASE_URL', 'SUPABASE_ANON_KEY'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}
```

## 常见问题

### Q: 本地开发时函数无法访问环境变量？

**A:** 确保使用 `netlify dev` 而不是 `hugo server`，并在 `netlify.toml` 中配置环境变量。

### Q: 生产环境中函数返回 404？

**A:** 检查函数文件是否正确放置在 `netlify/functions/` 目录中，并确保文件名与调用路径匹配。

### Q: 函数执行超时？

**A:** Netlify Functions 默认超时时间为 10 秒，可以在 `netlify.toml` 中调整：

```toml
[functions]
  directory = "netlify/functions"
  node_bundler = "esbuild"
  timeout = 30
```

## 总结

Netlify Functions 是连接静态网站和动态功能的桥梁：

- **本地开发**：使用 `netlify dev` 进行实时测试
- **生产部署**：自动部署到全球边缘节点
- **无缝集成**：与 Hugo 静态网站完美配合
- **按需扩展**：根据访问量自动扩展

通过 Netlify Functions，您的静态网站可以拥有评论系统、用户认证、动态内容等丰富的交互功能！
