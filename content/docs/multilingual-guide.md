---
title: "多语言支持指南"
date: 2023-06-23
description: "Hugo 多语言功能的完整使用指南"
weight: 10
tags:
  - 多语言
  - i18n
  - 国际化
categories:
  - 功能指南
---

# 🌍 Hugo 多语言支持指南

Hugo 提供了强大的国际化（i18n）功能，支持多语言网站构建。本指南将详细介绍如何配置和使用多语言功能。

## 📋 目录

- [基础配置](#基础配置)
- [内容组织](#内容组织)
- [语言切换](#语言切换)
- [翻译管理](#翻译管理)
- [最佳实践](#最佳实践)

## ⚙️ 基础配置

### 1. 配置文件设置

在 `hugo.yaml` 中配置多语言支持：

```yaml
# 多语言配置
languages:
  zh-cn:
    languageName: "简体中文"
    weight: 1
    title: "网站标题"
    description: "网站描述"
    
  en:
    languageName: "English"
    weight: 2
    title: "Website Title"
    description: "Website Description"

# 默认语言设置
defaultContentLanguage: "zh-cn"
defaultContentLanguageInSubdir: true
```

### 2. 配置说明

- **`languageName`**: 语言的显示名称
- **`weight`**: 语言在列表中的权重（数字越小越靠前）
- **`title`**: 该语言的网站标题
- **`description`**: 该语言的网站描述
- **`defaultContentLanguage`**: 默认内容语言
- **`defaultContentLanguageInSubdir`**: 是否在子目录中生成默认语言

## 📁 内容组织

### 1. 文件命名规则

Hugo 使用文件扩展名来区分不同语言的内容：

```
content/
├── _index.md          # 中文首页 (默认语言)
├── _index.en.md       # 英文首页
├── about.md           # 中文关于页面
├── about.en.md        # 英文关于页面
├── blog/
│   ├── first-post.md      # 中文博客文章
│   └── first-post.en.md   # 英文博客文章
└── docs/
    ├── guide.md           # 中文文档
    └── guide.en.md        # 英文文档
```

### 2. 语言代码

常用的语言代码：

| 语言 | 代码 | 说明 |
|------|------|------|
| 简体中文 | `zh-cn` | 中国大陆 |
| 繁体中文 | `zh-tw` | 中国台湾 |
| 英文 | `en` | 英语 |
| 日文 | `ja` | 日语 |
| 韩文 | `ko` | 韩语 |
| 法文 | `fr` | 法语 |
| 德文 | `de` | 德语 |
| 西班牙文 | `es` | 西班牙语 |

## 🔄 语言切换

### 1. 语言切换组件

创建语言切换组件 `layouts/partials/language-switcher.html`：

```html
{{ if .Site.IsMultiLingual }}
<div class="language-switcher">
  {{ range .Site.Languages }}
    {{ if ne . $.Site.Language }}
      <a href="{{ . | absURL }}" class="language-link">
        {{ .LanguageName }}
      </a>
    {{ else }}
      <span class="current-language">{{ .LanguageName }}</span>
    {{ end }}
  {{ end }}
</div>
{{ end }}
```

### 2. 在模板中使用

```html
{{ partial "language-switcher.html" . }}
```

### 3. 语言切换 Shortcode

创建 `layouts/shortcodes/language-switcher.html`：

```html
{{ partial "language-switcher.html" . }}
```

在内容中使用：

```markdown
{{< language-switcher >}}
```

## 🌐 翻译管理

### 1. 翻译文件

在 `i18n/` 目录下创建翻译文件：

```
i18n/
├── zh-cn.yaml    # 中文翻译
└── en.yaml       # 英文翻译
```

### 2. 翻译文件格式

`i18n/zh-cn.yaml`:
```yaml
"read_more": "阅读更多"
"published_on": "发布于"
"categories": "分类"
"tags": "标签"
"search": "搜索"
"menu": "菜单"
```

`i18n/en.yaml`:
```yaml
"read_more": "Read More"
"published_on": "Published on"
"categories": "Categories"
"tags": "Tags"
"search": "Search"
"menu": "Menu"
```

### 3. 在模板中使用翻译

```html
{{ i18n "read_more" }}
```

## 🎯 最佳实践

### 1. 内容同步

- **保持内容同步**: 确保所有语言版本的内容保持同步
- **定期更新**: 定期检查和更新翻译内容
- **质量检查**: 确保翻译的准确性和一致性

### 2. SEO 优化

- **语言标记**: 使用正确的 `lang` 属性
- **hreflang**: 添加语言链接标记
- **URL 结构**: 使用清晰的 URL 结构

### 3. 用户体验

- **语言检测**: 根据用户浏览器语言自动检测
- **语言切换**: 提供便捷的语言切换功能
- **内容完整性**: 确保所有语言版本内容完整

## 🔧 高级功能

### 1. 条件渲染

```html
{{ if eq .Site.Language.Lang "zh-cn" }}
  <!-- 中文特定内容 -->
{{ else if eq .Site.Language.Lang "en" }}
  <!-- 英文特定内容 -->
{{ end }}
```

### 2. 语言特定配置

```yaml
languages:
  zh-cn:
    params:
      custom_param: "中文参数"
  en:
    params:
      custom_param: "English Parameter"
```

### 3. 语言特定菜单

```yaml
languages:
  zh-cn:
    menu:
      main:
        - name: "首页"
          url: "/"
  en:
    menu:
      main:
        - name: "Home"
          url: "/en/"
```

## 📊 多语言统计

### 当前网站语言支持

- **支持语言**: 简体中文、英文
- **内容页面**: 博客、文档、关于页面
- **功能特性**: 搜索、导航、评论系统

### 语言分布

| 语言 | 页面数量 | 完成度 |
|------|----------|--------|
| 简体中文 | 183 | 100% |
| 英文 | 28 | 15% |

## 🚀 扩展建议

### 1. 添加更多语言

1. 在 `hugo.yaml` 中添加新语言配置
2. 创建对应的翻译文件
3. 翻译现有内容
4. 测试语言切换功能

### 2. 自动化翻译

- 使用翻译 API 进行初步翻译
- 人工审核和优化翻译质量
- 建立翻译工作流程

### 3. 本地化功能

- 日期格式本地化
- 数字格式本地化
- 货币格式本地化

## ❓ 常见问题

### Q: 如何添加新语言？
A: 在 `hugo.yaml` 的 `languages` 部分添加新语言配置，然后创建对应的翻译文件和内容文件。

### Q: 如何设置默认语言？
A: 使用 `defaultContentLanguage` 参数设置默认语言。

### Q: 如何隐藏默认语言的 URL 前缀？
A: 设置 `defaultContentLanguageInSubdir: false`。

### Q: 如何处理缺失的翻译？
A: Hugo 会自动回退到默认语言的内容。

---

{{< callout type="info" emoji="💡" >}}
**提示**: 多语言功能需要仔细规划和维护，建议从少量语言开始，逐步扩展。
{{< /callout >}}

## 📚 相关资源

- [Hugo 多语言文档](https://gohugo.io/content-management/multilingual/)
- [i18n 最佳实践](https://gohugo.io/content-management/multilingual/#best-practices)
- [语言切换示例](https://gohugo.io/content-management/multilingual/#language-switcher)
