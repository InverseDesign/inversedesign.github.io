---
title: "Hugo Shortcodes 完整指南"
date: 2023-06-23
description: "Hugo Shortcodes 的完整使用指南和最佳实践"
tags:
  - Hugo
  - Shortcodes
  - 指南
categories:
  - 文档
---

# Hugo Shortcodes 完整指南

Hugo 的 Shortcodes 是一个非常强大的功能，可以创建各种交互式组件和内容展示。本指南将详细介绍各种 Shortcodes 的用法和最佳实践。

## 什么是 Shortcodes

Shortcodes 是 Hugo 提供的一种在 Markdown 内容中嵌入 HTML 代码的方式。它们可以：

- 简化复杂 HTML 的编写
- 创建可重用的组件
- 提供一致的样式和交互
- 增强内容的可读性

## 基础 Shortcodes

### 1. 可折叠内容 (collapse)

创建可展开/收起的内容区域。

#### 语法
```markdown
{{< collapse title="标题" open="false" >}}
内容
{{< /collapse >}}
```

#### 参数
- `title`: 显示的标题
- `open`: 是否默认展开（true/false）

#### 示例
```markdown
{{< collapse title="点击展开" >}}
这是隐藏的内容
{{< /collapse >}}
```

### 2. 标签页 (tabs)

创建多标签页内容展示。

#### 语法
```markdown
{{< tabs active="1" >}}
{{< tab title="标签1" >}}
内容1
{{< /tab >}}
{{< tab title="标签2" >}}
内容2
{{< /tab >}}
{{< /tabs >}}
```

#### 参数
- `active`: 默认激活的标签页（从1开始）

### 3. 进度条 (progress)

显示进度或技能水平。

#### 语法
```markdown
{{< progress value="75" label="标签" color="blue" animated="true" >}}
```

#### 参数
- `value`: 进度值（0-100）
- `label`: 显示的标签
- `color`: 颜色主题（blue, green, red, yellow, purple）
- `animated`: 是否显示动画效果

### 4. 技能卡片 (skill-card)

展示技能或能力的卡片组件。

#### 语法
```markdown
{{< skill-card name="技能名" level="80" icon="🎯" color="blue" description="描述" >}}
```

#### 参数
- `name`: 技能名称
- `level`: 技能水平（0-100）
- `icon`: 图标（emoji 或文字）
- `color`: 颜色主题
- `description`: 技能描述

### 5. 图片画廊 (gallery)

创建响应式图片画廊。

#### 语法
```markdown
{{< gallery columns="3" >}}
{{< gallery-item src="图片URL" alt="描述" caption="标题" index="0" >}}
{{< /gallery >}}
```

#### 参数
- `columns`: 列数（默认3）

### 6. 密码保护 (password-protected)

保护敏感内容。

#### 语法
```markdown
{{< password-protected password="密码" >}}
受保护的内容
{{< /password-protected >}}
```

## 高级 Shortcodes

### 1. YouTube 视频嵌入

```markdown
{{< youtube id="VIDEO_ID" width="100%" height="400px" >}}
```

### 2. GitHub 仓库展示

```markdown
{{< github repo="username/repository" branch="main" >}}
```

### 3. 代码高亮

```markdown
{{< highlight javascript >}}
function hello() {
  console.log("Hello, World!");
}
{{< /highlight >}}
```

## 组合使用

Shortcodes 可以组合使用，创建更复杂的内容：

```markdown
{{< collapse title="高级示例" >}}
{{< tabs active="1" >}}
{{< tab title="代码" >}}
```javascript
console.log("Hello");
```
{{< /tab >}}
{{< tab title="进度" >}}
{{< progress value="85" label="完成度" color="green" >}}
{{< /tab >}}
{{< /tabs >}}
{{< /collapse >}}
```

## 自定义 Shortcodes

### 创建新的 Shortcode

1. 在 `layouts/shortcodes/` 目录下创建 `.html` 文件
2. 使用 Go 模板语法编写
3. 支持参数传递和内容处理

#### 示例：创建警告框

