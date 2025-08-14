# InverseDesign - 个人网站

这是使用 [Hugo](https://gohugo.io/) 和 [Hextra](https://themes.gohugo.io/themes/hextra/) 主题构建的个人内容网站，包括博客和知识库等内容。

## 功能特点

- 响应式设计，支持移动设备
- 暗黑模式支持
- 内置搜索功能
- 博客系统
- 知识库系统
- 自定义样式

## 本地开发

### 环境要求

- [Hugo](https://gohugo.io/installation/) (推荐最新版本)
- [Go](https://golang.org/dl/) (1.24+)

### 安装步骤

1. 克隆仓库：

```bash
git clone https://github.com/yourusername/inversedesign.git
cd inversedesign
```

2. 安装依赖：

```bash
hugo mod get -u
```

3. 启动本地开发服务器：

```bash
hugo server
```

4. 访问本地网站：

```
http://localhost:1313
```

## 内容管理

- 博客文章存放在 `content/blog/` 目录下
- 知识库内容存放在 `content/docs/` 目录下
- 关于页面在 `content/about.md`
- 自定义样式在 `assets/css/custom.css`

## 部署指南

### 网站构建

```bash
hugo --minify
```

生成的静态文件将位于 `public/` 目录。

### 部署选项

#### Netlify

1. 在 [Netlify](https://www.netlify.com/) 上创建账户
2. 创建新站点，连接到您的 GitHub 仓库
3. 配置构建命令：`hugo --minify`
4. 配置发布目录：`public`

#### GitHub Pages

1. 创建 `.github/workflows/hugo.yml` 工作流配置文件
2. 配置自动部署到 GitHub Pages

#### 其他选项

- [Vercel](https://vercel.com/)
- [Cloudflare Pages](https://pages.cloudflare.com/)
- 任何支持静态网站部署的平台

## 自定义

### 主题配置

主要配置文件是 `hugo.yaml`，您可以根据需要调整各项设置。

### 添加新内容

创建新博客文章：

```bash
hugo new blog/my-new-post.md
```

创建新的知识库页面：

```bash
hugo new docs/category/page-name.md
```

## 贡献指南

欢迎提交问题和合并请求。

## 许可证

本项目采用 MIT 许可证 - 详情见 [LICENSE](LICENSE) 文件。
