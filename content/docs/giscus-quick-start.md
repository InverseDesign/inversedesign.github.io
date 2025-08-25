---
title: "Giscus 快速开始指南"
date: 2024-01-15
description: "5分钟快速配置 Giscus 评论系统"
tags:
  - Giscus
  - 评论系统
  - 快速开始
  - 配置指南
categories:
  - 功能指南
---

{{< callout type="warning" emoji="⚡" >}}
**快速开始**: 本指南将帮助您在 5 分钟内完成 Giscus 评论系统的配置。
{{< /callout >}}

# Giscus 快速开始指南

## 🎯 目标
在 5 分钟内完成 Giscus 评论系统的配置，让您的 Hugo 网站拥有基于 GitHub Discussions 的评论功能。

## 📋 前置条件检查

在开始之前，请确保您满足以下条件：

- ✅ 拥有 GitHub 账户
- ✅ 拥有一个公开的 GitHub 仓库
- ✅ 仓库已启用 Discussions 功能
- ✅ 已安装 Giscus 应用

## 🚀 5分钟配置步骤

### 第1步：启用 GitHub Discussions (1分钟)

1. 访问您的 GitHub 仓库：`https://github.com/inversedesign/inversedesign.github.io`
2. 点击 "Settings" 标签
3. 在左侧菜单中找到 "Features"
4. 勾选 "Discussions" 选项
5. 点击 "Save changes"

### 第2步：安装 Giscus 应用 (1分钟)

1. 访问 Giscus 应用页面：`https://github.com/apps/giscus`
2. 点击 "Install" 按钮
3. 选择您的仓库 `inversedesign/inversedesign.github.io`
4. 点击 "Install" 确认安装

### 第3步：获取配置信息 (1分钟)

运行配置脚本获取必要信息：

```bash
# 设置 GitHub Token
export GITHUB_TOKEN=your_github_token

# 运行配置脚本
node scripts/get-giscus-config.js
```

或者手动获取：

1. **仓库 ID**: 访问 `https://api.github.com/repos/inversedesign/inversedesign.github.io`
2. **分类 ID**: 使用 GitHub GraphQL API 获取 Discussions 分类

### 第4步：更新 Hugo 配置 (1分钟)

在 `hugo.yaml` 中添加以下配置：

```yaml
params:
  comments:
    enable: true
    type: giscus
  
  giscus:
    repo: "inversedesign/inversedesign.github.io"
    repoId: "R_kgDOPjsjDA"
    category: "Announcements"
    categoryId: "DIC_kwDOPjsjDM4Cuj3Q"
    mapping: "pathname"
    strict: "0"
    reactionsEnabled: "1"
    emitMetadata: "0"
    inputPosition: "top"
    theme: "preferred_color_scheme"
    lang: "zh-CN"
    loading: "lazy"
```

### 第5步：在文章中使用 (1分钟)

在您的 Markdown 文章末尾添加：

```markdown
{{< giscus >}}
```

## ✅ 验证配置

### 1. 本地测试
```bash
# 启动 Hugo 服务器
hugo server

# 访问演示页面
http://localhost:1313/blog/giscus-comments-demo/
```

### 2. 检查要点
- [ ] 评论组件正常显示
- [ ] 可以点击 "Sign in with GitHub" 登录
- [ ] 可以发表评论
- [ ] 评论实时显示
- [ ] 主题切换正常

## 🔧 常见问题快速解决

### 问题1：评论不显示
**解决方案：**
1. 检查仓库是否为公开状态
2. 确认 Discussions 功能已启用
3. 验证 Giscus 应用已安装

### 问题2：身份验证失败
**解决方案：**
1. 清除浏览器缓存
2. 重新授权 GitHub 账户
3. 检查网络连接

### 问题3：配置参数错误
**解决方案：**
1. 使用配置脚本重新获取参数
2. 检查 `hugo.yaml` 格式是否正确
3. 重启 Hugo 服务器

## 📚 下一步

配置完成后，您可以：

1. **自定义样式**: 修改 CSS 来美化评论界面
2. **多语言支持**: 为不同语言配置不同的设置
3. **条件显示**: 在特定页面禁用评论
4. **高级配置**: 调整主题、语言等参数

## 🎉 恭喜！

您已成功配置 Giscus 评论系统！现在您的 Hugo 网站拥有了：

- ✅ 基于 GitHub 的身份验证
- ✅ 实时评论功能
- ✅ 响应式设计
- ✅ 主题适配
- ✅ 多语言支持

如果您需要更详细的配置说明，请参考 [Giscus 完整配置指南](/docs/giscus-comments-guide/)。