```html
<!-- layouts/shortcodes/warning.html -->
{{ $type := .Get "type" | default "info" }}
{{ $title := .Get "title" | default "注意" }}

<div class="warning-box warning-{{ $type }}">
  <div class="warning-header">
    <span class="warning-icon">
      {{ if eq $type "danger" }}⚠️{{ else }}ℹ️{{ end }}
    </span>
    <strong>{{ $title }}</strong>
  </div>
  <div class="warning-content">
    {{ .Inner }}
  </div>
</div>

<style>
.warning-box {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem 0;
}

.warning-info {
  background: #eff6ff;
  border-color: #3b82f6;
}

.warning-danger {
  background: #fef2f2;
  border-color: #ef4444;
}

.warning-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}
</style>
```

### 使用方法

```markdown
{{< warning type="danger" title="重要提醒" >}}
这是重要的警告信息
{{< /warning >}}
```

## 最佳实践

### 1. 性能优化

- 避免在 shortcode 中加载大型外部资源
- 使用懒加载处理图片
- 合理使用 CSS 和 JavaScript

### 2. 响应式设计

- 确保所有组件在移动设备上正常显示
- 使用相对单位和媒体查询
- 测试不同屏幕尺寸

### 3. 可访问性

- 添加适当的 ARIA 属性
- 确保键盘导航支持
- 提供替代文本和描述

### 4. 代码组织

- 保持 shortcode 文件简洁
- 使用有意义的文件名
- 添加适当的注释

### 5. 样式管理

- 使用一致的命名约定
- 避免内联样式
- 考虑使用 CSS 变量

## 调试技巧

### 1. 检查语法错误

```bash
hugo --buildDrafts --buildFuture
```

### 2. 查看生成的 HTML

在浏览器中右键检查元素，查看生成的 HTML 结构。

### 3. 测试参数

确保所有参数都有默认值，避免因缺少参数导致的错误。

### 4. 浏览器控制台

检查 JavaScript 错误和 CSS 问题。

## 常见问题

### 1. Shortcode 不显示

- 检查文件名和路径
- 确认语法正确
- 查看构建错误信息

### 2. 样式不生效

- 检查 CSS 选择器
- 确认样式没有被覆盖
- 验证 CSS 语法

### 3. JavaScript 不工作

- 检查函数名冲突
- 确认事件绑定正确
- 查看控制台错误

### 4. 参数传递问题

- 检查参数名称
- 确认参数类型
- 验证默认值设置

## 扩展资源

### 1. 官方文档

- [Hugo Shortcodes](https://gohugo.io/content-management/shortcodes/)
- [Go Template Functions](https://gohugo.io/functions/)

### 2. 社区资源

- Hugo 论坛
- GitHub 上的示例项目
- 主题文档

### 3. 工具推荐

- Hugo 扩展版本
- 代码编辑器插件
- 浏览器开发者工具

## 总结

Hugo Shortcodes 为静态网站提供了强大的内容展示能力。通过合理使用和组合不同的 shortcodes，可以创建出功能丰富、用户体验良好的网站。

### 关键要点

1. **选择合适的 shortcode**：根据内容类型选择最合适的组件
2. **保持一致性**：在整个网站中使用统一的样式和交互模式
3. **注重性能**：避免过度使用影响页面加载速度
4. **持续优化**：根据用户反馈不断改进组件

---

## 相关文档

- [Shortcodes 功能总结](/docs/shortcodes-summary/) - 短代码功能概览
- [Hugo Layout 系统完全指南](/docs/hugo-layout-system/) - 模板系统详解
- [Hugo 特色功能详解](/docs/hugo-features/) - Hugo 功能特性
- [评论系统完整指南](/docs/comments-guide/) - 评论系统实现

## 实践演示

- [Shortcodes 功能演示](/blog/shortcodes-demo/) - 各种短代码功能展示
- [Layout 系统演示](/blog/layout-demo/) - 自定义布局演示

*更多示例和用法请参考演示页面：`/blog/shortcodes-demo/`*
