---
title: "Hugo 网站问题排查指南"
date: 2023-06-23
description: "常见问题排查和修复方法"
tags:
  - Hugo
  - 问题排查
  - 修复指南
categories:
  - 文档
---

# Hugo 网站问题排查指南

本文档记录了常见的问题和解决方案。

## 🔍 常见错误及修复

### 1. Shortcode 模板未找到

**错误信息：**
```
failed to extract shortcode: template for shortcode "xxx" not found
```

**原因：**
- 使用了不存在的 shortcode
- shortcode 语法错误
- shortcode 文件路径错误

**解决方案：**
1. 检查 shortcode 是否存在
2. 验证语法是否正确
3. 确保文件路径正确

**示例修复：**

**错误用法：**
```
{{&lt; shortcode name="tabs" &gt;}}
```

**正确用法：**
```
{{&lt; tabs &gt;}}
{{&lt; tab title="标签页1" &gt;}}内容1{{&lt; /tab &gt;}}
{{&lt; /tabs &gt;}}
```

### 2. 资源处理错误

**错误信息：**
```
resources.ToCSS was deprecated in Hugo v0.128.0
```

**原因：**
- 使用了已弃用的 Hugo 函数
- Hugo 版本不兼容

**解决方案：**
1. 更新到新版本的 Hugo 函数
2. 使用替代方案

**示例修复：**
```html
<!-- 旧版本 -->
{{ $css := resources.Get "css/main.css" | resources.ToCSS }}

<!-- 新版本 -->
<link rel="stylesheet" href="/css/main.css">
```

### 3. 原始 HTML 警告

**警告信息：**
```
Raw HTML omitted while rendering
```

**原因：**
- Hugo 默认不渲染原始 HTML
- 安全考虑

**解决方案：**
在 `hugo.yaml` 中添加配置：
```yaml
ignoreLogs: ['warning-goldmark-raw-html']
```

### 4. 构建失败

**常见原因：**
- 语法错误
- 文件路径错误
- 依赖缺失

**排查步骤：**
1. 检查错误信息
2. 验证文件语法
3. 确认依赖完整

## 🛠️ 调试技巧

### 1. 启用详细日志
```bash
hugo server --log --verboseLog
```

### 2. 检查特定页面
```bash
hugo --buildDrafts --buildFuture --verbose
```

### 3. 验证配置
```bash
hugo config
```

### 4. 检查依赖
```bash
hugo mod graph
```

## 📋 预防措施

### 1. 代码规范
- 使用正确的 shortcode 语法
- 遵循 Hugo 最佳实践
- 定期更新 Hugo 版本

### 2. 测试流程
- 本地测试所有功能
- 验证所有页面正常
- 检查构建输出

### 3. 版本控制
- 使用 Git 管理代码
- 记录重要更改
- 备份配置文件

## 🔧 工具推荐

### 1. 开发工具
- **VS Code**: 优秀的编辑器
- **Hugo Extended**: 完整功能版本
- **Live Server**: 实时预览

### 2. 调试工具
- **浏览器开发者工具**: 前端调试
- **Hugo 内置日志**: 后端调试
- **Netlify CLI**: 部署调试

### 3. 验证工具
- **HTML 验证器**: 检查 HTML 语法
- **CSS 验证器**: 检查 CSS 语法
- **链接检查器**: 验证链接有效性

## 📚 参考资源

### 1. 官方文档
- [Hugo 官方文档](https://gohugo.io/documentation/)
- [Hugo 主题文档](https://themes.gohugo.io/)
- [Hugo 论坛](https://discourse.gohugo.io/)

### 2. 社区资源
- [Hugo GitHub](https://github.com/gohugoio/hugo)
- [Hugo 主题](https://themes.gohugo.io/)
- [Hugo 插件](https://github.com/topics/hugo)

### 3. 学习资源
- [Hugo 教程](https://gohugo.io/getting-started/)
- [Hugo 最佳实践](https://gohugo.io/hugo-and-gdpr/)
- [Hugo 性能优化](https://gohugo.io/hugo-pipes/)

## 🎯 快速修复清单

### 构建前检查
- [ ] 所有 shortcode 语法正确
- [ ] 文件路径有效
- [ ] 配置语法正确
- [ ] 依赖完整

### 构建后检查
- [ ] 无错误信息
- [ ] 所有页面正常
- [ ] 功能完整
- [ ] 性能良好

### 部署前检查
- [ ] 本地测试通过
- [ ] 生产环境配置
- [ ] 域名和 SSL 配置
- [ ] 监控和日志

---

*如有其他问题，请参考官方文档或社区资源。*
