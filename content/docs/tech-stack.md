---
title: "技术栈总结"
date: 2023-06-23
description: "我的技术栈和学习路线图"
tags:
  - 技术栈
  - 学习路线
  - 开发工具
categories:
  - 技术文档
---

{{< callout type="info" emoji="🛠️" >}}
**技术栈**：这里记录了我学习和使用的各种技术，以及它们之间的关系。
{{< /callout >}}

# 技术栈总结

## 前端技术

### 静态网站生成器
- **Hugo** - Go 语言编写的静态网站生成器
  - 优点：构建速度快、配置简单
  - 应用：个人博客、文档网站
  - 相关：[Hugo vs Hexo 对比](/docs/hexo-vs-hugo-comparison/)

- **Hexo** - Node.js 编写的静态网站生成器
  - 优点：插件丰富、社区活跃
  - 应用：技术博客、个人网站

### CSS 框架
- **Tailwind CSS** - 实用优先的 CSS 框架
- **Bootstrap** - 响应式前端框架
- **自定义 CSS** - 项目特定样式

### JavaScript
- **ES6+** - 现代 JavaScript 特性
- **Vue.js** - 渐进式 JavaScript 框架
- **React** - 用户界面构建库

## 后端服务

### 无服务器架构
- **Netlify Functions** - 基于 AWS Lambda 的无服务器函数
  - 应用：API 接口、数据处理
  - 相关：[Netlify Functions 指南](/docs/netlify-functions-guide/)
  - 相关：[本地开发 vs 生产部署](/docs/netlify-functions-comparison/)

- **Vercel Functions** - Vercel 平台的无服务器函数
- **Cloudflare Workers** - 边缘计算平台

### 数据库
- **Supabase** - 开源 Firebase 替代方案
  - 特点：PostgreSQL 数据库、实时功能、认证服务
  - 应用：评论系统、用户管理、动态内容
  - 相关：[Supabase 介绍](/docs/supabase-introduction/)
  - 相关：[Hugo 中的应用](/docs/supabase-hugo-applications/)

- **MongoDB** - NoSQL 文档数据库
- **PostgreSQL** - 关系型数据库

### 认证服务
- **Supabase Auth** - 内置认证系统
- **Auth0** - 身份验证和授权平台
- **Firebase Auth** - Google 认证服务

## 部署平台

### 静态托管
- **Netlify** - 静态网站托管平台
  - 特点：自动部署、Functions 支持、CDN
  - 应用：个人网站、项目展示

- **Vercel** - 前端部署平台
- **GitHub Pages** - GitHub 静态网站托管

### CDN 和性能
- **Cloudflare** - CDN 和安全服务
- **AWS CloudFront** - AWS 内容分发网络

## 开发工具

### 版本控制
- **Git** - 分布式版本控制系统
- **GitHub** - 代码托管平台

### 包管理
- **npm** - Node.js 包管理器
- **pnpm** - 快速、节省磁盘空间的包管理器
- **yarn** - Facebook 开发的包管理器

### 开发环境
- **VS Code** - 代码编辑器
- **Hugo CLI** - Hugo 命令行工具
- **Netlify CLI** - Netlify 命令行工具

## 项目架构

### JAMstack 架构
```
前端 (Hugo) ←→ API (Netlify Functions) ←→ 数据库 (Supabase)
```

### 技术组合示例

#### 评论系统
- **前端**: Hugo 短代码
- **API**: Netlify Functions
- **数据库**: Supabase PostgreSQL
- **部署**: Netlify

#### 用户认证
- **前端**: Hugo + JavaScript
- **认证**: Supabase Auth
- **API**: Netlify Functions
- **数据库**: Supabase

## 学习路线图

### 入门阶段
1. **HTML/CSS/JavaScript** - 前端基础
2. **Git 版本控制** - 代码管理
3. **静态网站生成器** - Hugo/Hexo

### 进阶阶段
1. **无服务器架构** - Netlify Functions
2. **数据库设计** - Supabase/PostgreSQL
3. **API 开发** - RESTful API 设计

### 高级阶段
1. **性能优化** - CDN、缓存策略
2. **安全加固** - 认证、授权、数据保护
3. **监控运维** - 日志、错误追踪

## 最佳实践

### 开发流程
1. **需求分析** - 明确功能需求
2. **技术选型** - 选择合适的技术栈
3. **架构设计** - 设计系统架构
4. **开发实现** - 编写代码
5. **测试部署** - 测试和部署

### 代码质量
- **代码规范** - 遵循编码标准
- **错误处理** - 完善的错误处理机制
- **文档注释** - 清晰的代码文档
- **版本控制** - 规范的提交信息

### 性能优化
- **静态资源优化** - 图片压缩、CSS/JS 压缩
- **CDN 加速** - 使用 CDN 分发
- **缓存策略** - 合理的缓存配置
- **代码分割** - 按需加载

## 相关资源

### 官方文档
- [Hugo 官方文档](https://gohugo.io/documentation/)
- [Netlify Functions 文档](https://docs.netlify.com/functions/overview/)
- [Supabase 文档](https://supabase.com/docs)

### 学习资源
- [JAMstack 官网](https://jamstack.org/)
- [Serverless 架构指南](https://serverless.com/)
- [静态网站最佳实践](https://www.staticgen.com/)

---

*技术栈会随着学习和项目需求不断更新，保持学习新技术的能力很重要。*
