---
title: "密码保护文章示例"
date: 2023-06-23
description: "这是一个需要密码才能访问的文章示例"
password: "secret123"
layout: password-protected
tags:
  - 密码保护
  - 示例
categories:
  - 技术演示
---

{{< callout type="info" emoji="🔒" >}}
**注意**: 这篇文章需要密码才能访问。密码是 `secret123`
{{< /callout >}}

## 欢迎来到密码保护文章

这是一篇需要密码才能访问的文章。只有知道正确密码的用户才能看到完整内容。

## 文章内容

### 第一部分：技术分享

这里是一些技术分享内容，包括：

- **Web 开发技巧**
- **Hugo 使用心得**
- **前端技术趋势**
- **后端架构设计**

### 第二部分：项目经验

分享一些项目开发经验：

#### 项目 A：电商平台
- 技术栈：React + Node.js + MongoDB
- 开发周期：6个月
- 团队规模：8人
- 主要挑战：高并发处理

#### 项目 B：内容管理系统
- 技术栈：Vue.js + Django + PostgreSQL
- 开发周期：4个月
- 团队规模：5人
- 主要挑战：复杂权限管理

### 第三部分：学习资源

推荐一些优质的学习资源：

#### 在线课程
1. **Udemy** - 全面的在线学习平台
2. **Coursera** - 大学级别的在线课程
3. **edX** - 免费的高等教育课程

#### 技术书籍
1. **《深入理解计算机系统》** - 计算机科学经典
2. **《算法导论》** - 算法学习必读
3. **《设计模式》** - 软件设计经典

#### 博客和网站
1. **MDN Web Docs** - Web 开发权威文档
2. **Stack Overflow** - 程序员问答社区
3. **GitHub** - 代码托管和开源项目

## 代码示例

### Python 示例
```python
def fibonacci(n):
    """计算斐波那契数列"""
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# 测试函数
for i in range(10):
    print(f"F({i}) = {fibonacci(i)}")
```

### JavaScript 示例
```javascript
// 异步函数示例
async function fetchUserData(userId) {
    try {
        const response = await fetch(`/api/users/${userId}`);
        const userData = await response.json();
        return userData;
    } catch (error) {
        console.error('获取用户数据失败:', error);
        throw error;
    }
}

// 使用示例
fetchUserData(123)
    .then(user => console.log('用户数据:', user))
    .catch(error => console.error('错误:', error));
```

## 总结

这篇文章展示了密码保护功能的使用方法。通过设置 `password` 参数，可以轻松保护文章内容。

### 使用方法

1. **在文章前置元数据中设置密码**：
   ```yaml
   ---
   title: "文章标题"
   password: "your-password"
   layout: password-protected
   ---
   ```

2. **使用短代码保护部分内容**：
   ```markdown
   {{< password-protected password="section-password" >}}
   这里是受保护的内容
   {{< /password-protected >}}
   ```

### 安全说明

{{< callout type="warning" emoji="⚠️" >}}
**重要**: 这种客户端密码保护主要用于内容展示控制，不能提供真正的安全性。敏感信息请使用服务器端加密。
{{< /callout >}}

---

*感谢您阅读这篇密码保护文章示例！*
