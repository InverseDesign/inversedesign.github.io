---
title: "Hugo Shortcodes 玩法演示"
date: 2023-06-23
description: "展示各种有趣的 Hugo Shortcodes 用法"
tags:
  - Hugo
  - Shortcodes
  - 演示
categories:
  - 技术演示
---

# Hugo Shortcodes 玩法演示

Hugo 的 Shortcodes 是一个非常强大的功能，可以创建各种交互式组件和内容展示。本文将展示一些有趣的 Shortcodes 用法。

## 1. 可折叠内容

### 基础用法

{{< collapse title="点击展开查看内容" >}}
这是一个可折叠的内容区域。点击标题可以展开或收起内容。

**特点：**
- 支持自定义标题
- 可以设置默认展开状态
- 响应式设计
- 平滑的动画效果
{{< /collapse >}}

### 默认展开

{{< collapse title="默认展开的内容" open="true" >}}
这个内容区域默认是展开的，用户可以直接看到内容。

```javascript
// 示例代码
function hello() {
  console.log("Hello, World!");
}
```
{{< /collapse >}}

## 2. 标签页组件

{{< tabs active="1" >}}
{{< tab title="HTML" >}}
```html
<!DOCTYPE html>
<html>
<head>
    <title>示例页面</title>
</head>
<body>
    <h1>Hello World</h1>
</body>
</html>
```
{{< /tab >}}

{{< tab title="CSS" >}}
```css
body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
}

h1 {
    color: #333;
}
```
{{< /tab >}}

{{< tab title="JavaScript" >}}
```javascript
document.addEventListener('DOMContentLoaded', function() {
    console.log('页面加载完成');
    
    const title = document.querySelector('h1');
    title.addEventListener('click', function() {
        alert('Hello World!');
    });
});
```
{{< /tab >}}
{{< /tabs >}}

## 3. 进度条展示

### 技能进度

{{< progress value="85" label="JavaScript" color="yellow" >}}
{{< progress value="90" label="HTML/CSS" color="blue" >}}
{{< progress value="75" label="Python" color="green" >}}
{{< progress value="60" label="React" color="purple" >}}

### 项目进度

{{< progress value="45" label="项目完成度" color="red" animated="true" >}}

## 4. 技能卡片

{{< skill-card name="前端开发" level="90" icon="🎨" color="blue" description="精通 HTML、CSS、JavaScript，熟悉现代前端框架" >}}
{{< skill-card name="后端开发" level="85" icon="⚙️" color="green" description="熟练使用 Node.js、Python，了解数据库设计" >}}
{{< skill-card name="移动开发" level="70" icon="📱" color="purple" description="掌握 React Native 和 Flutter 开发" >}}
{{< skill-card name="DevOps" level="65" icon="🚀" color="red" description="了解 Docker、CI/CD 和云服务部署" >}}

## 5. 图片画廊

{{< gallery columns="3" >}}
{{< gallery-item src="https://picsum.photos/300/200?random=1" alt="随机图片1" caption="美丽的风景" index="0" >}}
{{< gallery-item src="https://picsum.photos/300/200?random=2" alt="随机图片2" caption="城市夜景" index="1" >}}
{{< gallery-item src="https://picsum.photos/300/200?random=3" alt="随机图片3" caption="自然风光" index="2" >}}
{{< gallery-item src="https://picsum.photos/300/200?random=4" alt="随机图片4" caption="建筑艺术" index="3" >}}
{{< gallery-item src="https://picsum.photos/300/200?random=5" alt="随机图片5" caption="科技感" index="4" >}}
{{< gallery-item src="https://picsum.photos/300/200?random=6" alt="随机图片6" caption="创意设计" index="5" >}}
{{< /gallery >}}

## 6. 密码保护内容

{{< password-protected password="demo123" >}}
这是受密码保护的内容。只有输入正确密码才能查看。

**密码：** `demo123`

### 机密信息
- 项目源代码
- 内部文档
- 敏感数据
{{< /password-protected >}}

## 7. 组合使用示例

{{< collapse title="高级功能演示" >}}
{{< tabs active="1" >}}
{{< tab title="代码示例" >}}
```python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# 计算前10个斐波那契数
for i in range(10):
    print(f"F({i}) = {fibonacci(i)}")
```
{{< /tab >}}

{{< tab title="进度展示" >}}
{{< progress value="75" label="算法理解" color="green" >}}
{{< progress value="80" label="代码质量" color="blue" >}}
{{< progress value="90" label="问题解决" color="purple" >}}
{{< /tab >}}

{{< tab title="技能评估" >}}
{{< skill-card name="算法设计" level="85" icon="🧮" color="indigo" description="掌握常见算法和数据结构" >}}
{{< skill-card name="代码优化" level="80" icon="⚡" color="teal" description="能够优化代码性能和可读性" >}}
{{< /tab >}}
{{< /tabs >}}
{{< /collapse >}}

## 使用方法

### 1. 可折叠内容

```markdown
{{< collapse title="标题" open="false" >}}
内容
{{< /collapse >}}
```

### 2. 标签页

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

### 3. 进度条

```markdown
{{< progress value="75" label="标签" color="blue" animated="true" >}}
```

### 4. 技能卡片

```markdown
{{< skill-card name="技能名" level="80" icon="🎯" color="blue" description="描述" >}}
```

### 5. 图片画廊

```markdown
{{< gallery columns="3" >}}
{{< gallery-item src="图片URL" alt="描述" caption="标题" index="0" >}}
{{< /gallery >}}
```

## 自定义和扩展

### 添加新的颜色主题

可以在 shortcode 文件中添加新的颜色类：

```css
.skill-orange {
  background: linear-gradient(90deg, #f97316, #ea580c);
}
```

### 添加新的图标

可以使用 emoji 或 Font Awesome 图标：

```markdown
{{< skill-card name="新技能" level="85" icon="🚀" color="orange" >}}
```

### 响应式设计

所有组件都支持响应式设计，在移动设备上会自动调整布局。

## 总结

Hugo Shortcodes 提供了无限的可能性来创建丰富的交互式内容。通过组合使用不同的 shortcodes，可以创建出功能强大、用户体验良好的页面。

### 最佳实践

1. **保持简洁**：不要过度使用，影响页面加载速度
2. **统一风格**：保持组件风格的一致性
3. **响应式设计**：确保在所有设备上都能正常显示
4. **性能优化**：合理使用动画和交互效果

---

*这些 shortcodes 可以根据具体需求进行定制和扩展。*
