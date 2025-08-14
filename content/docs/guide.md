---
title: 网站使用指南
date: 2023-06-23
description: 如何管理和更新您的Hugo个人网站
---

# 网站使用指南

## 基本操作

### 本地开发

1. 启动本地开发服务器：

```bash
hugo server
```

2. 访问本地网站：`http://localhost:1313`

3. 实时预览：修改文件时，网站会自动刷新

### 创建新内容

#### 博客文章

```bash
hugo new blog/my-post-name.md
```

新创建的文章默认会有以下前置元数据：

```yaml
---
title: "文章标题"
date: 2023-06-23
draft: true  # 发布前将此改为false
description: "文章描述"
tags: []  # 添加相关标签
---
```

#### 知识库页面

```bash
hugo new docs/category/page-name.md
```

### 构建网站

生成用于部署的静态文件：

```bash
hugo --minify
```

生成的文件位于 `public/` 目录中。

## 内容组织

### 博客文章结构

博客文章位于 `content/blog/` 目录中：

```
content/
  └── blog/
      ├── _index.md    # 博客首页
      ├── post-1.md    # 文章1
      └── post-2.md    # 文章2
```

### 知识库结构

知识库内容位于 `content/docs/` 目录中：

```
content/
  └── docs/
      ├── _index.md              # 知识库首页
      ├── tech/                  # 技术分类
      │   ├── _index.md          # 技术分类首页
      │   └── web-development.md # 具体页面
      ├── learning/              # 学习资源分类
      │   └── _index.md
      └── projects/              # 项目文档分类
          └── _index.md
```

## 内容格式

### Markdown 格式

网站内容使用 Markdown 格式编写，支持以下功能：

#### 基本语法

```markdown
# 一级标题
## 二级标题

**粗体文本**
*斜体文本*

[链接文本](https://example.com)

![图片替代文本](图片URL)

> 引用文本

- 无序列表项
- 另一个列表项

1. 有序列表项
2. 另一个有序列表项

---

表格：
| 列1 | 列2 |
|-----|-----|
| 单元格1 | 单元格2 |
```

#### 代码块

````markdown
```python
def hello_world():
    print("Hello, World!")
```
````

### 短代码

Hugo 支持丰富的短代码功能，Hextra 主题提供了一些有用的短代码：

```
{{< callout emoji="ℹ️" >}}
这是一个信息提示框
{{< /callout >}}

{{< tabs items="HTML,CSS,JavaScript" >}}
{{< tab >}}HTML 内容{{< /tab >}}
{{< tab >}}CSS 内容{{< /tab >}}
{{< tab >}}JavaScript 内容{{< /tab >}}
{{< /tabs >}}
```

## 自定义样式

网站使用了自定义CSS，位于 `assets/css/custom.css`。您可以通过编辑此文件来调整网站样式。

## 部署流程

### GitHub Pages 部署

网站配置了自动部署到 GitHub Pages：

1. 将更改推送到主分支
2. GitHub Actions 会自动构建并部署网站

### Netlify 部署

如果您使用 Netlify：

1. 连接您的 GitHub 仓库
2. 设置构建命令：`hugo --minify`
3. 设置发布目录：`public`

## 常见问题

### 图片管理

将图片放在 `static/images/` 目录中，然后在 Markdown 中引用：

```markdown
![图片描述](/images/my-image.jpg)
```

### 自定义主题

主题的主要配置在 `hugo.yaml` 文件中，您可以根据需要调整各项设置。

### 内容组织技巧

- 使用标签和分类整理内容
- 为内容添加权重以控制显示顺序
- 使用前置元数据中的 `draft: true` 来保存草稿
