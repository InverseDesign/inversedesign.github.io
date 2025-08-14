---
title: "Supabase 连接测试页面"
date: 2023-06-23
description: "测试 Supabase 连接和评论系统功能"
tags:
  - 测试
  - Supabase
  - 评论系统
categories:
  - 测试
---

{{< callout type="info" emoji="🧪" >}}
**测试页面**：这个页面用于测试 Supabase 连接和评论系统是否正常工作。
{{< /callout >}}

## 连接测试

### 1. Supabase 连接状态

<div class="connection-test">
  <button onclick="testConnection()" class="test-btn">🔍 测试 Supabase 连接</button>
  <div id="connection-result" class="test-result"></div>
</div>

### 2. 数据库表检查

<div class="table-test">
  <button onclick="checkTables()" class="test-btn">📊 检查数据库表</button>
  <div id="table-result" class="test-result"></div>
</div>

### 3. 评论功能测试

<div class="comment-test">
  <button onclick="testCommentSystem()" class="test-btn">💬 测试评论系统</button>
  <div id="comment-result" class="test-result"></div>
</div>

## 测试结果说明

### ✅ 成功状态
- **连接成功**：Supabase 连接正常
- **表存在**：数据库表已创建
- **权限正确**：API 密钥权限正常
- **功能可用**：评论系统可以正常使用

### ❌ 失败状态
- **连接失败**：检查 Supabase URL 和密钥
- **表不存在**：需要运行数据库初始化脚本
- **权限错误**：检查 API 密钥配置
- **功能异常**：检查 Netlify Functions 配置

## 故障排除

### 常见问题

1. **连接失败**
   - 检查 Supabase URL 是否正确
   - 确认 API 密钥是否有效
   - 验证网络连接

2. **表不存在**
   - 运行数据库初始化脚本
   - 检查 SQL 执行是否成功
   - 确认表名是否正确

3. **权限错误**
   - 检查 RLS 策略设置
   - 确认 API 密钥权限
   - 验证数据库用户权限

4. **功能异常**
   - 检查 Netlify Functions 部署
   - 验证环境变量配置
   - 查看函数日志

## 测试评论功能

请在下方测试评论系统：

---

{{< comments-supabase >}}

<style>
.connection-test,
.table-test,
.comment-test {
  margin: 2rem 0;
  padding: 1rem;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  background: #f8f9fa;
}

.test-btn {
  background: #007cba;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.15s ease-in-out;
}

.test-btn:hover {
  background: #005a87;
}

.test-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.test-result {
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 6px;
  font-family: monospace;
  font-size: 14px;
  white-space: pre-wrap;
  max-height: 300px;
  overflow-y: auto;
}

.test-result.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.test-result.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.test-result.loading {
  background: #fff3cd;
  color: #856404;
  border: 1px solid #ffeaa7;
}

.test-result.info {
  background: #d1ecf1;
  color: #0c5460;
  border: 1px solid #bee5eb;
}
</style>

<script>
// 测试 Supabase 连接
async function testConnection() {
  const resultDiv = document.getElementById('connection-result');
  resultDiv.className = 'test-result loading';
  resultDiv.textContent = '正在测试连接...';

  try {
    const response = await fetch('/.netlify/functions/test-connection', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'test' })
    });

    const result = await response.json();
    
    if (result.success) {
      resultDiv.className = 'test-result success';
      resultDiv.textContent = `✅ ${result.message}\n\n详细信息:\n${JSON.stringify(result.details, null, 2)}`;
    } else {
      resultDiv.className = 'test-result error';
      resultDiv.textContent = `❌ ${result.message}\n\n错误信息:\n${JSON.stringify(result.details, null, 2)}`;
    }
  } catch (error) {
    resultDiv.className = 'test-result error';
    resultDiv.textContent = `❌ 测试失败: ${error.message}`;
  }
}

// 检查数据库表
async function checkTables() {
  const resultDiv = document.getElementById('table-result');
  resultDiv.className = 'test-result loading';
  resultDiv.textContent = '正在检查数据库表...';

  try {
    const response = await fetch('/.netlify/functions/get-comments?postId=/test-tables/');
    
    if (response.ok) {
      resultDiv.className = 'test-result success';
      resultDiv.textContent = '✅ 数据库表检查成功！\n\ncomments 表存在且可访问。';
    } else {
      const error = await response.json();
      resultDiv.className = 'test-result error';
      resultDiv.textContent = `❌ 表检查失败: ${error.message}`;
    }
  } catch (error) {
    resultDiv.className = 'test-result error';
    resultDiv.textContent = `❌ 检查失败: ${error.message}`;
  }
}

// 测试评论系统
async function testCommentSystem() {
  const resultDiv = document.getElementById('comment-result');
  resultDiv.className = 'test-result loading';
  resultDiv.textContent = '正在测试评论系统...';

  try {
    // 测试添加评论
    const testComment = {
      post_id: '/test-comment-system/',
      post_title: '评论系统测试',
      author: '系统测试',
      email: 'test@example.com',
      content: '这是一条测试评论，用于验证评论系统功能。',
      user_agent: 'Test System',
      ip: '127.0.0.1'
    };

    const addResponse = await fetch('/.netlify/functions/add-comment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testComment)
    });

    const addResult = await addResponse.json();

    if (addResult.success) {
      // 测试获取评论
      const getResponse = await fetch('/.netlify/functions/get-comments?postId=/test-comment-system/');
      const getResult = await getResponse.json();

      if (getResponse.ok) {
        resultDiv.className = 'test-result success';
        resultDiv.textContent = `✅ 评论系统测试成功！\n\n添加评论: 成功\n获取评论: 成功\n评论数量: ${getResult.comments ? getResult.comments.length : 0}`;
      } else {
        resultDiv.className = 'test-result error';
        resultDiv.textContent = `⚠️ 部分成功\n\n添加评论: 成功\n获取评论: 失败`;
      }
    } else {
      resultDiv.className = 'test-result error';
      resultDiv.textContent = `❌ 评论系统测试失败: ${addResult.message}`;
    }
  } catch (error) {
    resultDiv.className = 'test-result error';
    resultDiv.textContent = `❌ 测试失败: ${error.message}`;
  }
}

// 页面加载时自动运行基础测试
document.addEventListener('DOMContentLoaded', () => {
  console.log('测试页面已加载，可以开始测试...');
});
</script>
